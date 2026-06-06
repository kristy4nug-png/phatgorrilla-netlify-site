const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY || "sk_test_missing");
let PRODUCTS = {};
try {
  PRODUCTS = require("../../data/stripe-printify-map.json");
} catch (e) {
  console.warn("Static product map not found, using dynamic Printify only");
}
const PRINTIFY_API_BASE = "https://api.printify.com/v1";
const PRINTIFY_SHOP_ID = process.env.PRINTIFY_SHOP_ID || "27674090";

function cleanText(value, maxLength = 140) {
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

function bestImage(product, variantId) {
  const images = product.images || [];
  const byVariant = images.find(image =>
    image && image.src && Array.isArray(image.variant_ids) && image.variant_ids.includes(Number(variantId))
  );
  const defaultImage = images.find(image => image && image.src && image.is_default);
  const firstImage = images.find(image => image && image.src);
  return (byVariant || defaultImage || firstImage || {}).src || "";
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

async function getLivePrintifyProduct(productId, variantId) {
  const token = process.env.PRINTIFY_API_TOKEN;
  if (!token) {
    const error = new Error("Printify API is not configured.");
    error.statusCode = 500;
    throw error;
  }

  const response = await fetch(`${PRINTIFY_API_BASE}/shops/${PRINTIFY_SHOP_ID}/products/${encodeURIComponent(productId)}.json`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "User-Agent": "PhatGorrilla-Netlify",
      "Accept": "application/json"
    }
  });

  if (!response.ok) {
    const error = new Error("Product not found.");
    error.statusCode = 404;
    throw error;
  }

  const printifyProduct = await response.json();
  const variant = (printifyProduct.variants || []).find(item =>
    Number(item.id) === Number(variantId) && item.is_enabled !== false && Number(item.price) > 0
  );

  if (printifyProduct.visible !== true || printifyProduct.is_locked === true || !variant) {
    const error = new Error("Product not available.");
    error.statusCode = 404;
    throw error;
  }

  const type = productType(printifyProduct.title);
  const basePricePence = Number(variant.price);
  const markupPence = getMarkupPence(type);
  const isGildan5000 = Number(printifyProduct.blueprint_id) === 6 || Number(printifyProduct.blueprint_id) === 157 || String(printifyProduct.title || "").toLowerCase().includes("gildan 5000");
  const finalPricePence = isGildan5000 ? 1999 : (basePricePence + markupPence);

  return {
    title: cleanText(printifyProduct.title),
    variant_title: cleanText(variant.title, 90),
    printify_product_id: printifyProduct.id,
    printify_variant_id: Number(variant.id),
    product_type: type,
    currency: "gbp",
    base_price_pence: basePricePence,
    markup_pence: markupPence,
    stripe_amount_pence: finalPricePence,
    price_gbp: (finalPricePence / 100).toFixed(2),
    image_url: bestImage(printifyProduct, variant.id),
    blueprint_id: Number(printifyProduct.blueprint_id)
  };
}

exports.handler = async function(event) {
  try {
    // Validate configuration
    if (!process.env.STRIPE_SECRET_KEY) {
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          success: false,
          error: "Stripe is not configured. Please add STRIPE_SECRET_KEY environment variable."
        })
      };
    }

    const params = event.queryStringParameters || {};
    const key = params.key;
    const dynamicProductId = params.printify_product_id;
    const dynamicVariantId = params.variant_id;
    let product = key ? PRODUCTS[key] : null;
    let referenceId = key;

    if (!product && dynamicProductId && dynamicVariantId) {
      product = await getLivePrintifyProduct(dynamicProductId, dynamicVariantId);
      referenceId = `printify-${dynamicProductId}-${dynamicVariantId}`;
    }

    const isGildan5000Product = product && (
      Number(product.blueprint_id) === 6 ||
      Number(product.blueprint_id) === 157 ||
      (product.title && product.title.toLowerCase().includes("gildan 5000")) ||
      (referenceId && referenceId.toLowerCase().includes("gildan-5000"))
    );

    if (isGildan5000Product) {
      product.stripe_amount_pence = 1999;
      product.price_gbp = "19.99";
    }

    if (!referenceId || !product) {
      return {
        statusCode: 404,
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          success: false,
          error: "Product not found."
        })
      };
    }

    const shippingPrice = isGildan5000Product ? 600 : 499;
    const siteUrl = process.env.SHOP_URL || process.env.SITE_URL || "https://shop.phatgorrilla.com";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      phone_number_collection: { enabled: true },
      shipping_address_collection: {
        allowed_countries: ["GB"]
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: shippingPrice,
              currency: "gbp"
            },
            display_name: "UK Standard Delivery"
          }
        }
      ],
      line_items: [
        {
          price_data: {
            currency: "gbp",
            unit_amount: product.stripe_amount_pence,
            product_data: {
              name: `${product.title} - ${product.variant_title}`,
              images: product.image_url ? [product.image_url] : []
            }
          },
          quantity: 1
        }
      ],
      client_reference_id: referenceId,
      metadata: {
        product_key: referenceId,
        printify_product_id: product.printify_product_id,
        printify_variant_id: String(product.printify_variant_id),
        product_title: product.title,
        variant_title: product.variant_title
      },
      success_url: `${siteUrl}/thank-you.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/shop/`
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        success: true,
        sessionId: session.id,
        url: session.url,
        amount_total: session.amount_total,
        currency: session.currency
      })
    };
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        success: false,
        error: err.message || "Checkout session creation failed"
      })
    };
  }
};
