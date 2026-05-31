const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const PRODUCTS = require("../../data/stripe-printify-map.json");

exports.handler = async function(event) {
  try {
    const key = event.queryStringParameters && event.queryStringParameters.key;
    const product = PRODUCTS[key];

    if (!key || !product) {
      return {
        statusCode: 404,
        headers: { "Content-Type": "text/plain" },
        body: "Product not found."
      };
    }

    const siteUrl = process.env.SITE_URL || "https://phatgorrilla.com";

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
              amount: 499,
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
      client_reference_id: key,
      metadata: {
        product_key: key,
        printify_product_id: product.printify_product_id,
        printify_variant_id: String(product.printify_variant_id),
        product_title: product.title,
        variant_title: product.variant_title
      },
      success_url: `${siteUrl}/thank-you.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/shop.html`
    });

    return {
      statusCode: 303,
      headers: { Location: session.url },
      body: ""
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "text/plain" },
      body: err.message
    };
  }
};
