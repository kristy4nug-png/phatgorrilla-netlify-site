const fs = require("fs");

function loadEnv(path) {
  if (!fs.existsSync(path)) return;
  for (const line of fs.readFileSync(path, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, "");
    }
  }
}

loadEnv(".env.local");

const WC_SITE = process.env.WC_SITE_URL || "https://phatgorrilla.com";
const WC_KEY = process.env.WC_CONSUMER_KEY;
const WC_SECRET = process.env.WC_CONSUMER_SECRET;
const WP_USER = process.env.WP_USER;
const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD;
const APPLY = process.env.APPLY_CART_FIX === "true";
const PATCH_CLASSIC_PAGES = process.env.PATCH_CLASSIC_PAGES === "true";
const NORMALISE = process.env.NORMALISE_DESCRIPTIONS === "true";
const ADD_DESCRIPTION_HELPER = process.env.ADD_DESCRIPTION_CART_FIX === "true";

if (!WC_KEY || !WC_SECRET) {
  throw new Error("Missing WC_CONSUMER_KEY or WC_CONSUMER_SECRET");
}

const WC_AUTH = "Basic " + Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString("base64");
const WP_AUTH =
  WP_USER && WP_APP_PASSWORD
    ? "Basic " + Buffer.from(`${WP_USER}:${WP_APP_PASSWORD}`).toString("base64")
    : "";
const CLEAN = process.env.CLEAN_CART_FIX === "true";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function request(url, options = {}, attempts = 6) {
  let response;
  let data;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    response = await fetch(url, options);
    const text = await response.text();
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
    if (response.ok) return data;
    if (response.status !== 429 && response.status < 500) break;
    await sleep(3000 * (attempt + 1));
  }
  const preview = typeof data === "string" ? data.slice(0, 300) : JSON.stringify(data).slice(0, 500);
  throw new Error(`${response.status}: ${preview}`);
}

