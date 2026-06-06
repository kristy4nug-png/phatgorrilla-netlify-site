const SHOP_ID = process.env.PRINTIFY_SHOP_ID || "27674090";
const API_BASE = "https://api.printify.com/v1";
const MAX_PRODUCTS = 80;

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": statusCode === 200
        ? "public, max-age=60, s-maxage=300"
        : "no-store"
    },
    body: JSON.stringify(body)
  };
}

function cleanText(value, maxLength = 220) {
  return String(value || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function money(pence) {
  const amount = Number(pence || 0);
  return `£${(amount / 100).toFixed(2)}`;
}

function enabledVariants(product) {
  return (product.variants || [])
    .filter(variant => variant && variant.is_enabled !== false && Number(variant.price) > 0)
    .sort((a, b) => Number(Boolean(b.is_default)) - Number(Boolean(a.is_default)));
}

function splitVariantTitle(title) {
  return String(title || "")
    .split("/")
    .map(part => part.trim())
    .filter(Boolean);
}

function variantSummary(variants) {
  const sizeWords = new Set(["xs", "s", "m", "l", "xl", "2xl", "3xl", "4xl", "5xl", "6xl", "one size"]);
  const colors = new Set();
  const sizes = new Set();

  variants.forEach(variant => {
    splitVariantTitle(variant.title).forEach(part => {
      const normalized = part.toLowerCase();
      if (sizeWords.has(normalized) || /^\d+xl$/.test(normalized)) {
        sizes.add(part.toUpperCase());
      } else {
        colors.add(part);
      }
    });
  });

  return {
    colours: Array.from(colors).slice(0, 8).join(", ") || "Colours shown on product page",
    sizes: Array.from(sizes).slice(0, 10).join(", ") || "Sizes shown on product page"
  };
}

function productType(title) {
  const lower = String(title || "").toLowerCase();
  if (lower.includes("hoodie")) return "Hoodie";
  if (lower.includes("sweatshirt") || lower.includes("crewneck")) return "Sweatshirt";
  if (lower.includes("poster")) return "Poster";
  if (lower.includes("tee") || lower.includes("t-shirt") || lower.includes("shirt")) return "T-Shirt";
  return "Printify product";
}

function getMarkupPence(type) {
  // £3 markup for T-Shirts, £8 for everything else
  if (type === "T-Shirt") return 300;
  return 800;
}

function applyMarkup(pricePence, type) {
  const markup = getMarkupPence(type);
  return Number(pricePence) + markup;
}

function bestImage(product, variantId) {
  const images = product.images || [];
  const byVariant = images.find(image =>
    image && image.src && Array.isArray(image.variant_ids) && image.variant_ids.includes(Number(variantId))
  );
  const defaultImage = images.find(image => image && image.src && image.is_default);
  const firstImage = images.find(image => image && image.src);
  return (byVariant || defaultImage || firstImage || {}).src || "";
}

function publicProduct(product, includeVariants = false) {
  const variants = enabledVariants(product);
  const defaultVariant = variants.find(variant => variant.is_default) || variants[0];
  const type = productType(product.title);
  const prices = variants.map(variant => applyMarkup(variant.price, type)).filter(Boolean);
  const low = Math.min(...prices);
  const high = Math.max(...prices);
  const summary = variantSummary(variants);
  const description = cleanText(product.description, 320) ||
    "Premium Phat Gorrilla streetwear. Secure GBP checkout powered by Stripe. Printed and fulfilled by Printify.";

  const item = {
    id: product.id,
    title: cleanText(product.title, 120),
    description,
    price_from: money(low),
    price_to: money(high),
    min_price: low,
    max_price: high,
    image: bestImage(product, defaultVariant.id),
    drop: String(product.title || "").toLowerCase().includes("world cup") ? "World Cup" : "Live Printify Drop",
    type: type,
    colours: summary.colours,
    sizes: summary.sizes,
    updated_at: product.updated_at || product.created_at || "",
    product_url: `/product.html?id=${encodeURIComponent(product.id)}`,
    default_checkout_url: `/.netlify/functions/create-checkout-session?printify_product_id=${encodeURIComponent(product.id)}&variant_id=${encodeURIComponent(defaultVariant.id)}`
  };

  if (includeVariants) {
    item.variants = variants.map(variant => ({
      id: variant.id,
      title: cleanText(variant.title, 90),
      price: money(applyMarkup(variant.price, type)),
      price_pence: applyMarkup(variant.price, type),
      image: bestImage(product, variant.id)
    }));
  }

  return item;
}

async function printifyFetch(path) {
  const token = process.env.PRINTIFY_API_TOKEN;
  if (!token) {
    const error = new Error("Printify API is not configured.");
    error.statusCode = 500;
    throw error;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "User-Agent": "PhatGorrilla-Netlify",
      "Accept": "application/json"
    }
  });

  if (!response.ok) {
    const error = new Error("Printify product lookup failed.");
    error.statusCode = response.status;
    throw error;
  }

  return response.json();
}

function isPublicProduct(product) {
  return product &&
    product.visible === true &&
    product.is_locked !== true &&
    enabledVariants(product).length > 0;
}

async function getProduct(productId) {
  const product = await printifyFetch(`/shops/${SHOP_ID}/products/${encodeURIComponent(productId)}.json`);
  if (!isPublicProduct(product)) {
    const error = new Error("Product is not published.");
    error.statusCode = 404;
    throw error;
  }
  return product;
}

async function listProducts() {
  const products = [];
  let page = 1;
  let lastPage = 1;

  do {
    const payload = await printifyFetch(`/shops/${SHOP_ID}/products.json?page=${page}`);
    const batch = Array.isArray(payload) ? payload : (payload.data || []);
    products.push(...batch);
    lastPage = Number(payload.last_page || payload.total_pages || page);
    page += 1;
  } while (page <= lastPage && products.length < MAX_PRODUCTS);

  return products
    .filter(isPublicProduct)
    .sort((a, b) => String(b.updated_at || b.created_at || "").localeCompare(String(a.updated_at || a.created_at || "")))
    .slice(0, MAX_PRODUCTS)
    .map(product => publicProduct(product, false));
}

exports.handler = async function(event) {
  try {
    const params = event.queryStringParameters || {};
    const productId = params.id;

    if (productId) {
      const product = await getProduct(productId);
      return json(200, {
        shop_id: SHOP_ID,
        product: publicProduct(product, true)
      });
    }

    const products = await listProducts();
    return json(200, {
      shop_id: SHOP_ID,
      count: products.length,
      products
    });
  } catch (error) {
    return json(error.statusCode || 500, {
      error: error.statusCode === 404 ? "Product not found." : "Printify products are not available right now."
    });
  }
};
