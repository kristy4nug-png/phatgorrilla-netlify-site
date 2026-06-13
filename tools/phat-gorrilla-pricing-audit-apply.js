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

const PRINTIFY_TOKEN = process.env.PRINTIFY_API_TOKEN;
const PRINTIFY_SHOP_ID = process.env.PRINTIFY_WOOCOMMERCE_SHOP_ID || "27674827";
const WC_SITE = process.env.WC_SITE_URL || "https://phatgorrilla.com";
const WC_KEY = process.env.WC_CONSUMER_KEY;
const WC_SECRET = process.env.WC_CONSUMER_SECRET;
const APPLY_PRICES = process.env.APPLY_PRICES === "true";

if (!PRINTIFY_TOKEN) throw new Error("Missing PRINTIFY_API_TOKEN");
if (!WC_KEY || !WC_SECRET) throw new Error("Missing WooCommerce key pair");

const WC_AUTH = "Basic " + Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString("base64");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function gbp(value) {
  return Number(value || 0).toFixed(2);
}

function csvCell(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function kindFor(name) {
  const value = String(name || "").toLowerCase();
  const elite = value.includes("elite");
  if (value.includes("hoodie")) return elite ? "elite-hoodie" : "hoodie";
  if (value.includes("sweatshirt")) return elite ? "elite-sweatshirt" : "sweatshirt";
  if (value.includes("long sleeve")) return "long-sleeve";
  if (value.includes("tee") || value.includes("t-shirt")) return elite ? "elite-tee" : "tee";
  if (value.includes("cap")) return "cap";
  return elite ? "elite-other" : "other";
}

function friendlyRoundedPrice(raw, kind) {
  const tiers = [
    19.99,
    22.99,
    24.99,
    27.99,
    29.99,
    34.99,
    39.99,
    44.99,
    49.99,
    54.99,
    59.99,
    64.99,
    69.99,
  ];

  let minimum = raw;
  if (kind === "elite-hoodie") minimum = Math.max(minimum, 44.99);
  else if (kind === "hoodie") minimum = Math.max(minimum, 39.99);
  else if (kind === "elite-sweatshirt" || kind === "sweatshirt") minimum = Math.max(minimum, 39.99);
  else if (kind === "elite-tee") minimum = Math.max(minimum, 27.99);
  else if (kind === "long-sleeve") minimum = Math.max(minimum, 34.99);
  else if (kind === "tee") minimum = Math.max(minimum, 19.99);
  else if (kind === "cap") minimum = Math.max(minimum, 22.99);

  return tiers.find((tier) => tier >= minimum - 0.001) || Math.ceil(minimum) - 0.01;
}

function flagPrice(productName, current, recommendedRaw, rounded) {
  const value = String(productName || "").toLowerCase();
  const looksHigh =
    rounded >= 55 ||
    ((value.includes("tee") || value.includes("t-shirt")) && rounded > 34.99 && !value.includes("long sleeve")) ||
    (value.includes("cap") && rounded > 24.99);

  if (current > rounded + 2) return looksHigh ? "overpriced; recommended still high" : "overpriced";
  if (current < recommendedRaw - 0.75) return looksHigh ? "underpriced; recommended high" : "underpriced";
  return looksHigh ? "price looks high for customer" : "ok";
}

async function request(url, options = {}, attempts = 7) {
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
    await sleep(5000 * (attempt + 1));
  }
  throw new Error(`${response.status}: ${typeof data === "string" ? data.slice(0, 300) : JSON.stringify(data).slice(0, 500)}`);
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

function printify(path) {
  return request(`https://api.printify.com/v1${path}`, {
    headers: {
      Authorization: `Bearer ${PRINTIFY_TOKEN}`,
      "Content-Type": "application/json",
    },
  });
}

async function getAllWooProducts() {
  const products = [];
  for (let page = 1; ; page += 1) {
    const chunk = await woo(`/products?per_page=100&page=${page}`);
    products.push(...chunk);
    if (chunk.length < 100) return products;
  }
}

async function getAllVariations(productId) {
  const variations = [];
  for (let page = 1; ; page += 1) {
    const chunk = await woo(`/products/${productId}/variations?per_page=100&page=${page}`);
    variations.push(...chunk);
    if (chunk.length < 100) return variations;
  }
}

async function buildPrintifySkuMap() {
  const list = (await printify(`/shops/${PRINTIFY_SHOP_ID}/products.json?limit=50`)).data || [];
  const map = new Map();
  for (const summary of list) {
    const detail = await printify(`/shops/${PRINTIFY_SHOP_ID}/products/${summary.id}.json`);
    for (const variant of detail.variants || []) {
      if (variant.sku) {
        map.set(String(variant.sku), { product: detail, variant });
      }
    }
  }
  return map;
}

async function shippingReport() {
  const zones = await woo("/shipping/zones");
  const rows = [];
  for (const zone of zones) {
    const methods = await woo(`/shipping/zones/${zone.id}/methods`);
    for (const method of methods) {
      rows.push({
        zone: zone.name,
        method: method.title,
        enabled: method.enabled,
        method_id: method.method_id,
        cost: method.settings?.cost?.value || "",
      });
    }
  }
  return rows;
}

function summarizeByProduct(rows) {
  const grouped = new Map();
  for (const row of rows.filter((item) => !item.missing)) {
    if (!grouped.has(row.product)) grouped.set(row.product, []);
    grouped.get(row.product).push(row);
  }
  return grouped;
}

async function applyProductPrices(rows) {
  const byProduct = new Map();
  for (const row of rows.filter((item) => !item.missing && item.variantId)) {
    if (!byProduct.has(row.productId)) byProduct.set(row.productId, []);
    byProduct.get(row.productId).push(row);
  }

  let changed = 0;
  for (const [productId, productRows] of byProduct) {
    const updates = productRows
      .filter((row) => Number(row.current.toFixed(2)) !== Number(row.rounded.toFixed(2)))
      .map((row) => ({
        id: row.variantId,
        regular_price: gbp(row.rounded),
      }));

    for (let i = 0; i < updates.length; i += 80) {
      const update = updates.slice(i, i + 80);
      if (!update.length) continue;
      await woo(`/products/${productId}/variations/batch`, {
        method: "POST",
        body: JSON.stringify({ update }),
      });
      changed += update.length;
      await sleep(2200);
    }
  }
  return changed;
}

function writeReports(rows, shipping, changedCount) {
  fs.mkdirSync("docs", { recursive: true });

  const csv = [
    [
      "Product ID",
      "Product",
      "Variant ID",
      "Variant",
      "SKU",
      "Printify cost GBP",
      "Postage allowance GBP",
      "Landed cost GBP",
      "Current Woo price GBP",
      "Recommended raw GBP",
      "Recommended rounded GBP",
      "Estimated profit GBP",
      "Estimated margin %",
      "Flag",
    ].map(csvCell).join(","),
  ];

  for (const row of rows) {
    csv.push([
      row.productId,
      row.product,
      row.variantId,
      row.variant,
      row.sku,
      row.missing ? "MISSING" : gbp(row.cost),
      row.missing ? "" : "4.99",
      row.missing ? "" : gbp(row.landed),
      gbp(row.current),
      row.missing ? "" : gbp(row.recommendedRaw),
      row.missing ? "" : gbp(row.rounded),
      row.missing ? "" : gbp(row.profit),
      row.missing ? "" : gbp(row.margin),
      row.missing ? "missing Printify SKU/cost match" : row.flag,
    ].map(csvCell).join(","));
  }

  fs.writeFileSync("docs/PHAT_GORRILLA_PRICING_AUDIT.csv", csv.join("\n"));

  const grouped = summarizeByProduct(rows);
  const md = [];
  md.push("# Phat Gorrilla Pricing Audit");
  md.push("");
  md.push("Generated: 2026-06-07");
  md.push("");
  md.push(APPLY_PRICES ? `Live WooCommerce variation prices updated: ${changedCount}` : "No live prices were changed.");
  md.push("");
  md.push("## Formula");
  md.push("");
  md.push("- `landed_cost = printify_production_cost + 4.99`");
  md.push("- `recommended_sale_price = landed_cost / 0.85`");
  md.push("- This uses a true 15% margin after production cost and a GBP 4.99 postage allowance.");
  md.push("");
  md.push("## Shipping Check");
  md.push("");
  if (shipping.length) {
    for (const item of shipping) {
      md.push(`- ${item.zone}: ${item.method} (${item.enabled ? "enabled" : "disabled"})${item.cost ? ` cost ${item.cost}` : ""}`);
    }
  } else {
    md.push("- No WooCommerce shipping methods were returned by the API.");
  }
  md.push("");
  md.push("Important: if checkout shipping is still charged separately, building GBP 4.99 into product prices can partly double-count postage. Earlier setup notes mentioned Standard shipping at GBP 10.00, so checkout shipping should be reviewed after this pricing pass.");
  md.push("");
  md.push("## Product Summary");
  md.push("");
  md.push("| Product | Variants | Current range before update | Printify cost range | Raw recommendation range | Rounded price range | Status |");
  md.push("|---|---:|---:|---:|---:|---:|---|");
  for (const [product, list] of grouped) {
    const values = (key) => list.map((row) => row[key]);
    const min = (key) => Math.min(...values(key));
    const max = (key) => Math.max(...values(key));
    const flags = [...new Set(list.map((row) => row.flag))].join("; ");
    md.push(`| ${product.replace(/\|/g, "/")} | ${list.length} | GBP ${gbp(min("current"))}-GBP ${gbp(max("current"))} | GBP ${gbp(min("cost"))}-GBP ${gbp(max("cost"))} | GBP ${gbp(min("recommendedRaw"))}-GBP ${gbp(max("recommendedRaw"))} | GBP ${gbp(min("rounded"))}-GBP ${gbp(max("rounded"))} | ${flags} |`);
  }

  const missing = rows.filter((row) => row.missing);
  if (missing.length) {
    md.push("");
    md.push("## Missing Printify Cost Matches");
    md.push("");
    for (const row of missing.slice(0, 80)) {
      md.push(`- ${row.product} / ${row.variant || "simple"} / SKU ${row.sku || "none"}`);
    }
  }

  md.push("");
  md.push("## Pricing Options");
  md.push("");
  md.push("- Option A used here: product price includes a GBP 4.99 postage allowance and true 15% margin.");
  md.push("- Option B later: production cost plus true margin only, with checkout shipping covering postage.");
  md.push("- Option C later: reduce checkout shipping and include part of postage in product price.");
  fs.writeFileSync("docs/PHAT_GORRILLA_PRICING_AUDIT.md", md.join("\n"));
}

async function main() {
  const skuMap = await buildPrintifySkuMap();
  const products = await getAllWooProducts();
  const rows = [];

  for (const product of products) {
    const variations = product.type === "variable" ? await getAllVariations(product.id) : [];
    for (const variation of variations) {
      const match = skuMap.get(String(variation.sku || ""));
      const variantLabel = (variation.attributes || []).map((attr) => `${attr.name}: ${attr.option}`).join(" / ");
      if (!match) {
        rows.push({
          productId: product.id,
          product: product.name,
          variantId: variation.id,
          variant: variantLabel,
          sku: variation.sku || "",
          current: Number(variation.regular_price || variation.price || 0),
          missing: true,
        });
        continue;
      }

      const cost = (match.variant.cost || 0) / 100;
      const landed = cost + 4.99;
      const recommendedRaw = landed / 0.85;
      const rounded = friendlyRoundedPrice(recommendedRaw, kindFor(product.name));
      const profit = rounded - landed;
      const margin = rounded > 0 ? (profit / rounded) * 100 : 0;
      rows.push({
        productId: product.id,
        product: product.name,
        variantId: variation.id,
        variant: variantLabel,
        sku: variation.sku || "",
        current: Number(variation.regular_price || variation.price || 0),
        cost,
        landed,
        recommendedRaw,
        rounded,
        profit,
        margin,
        flag: flagPrice(product.name, Number(variation.regular_price || variation.price || 0), recommendedRaw, rounded),
      });
    }
  }

  const shipping = await shippingReport();
  const changedCount = APPLY_PRICES ? await applyProductPrices(rows) : 0;
  writeReports(rows, shipping, changedCount);

  console.log(JSON.stringify({
    apply: APPLY_PRICES,
    products: products.length,
    variants: rows.length,
    matched: rows.filter((row) => !row.missing).length,
    missing: rows.filter((row) => row.missing).length,
    changed: changedCount,
    report: "docs/PHAT_GORRILLA_PRICING_AUDIT.md",
    csv: "docs/PHAT_GORRILLA_PRICING_AUDIT.csv",
    shipping,
  }, null, 2));
}

main().catch((error) => {
  console.log(`RUN FAILED ${error.message}`);
  process.exit(1);
});
