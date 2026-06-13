# Phat Gorrilla Move Status

Last updated: 2026-06-07

## Current Position

Phat Gorrilla is moving from the current Netlify-hosted brand/shop setup to a WordPress/EasyWP/WooCommerce shop.

The current Netlify site must stay live and untouched until the EasyWP/WooCommerce replacement is confirmed working on the real domain.

## Current Live Netlify Setup

- Main domain: `phatgorrilla.com`
- Current host: Netlify
- Netlify site name found in local state: `roaring-pothos-c5796c`
- Netlify site ID found in local state: `751e066a-5718-471e-b136-e9ac6a523a6b`
- Netlify publish directory: repository root
- Netlify functions directory: `netlify/functions`
- Existing Stripe webhook URL:
  - `https://phatgorrilla.com/.netlify/functions/stripe-webhook`
- Existing old product checkout pattern:
  - `/.netlify/functions/create-checkout-session?key=...`

## Current EasyWP / WooCommerce Setup

Known from the migration notes:

- EasyWP/WordPress admin/plugins URL seen:
  - `https://phat-gorrilla-shop-13eabbe.ingress-comporellon.ewp.live/wp-admin/plugins.php`
- WooCommerce is active.
- WooCommerce Stripe Gateway is active.
- Printify Shipping Method is active.
- Stripe is connected/enabled.
- Stripe statement descriptor: `PHAT GORRILLA`
- Required correction: WooCommerce currency must be set to GBP / Pound sterling.

No EasyWP admin actions were performed from this repo pass.

## Printify

- Existing Printify shop ID: `27674090`
- Printify should fulfil WooCommerce orders after the public HTTPS WooCommerce shop is connected.
- Do not publish/sync Printify products to localhost.
- Do not commit Printify API tokens or private credentials.

## Emails

- Main/admin email: `kristy4nug@gmail.com`
- Public support email: `support@phatgorrilla.com`
- Older email seen in migration notes: `chrisnugent1981@gmail.com`

## Social Links To Preserve

The current Netlify clean social paths must be recreated or preserved after the WordPress move:

- `/instagram` -> Instagram `@phatgorrilla`
- `/tiktok` -> TikTok `@phatgorrilla`
- `/facebook` -> Facebook profile/page

These are currently handled by Netlify redirects, not DNS.

## Legal / Support Pages To Preserve

The current repo contains these customer support and legal pages:

- `contact.html`
- `terms-of-service.html`
- `privacy-policy.html`
- `shipping-returns.html`
- `size-guide.html`

These pages should be copied/recreated in WordPress before Netlify is removed.

## SEO / Verification Assets To Preserve

The repo contains:

- `sitemap.xml`
- `robots.txt`
- `google-free-listings-feed.xml`
- `phatgorrilla-20260531-indexnow.txt`
- `tiktok9EDqKzVymfITSScfk67zYoTUU1uKFbDJ.txt`
- Google Ads tag references: `AW-18200925736`
- Google Search Console verification meta tag in `index.html`

These assets or equivalent WordPress/SEO-plugin settings must exist on the replacement site before the Netlify site is removed.

## Safe Rule

Do not delete Netlify, Netlify functions, Stripe webhooks, DNS records, or old checkout routes until:

1. EasyWP is publicly live on the correct domain.
2. WooCommerce currency is GBP.
3. At least one real product can be viewed, added to basket, checked out with Stripe, and fulfilled through Printify.
4. Legal/support/social/SEO routes are recreated or redirected.
5. The old Netlify checkout function is no longer receiving real traffic.
