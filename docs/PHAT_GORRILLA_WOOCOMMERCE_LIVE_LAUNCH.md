# Phat Gorrilla WooCommerce Live Launch

This is the real WooCommerce shop handover plan. The 72-hour test idea is cancelled.

## Domain Target

- Brand site: `https://phatgorrilla.com`
- Shop target: `https://shop.phatgorrilla.com`
- Main rule: keep the Netlify brand site safe while WooCommerce becomes the proper shop.

## DNS Options

Choose the record required by the WordPress host:

- `CNAME` option: point `shop` to the host-provided hostname, for example `shops.examplehost.com`.
- `A` record option: point `shop` to the host-provided IPv4 address.
- Optional `AAAA` record: only add this if the host provides IPv6.

Do not point `phatgorrilla.com` away from Netlify unless there is a separate approved brand-site move.

## Required WordPress Plugins

- WooCommerce
- WooCommerce Stripe Payment Gateway
- Printify for WooCommerce

## WooCommerce Settings

- Store country: United Kingdom
- Currency: GBP
- Permalinks: Post name
- WordPress admin email: `kristy4nug@gmail.com`
- Public support email: `support@phatgorrilla.com`

## Printify

- Use existing Printify shop ID: `27674090`
- Connect Printify only to the public HTTPS WooCommerce shop.
- Do not connect Printify to `localhost`.
- Confirm product sync from Printify into the public WooCommerce catalog before promoting the shop.

## Stripe

- Reuse the existing Phat Gorrilla Stripe account.
- Connect that existing Stripe account to WooCommerce with the WooCommerce Stripe Payment Gateway.
- In Stripe, add/update the WooCommerce webhook endpoint for the public shop once `https://shop.phatgorrilla.com` is live.
- Use live Stripe mode only when ready for real orders.
- Do not remove the existing Netlify Stripe functions or webhook until WooCommerce live checkout works end to end.
- Keep Stripe keys and webhook secrets out of the repository.
- Keep old Netlify Stripe environment variables in Netlify until the WooCommerce checkout is fully confirmed.
- For Netlify fallback checkout during the transition, set `SHOP_URL=https://shop.phatgorrilla.com` so success/cancel URLs use the new shop target.

## Product Launch Order

Start with one strong product first.

Check:

- Product title
- Images and mockups
- Price in GBP
- Sizes
- Colours
- Shipping
- Profit margin
- Basket behavior
- Checkout behavior
- Stripe payment
- WooCommerce order
- Printify order handoff
- Customer email
- Admin/order notification

## Final Switch

Only update all customer-facing shop, Super Elite, World Cup and product CTAs after live WooCommerce checkout is confirmed.

When confirmed:

- Set `SHOP_LIVE` to `true` in `shop-config.js`.
- Keep `SHOP_URL` as `https://shop.phatgorrilla.com`.
- Update remaining product-grid checkout buttons to WooCommerce product/category URLs.
- Keep `/instagram`, `/tiktok` and `/facebook` redirects unchanged.
- Keep SEO and verification files unchanged.
