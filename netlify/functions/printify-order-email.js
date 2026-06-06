const crypto = require("crypto");
const nodemailer = require("nodemailer");

const SHOP_URL = process.env.SHOP_URL || "https://shop.phatgorrilla.com";
const BRAND_SITE_URL = process.env.BRAND_SITE_URL || process.env.SITE_URL || "https://phatgorrilla.com";
const BRAND_NAME = "Phat Gorrilla";
const OWNER_EMAIL = process.env.OWNER_EMAIL || "kristy4nug@gmail.com";

function json(statusCode, body) {
  return {
    statusCode,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  };
}

function getHeader(headers, name) {
  const key = Object.keys(headers || {}).find((item) => item.toLowerCase() === name.toLowerCase());
  return key ? headers[key] : "";
}

function verifySignature(rawBody, signatureHeader) {
  const secret = process.env.PRINTIFY_WEBHOOK_SECRET;
  if (!secret) return true;
  if (!signatureHeader || !signatureHeader.startsWith("sha256=")) return false;

  const expected = "sha256=" + crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(signatureHeader), Buffer.from(expected));
}

function moneyFromPence(value) {
  if (!Number.isFinite(value)) return "";
  return `£${(value / 100).toFixed(2)}`;
}

function buildEmail(order) {
  const customer = order.address_to || {};
  const firstName = customer.first_name || "there";
  const items = Array.isArray(order.line_items) ? order.line_items : [];
  const orderLabel = order.metadata?.shop_order_label || order.app_order_id || order.id || "your order";
  const productRows = items.map((item) => {
    const title = item.metadata?.title || "Phat Gorrilla item";
    const variant = item.metadata?.variant_label ? `<br><span>${item.metadata.variant_label}</span>` : "";
    return `<li><strong>${title}</strong>${variant}</li>`;
  }).join("");

  const logo = `${BRAND_SITE_URL}/Phat%20Gorrilla%20_%20Local-first%20command%20power_files/brand-wordmark-pink-green-clean.png`;
  const signature = `${BRAND_SITE_URL}/Phat%20Gorrilla%20_%20Local-first%20command%20power_files/signature-wide-powered-by.jpg`;
  const appUrl = process.env.APP_ACCESS_URL || `${BRAND_SITE_URL}/app.html`;
  const storeUrl = `${SHOP_URL}/`;
  const displayTotal = moneyFromPence(order.total_price);

  const subject = `Thank you for your ${BRAND_NAME} order`;
  const text = [
    `Hi ${firstName},`,
    "",
    `Thank you for your ${BRAND_NAME} order (${orderLabel}).`,
    "Your free companion app access is included with this purchase:",
    appUrl,
    "",
    "We have received your order and Printify will handle fulfilment and delivery updates.",
    displayTotal ? `Order total shown by the fulfilment system: ${displayTotal}` : "",
    "",
    "Thank you for supporting Phat Gorrilla.",
    "The Phat Gorrilla team",
  ].filter(Boolean).join("\n");

  const html = `
<!doctype html>
<html>
  <body style="margin:0;background:#f5f7fb;color:#05070b;font-family:Segoe UI,Arial,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f7fb;padding:28px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border:1px solid #dfe5ee;border-radius:8px;overflow:hidden;">
            <tr>
              <td style="background:#05070b;padding:22px;text-align:center;border-bottom:4px solid #24f087;">
                <img src="${logo}" alt="${BRAND_NAME}" style="max-width:320px;width:88%;height:auto;display:block;margin:0 auto;">
              </td>
            </tr>
            <tr>
              <td style="padding:28px 28px 10px;">
                <p style="margin:0 0 12px;color:#ff2da8;font-size:13px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;">Order received</p>
                <h1 style="margin:0 0 14px;font-size:30px;line-height:1.05;color:#05070b;">Thank you, ${firstName}.</h1>
                <p style="margin:0 0 16px;color:#667085;font-size:16px;line-height:1.55;">Your ${BRAND_NAME} order has been received. Printify will handle the fulfilment side, and your free companion app access is included with this purchase.</p>
                <div style="border-left:5px solid #ff2da8;background:#f5f7fb;border-radius:8px;padding:16px;margin:18px 0;">
                  <strong style="color:#05070b;">Free companion app access</strong>
                  <p style="margin:8px 0 0;color:#667085;line-height:1.5;">Use it to organise useful apps, compare tool combinations, plan workflows, and keep local-first command notes in one place.</p>
                </div>
                <p style="margin:18px 0;">
                  <a href="${appUrl}" style="display:inline-block;background:#24f087;color:#05070b;text-decoration:none;font-weight:900;text-transform:uppercase;padding:12px 16px;border-radius:8px;">Open The App</a>
                  <a href="${storeUrl}" style="display:inline-block;background:#05070b;color:#ffffff;text-decoration:none;font-weight:900;text-transform:uppercase;padding:12px 16px;border-radius:8px;margin-left:8px;">Back To Store</a>
                </p>
                <h2 style="font-size:16px;text-transform:uppercase;margin:24px 0 8px;">Order summary</h2>
                <p style="margin:0 0 8px;color:#667085;">Order reference: ${orderLabel}</p>
                ${displayTotal ? `<p style="margin:0 0 8px;color:#667085;">Order total: ${displayTotal}</p>` : ""}
                ${productRows ? `<ul style="margin:12px 0 0;padding-left:20px;color:#667085;line-height:1.5;">${productRows}</ul>` : ""}
                <p style="margin:24px 0 0;color:#667085;line-height:1.55;">Thanks again for supporting the brand. It genuinely means a lot.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:10px 28px 28px;">
                <img src="${signature}" alt="Powered by Phat Gorrilla" style="max-width:260px;width:70%;height:auto;display:block;">
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { subject, text, html };
}

async function getOrder(shopId, orderId) {
  const token = process.env.PRINTIFY_API_TOKEN;
  if (!token) throw new Error("PRINTIFY_API_TOKEN is not configured.");

  const response = await fetch(`https://api.printify.com/v1/shops/${shopId}/orders/${orderId}.json`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "User-Agent": "phat-gorrilla-netlify-email",
    },
  });

  if (!response.ok) {
    throw new Error(`Printify order lookup failed: ${response.status}`);
  }

  return response.json();
}

