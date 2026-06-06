# Netlify WooCommerce Readiness

## Current Position

The current Netlify site remains live as the Phat Gorrilla brand site. WooCommerce will live at:

`https://shop.phatgorrilla.com`

The Netlify site should continue to preserve:

- Short social redirects: `/instagram`, `/tiktok`, `/facebook`
- `sitemap.xml`
- `robots.txt`
- `google-free-listings-feed.xml`
- `phatgorrilla-20260531-indexnow.txt`
- `tiktok9EDqKzVymfITSScfk67zYoTUU1uKFbDJ.txt`
- Google Search Console verification in `index.html`
- Terms, privacy, shipping and returns, size guide and contact pages

## Netlify Environment Variable

If a future build step is added, set this in Netlify:

- Key: `SHOP_URL`
- Value: `https://shop.phatgorrilla.com`

Netlify location:

`Site configuration` -> `Environment variables` -> `Add a variable`

This project is currently a static root publish, so the browser-facing value is held in `shop-config.js`.

## Existing Stripe And Functions

Keep these until WooCommerce live checkout is proven. The old Stripe account is still the Stripe account to use; it should be connected to WooCommerce rather than replaced.

- `netlify/functions/create-checkout-session.js`
- `netlify/functions/stripe-webhook.js`
- `netlify/functions/printify-order-email.js`
- `netlify/functions/printify-products.js`

Do not delete Netlify functions, Stripe webhook code, Stripe environment variables or Printify environment variables without explicit approval.

Netlify fallback checkout environment:

- Keep existing `STRIPE_SECRET_KEY`.
- Keep existing `STRIPE_WEBHOOK_SECRET`.
- Keep existing `PRINTIFY_API_TOKEN`.
- Keep existing `PRINTIFY_SHOP_ID`.
- Add or update `SHOP_URL=https://shop.phatgorrilla.com`.
- Keep or add `BRAND_SITE_URL=https://phatgorrilla.com` for old email assets/app links.
- Leave `SITE_URL` only if needed for old brand-site behavior; `SHOP_URL` now takes priority for fallback checkout customer URLs.

WooCommerce Stripe setup:

- Use the same Stripe account already used by Phat Gorrilla.
- Enter the Stripe keys inside WooCommerce Stripe settings on the public shop.
- Add the WooCommerce webhook endpoint in Stripe after `shop.phatgorrilla.com` is live over HTTPS.
- Run a small live purchase only after products, shipping and tax settings are confirmed.

## Handover Rule

Once WooCommerce is live and tested:

- Update Shop CTAs to `SHOP_URL`.
- Update Super Elite CTAs to the WooCommerce category or collection URL.
- Update World Cup CTAs to the WooCommerce category or collection URL.
- Update product buy buttons to real WooCommerce product URLs.
- Keep the Netlify brand site at `phatgorrilla.com`.
