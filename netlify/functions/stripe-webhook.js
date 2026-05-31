const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

function splitName(name) {
  const clean = (name || "").trim();
  if (!clean) return { first_name: "Customer", last_name: "Phat Gorrilla" };
  const parts = clean.split(/\s+/);
  return {
    first_name: parts[0] || "Customer",
    last_name: parts.slice(1).join(" ") || "Phat Gorrilla"
  };
}

exports.handler = async function(event) {
  let stripeEvent;

  try {
    const sig = event.headers["stripe-signature"] || event.headers["Stripe-Signature"];
    const rawBody = event.isBase64Encoded
      ? Buffer.from(event.body, "base64")
      : Buffer.from(event.body || "", "utf8");

    stripeEvent = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return { statusCode: 400, body: `Webhook error: ${err.message}` };
  }

  if (stripeEvent.type !== "checkout.session.completed") {
    return { statusCode: 200, body: "Ignored" };
  }

  try {
    const session = stripeEvent.data.object;

    const metadata = session.metadata || {};
    const shipping = session.shipping_details || {};
    const customer = session.customer_details || {};
    const address = shipping.address || customer.address || {};
    const name = splitName(shipping.name || customer.name);

    const orderBody = {
      external_id: session.id,
      label: session.id,
      line_items: [
        {
          product_id: metadata.printify_product_id,
          variant_id: Number(metadata.printify_variant_id),
          quantity: 1,
          external_id: metadata.product_key || session.id
        }
      ],
      shipping_method: 1,
      is_printify_express: false,
      is_economy_shipping: false,
      send_shipping_notification: false,
      address_to: {
        first_name: name.first_name,
        last_name: name.last_name,
        email: customer.email || "",
        phone: customer.phone || "0000000000",
        country: address.country || "GB",
        region: address.state || "",
        address1: address.line1 || "",
        address2: address.line2 || "",
        city: address.city || "",
        zip: address.postal_code || ""
      }
    };

    const res = await fetch(`https://api.printify.com/v1/shops/${process.env.PRINTIFY_SHOP_ID}/orders.json`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.PRINTIFY_API_TOKEN}`,
        "User-Agent": "PhatGorrilla-Netlify",
        "Content-Type": "application/json;charset=utf-8"
      },
      body: JSON.stringify(orderBody)
    });

    const text = await res.text();

    if (!res.ok) {
      return { statusCode: 500, body: `Printify order failed: ${text}` };
    }

    return { statusCode: 200, body: `Printify order created: ${text}` };
  } catch (err) {
    return { statusCode: 500, body: err.message };
  }
};