async function sendEmail(order) {
  const smtpUser = process.env.GMAIL_USER || OWNER_EMAIL;
  const smtpPass = process.env.GMAIL_APP_PASSWORD;
  if (!smtpPass) throw new Error("GMAIL_APP_PASSWORD is not configured.");

  const recipient = order.address_to?.email;
  if (!recipient) throw new Error("Order has no customer email address.");

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: smtpUser, pass: smtpPass },
  });

  const email = buildEmail(order);
  await transporter.sendMail({
    from: `"${BRAND_NAME}" <${smtpUser}>`,
    to: recipient,
    bcc: OWNER_EMAIL,
    subject: email.subject,
    text: email.text,
    html: email.html,
  });
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed" });

  const rawBody = event.isBase64Encoded ? Buffer.from(event.body || "", "base64").toString("utf8") : (event.body || "");
  const signature = getHeader(event.headers, "x-pfy-signature");

  if (!verifySignature(rawBody, signature)) {
    return json(401, { error: "Invalid Printify signature" });
  }

  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return json(400, { error: "Invalid JSON" });
  }

  if (payload.type !== "order:created") {
    return json(200, { ok: true, skipped: payload.type || "unknown" });
  }

  const orderId = payload.resource?.id;
  const shopId = payload.resource?.data?.shop_id;
  if (!orderId || !shopId) return json(400, { error: "Missing order id or shop id" });

  try {
    const order = await getOrder(shopId, orderId);
    await sendEmail(order);
    return json(200, { ok: true, emailed: true, orderId });
  } catch (error) {
    console.error(error);
    return json(500, { error: error.message });
  }
};