function woo(path, options = {}) {
  return request(`${WC_SITE}/wp-json/wc/v3${path}`, {
    ...options,
    headers: {
      Authorization: WC_AUTH,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
}

function wp(path, options = {}) {
  if (!WP_AUTH) throw new Error("Missing WP_USER or WP_APP_PASSWORD for WordPress page updates");
  return request(`${WC_SITE}/wp-json/wp/v2${path}`, {
    ...options,
    headers: {
      Authorization: WP_AUTH,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
}

async function getAllProducts() {
  const products = [];
  for (let page = 1; ; page += 1) {
    const chunk = await woo(`/products?status=publish&per_page=100&page=${page}`);
    products.push(...chunk);
    if (chunk.length < 100) return products;
  }
}

const marker = "PG_WC_STORE_API_CART_FIX_V1";

const cartFixScript = `<script id="pg-wc-store-api-cart-fix">
(function(){
  if (window.${marker}) return;
  window.${marker} = true;

  function nonceFromPage(){
    if (window.wc_stripe_express_checkout_params && window.wc_stripe_express_checkout_params.nonce) {
      return window.wc_stripe_express_checkout_params.nonce.wc_store_api || "";
    }
    var html = document.documentElement.innerHTML;
    var match = html.match(/"wc_store_api":"([^"]+)"/);
    return match ? match[1] : "";
  }

  function showMessage(form, text, ok){
    var existing = document.querySelector(".pg-cart-flow-message");
    if (existing) existing.remove();
    var message = document.createElement("div");
    message.className = "woocommerce-" + (ok ? "message" : "error") + " pg-cart-flow-message";
    message.setAttribute("role", "alert");
    message.textContent = text;
    var target = document.querySelector(".woocommerce-notices-wrapper") || form.parentNode;
    target.insertBefore(message, target.firstChild);
  }

  function postJson(url, payload, nonce, done){
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.withCredentials = true;
    xhr.setRequestHeader("Content-Type", "application/json");
    if (nonce) xhr.setRequestHeader("Nonce", nonce);
    xhr.onreadystatechange = function(){
      if (xhr.readyState !== 4) return;
      var json = {};
      try { json = JSON.parse(xhr.responseText || "{}"); } catch (e) {}
      done(xhr.status >= 200 && xhr.status < 300, json);
    };
    xhr.send(JSON.stringify(payload));
  }

  document.addEventListener("submit", function(event){
    var form = event.target;
    if (!form || !form.matches || !form.matches("form.cart")) return;
    if (!form.querySelector("input[name='add-to-cart'], input[name='product_id']")) return;

    var variationId = form.querySelector("input.variation_id");
    var productId = form.querySelector("input[name='product_id'], input[name='add-to-cart']");
    var quantity = form.querySelector("input.qty");
    var selectedId = variationId && variationId.value && variationId.value !== "0" ? variationId.value : productId && productId.value;
    var id = parseInt(selectedId, 10);
    var qty = Math.max(1, parseInt(quantity && quantity.value ? quantity.value : "1", 10) || 1);
    var nonce = nonceFromPage();

    if (!id || !nonce) return;

    event.preventDefault();
    var button = form.querySelector(".single_add_to_cart_button");
    if (button) {
      button.disabled = true;
      button.classList.add("loading");
    }

    postJson("/wp-json/wc/store/v1/cart/add-item", { id: id, quantity: qty }, nonce, function(ok, json){
      if (button) {
        button.disabled = false;
        button.classList.remove("loading");
      }
      if (!ok) {
        showMessage(form, json.message || "Please check your options and try again.", false);
        return;
      }
      showMessage(form, "Added to basket. Opening basket...", true);
      window.location.href = "/cart/";
    });
  }, true);
})();
</script>`;

function appendFix(description) {
  const value = String(description || "");
  if (value.includes(marker) || value.includes("pg-wc-store-api-cart-fix")) return value;
  return `${value}\n${cartFixScript}`;
}

function removeFix(description) {
  const value = String(description || "");
  const markerIndex = value.indexOf(marker);
  const scriptIndex = value.indexOf("pg-wc-store-api-cart-fix");
  const index = markerIndex >= 0 ? markerIndex : scriptIndex;
  if (index < 0) return normaliseDescription(value);

  const scriptStart = value.lastIndexOf("<script", index);
  if (scriptStart >= 0) return normaliseDescription(value.slice(0, scriptStart));

  const functionStart = value.lastIndexOf("(function(){", index);
  if (functionStart >= 0) return normaliseDescription(value.slice(0, functionStart));

  return normaliseDescription(value.slice(0, index));
}

function normaliseDescription(description) {
  return String(description || "")
    .replace(/<p>\s*$/i, "")
    .replace(/<p>\s*<\/p>\s*$/i, "")
    .trim();
}

async function updateProducts() {
  if (ADD_DESCRIPTION_HELPER) {
    throw new Error("Product description script injection is disabled. Use the active Code Snippets snippet instead.");
  }

  const products = await getAllProducts();
  const targetProducts = products.filter((product) => ["simple", "variable"].includes(product.type));
  const updates = [];

  for (const product of targetProducts) {
    const currentDescription = product.description || "";
    const description = CLEAN || NORMALISE
      ? removeFix(currentDescription)
      : currentDescription;
    if (description !== (product.description || "")) {
      updates.push({ id: product.id, description });
    }
  }

  console.log(`Published products checked: ${products.length}`);
  console.log(`${CLEAN || NORMALISE ? "Products needing description cleanup" : "Product description changes requested"}: ${updates.length}`);

  if (!APPLY) {
    console.log("Dry run only. Set APPLY_CART_FIX=true to update products.");
    console.log("Note: product-description script injection is intentionally disabled.");
    return { products, updates, changed: 0 };
  }

  let changed = 0;
  for (let i = 0; i < updates.length; i += 50) {
    const batch = updates.slice(i, i + 50);
    await woo("/products/batch", {
      method: "POST",
      body: JSON.stringify({ update: batch }),
    });
    changed += batch.length;
    await sleep(1500);
  }

  console.log(`Products ${CLEAN || NORMALISE ? "cleaned" : "updated"}: ${changed}`);
  return { products, updates, changed };
}

async function patchClassicPages() {
  if (!PATCH_CLASSIC_PAGES) {
    console.log("Cart/checkout page content unchanged. Set PATCH_CLASSIC_PAGES=true to switch to classic shortcodes.");
    return;
  }
  await wp("/pages/8", {
    method: "POST",
    body: JSON.stringify({
      content: "[woocommerce_cart]",
      status: "publish",
      comment_status: "closed",
      ping_status: "closed",
    }),
  });
  await sleep(1000);
  await wp("/pages/9", {
    method: "POST",
    body: JSON.stringify({
      content: "[woocommerce_checkout]",
      status: "publish",
      comment_status: "closed",
      ping_status: "closed",
    }),
  });
  console.log("Cart and checkout pages switched to classic WooCommerce shortcodes.");
}

async function main() {
  await updateProducts();
  await patchClassicPages();
}

main().catch((error) => {
  console.error(`RUN FAILED: ${error.message}`);
  process.exit(1);
});
