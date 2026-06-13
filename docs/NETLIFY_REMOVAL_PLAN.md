# Netlify Removal Plan

Last updated: 2026-06-07

## Purpose

Netlify should only be removed after the EasyWP/WordPress/WooCommerce shop is live and verified. The live direction is now WordPress/WooCommerce on EasyWP, but the old Netlify project and DNS zone are still part of the safety and rollback path.

Do not delete Netlify yet.

Do not remove Netlify DNS yet.

Do not change DNS, Stripe secrets, SSL records, or payment mode from this repo.

## Current Known Live Direction

- Main domain: `https://phatgorrilla.com`
- New host/shop: Namecheap EasyWP Turbo, WordPress, WooCommerce
- WooCommerce currency: GBP / Pound sterling
- Printify: connected to WooCommerce
- Stripe route: WooCommerce Stripe Gateway
- Stripe setup note: left in Test Mode during setup
- First WooCommerce product seen:
  - `Unisex Heavy Cotton Tee`
  - Product ID `13`
  - Published and in stock
  - URL: `/shop/unisex-heavy-cotton-tee/`
- Netlify project to keep for now: `roaring-pothos-c5796c`

## What Netlify Currently Does

The old Netlify setup currently or historically provides:

- Static site files for the previous `phatgorrilla.com` site
- Netlify redirects from `_redirects`
- Netlify Functions from `netlify/functions`
- Old Stripe checkout session creation
- Old Stripe webhook handling
- Printify product/order helper endpoints
- Clean social redirects
- SEO and verification files at the domain root
- DNS records that are still important during the EasyWP move

## Netlify-Specific Dependencies Found

### Functions

- `netlify/functions/create-checkout-session.js`
  - Creates Stripe Checkout sessions.
  - Reads product data from `data/stripe-printify-map.json`.
  - Uses `STRIPE_SECRET_KEY`, `PRINTIFY_API_TOKEN`, `PRINTIFY_SHOP_ID`, `SHOP_URL`, and `SITE_URL`.
  - Current old checkout URL pattern: `/.netlify/functions/create-checkout-session?key=...`

- `netlify/functions/stripe-webhook.js`
  - Handles Stripe checkout completion.
  - Creates Printify orders.
  - Uses `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `PRINTIFY_API_TOKEN`, and `PRINTIFY_SHOP_ID`.
  - Current old webhook URL:
    - `https://phatgorrilla.com/.netlify/functions/stripe-webhook`

- `netlify/functions/printify-products.js`
  - Reads Printify products.
  - Generates old checkout links to `/.netlify/functions/create-checkout-session?key=...`.
  - Uses `PRINTIFY_API_TOKEN` and `PRINTIFY_SHOP_ID`.

- `netlify/functions/printify-order-email.js`
  - Handles Printify order email logic.
  - Uses `PRINTIFY_WEBHOOK_SECRET`, `PRINTIFY_API_TOKEN`, `SHOP_URL`, and `BRAND_SITE_URL`.

### Redirects

Current redirects are defined in `_redirects`.

Important redirects to preserve or recreate:

- `/shop`
- `/elite`
- `/app`
- `/free-app`
- `/about`
- `/thank-you`
- `/shipping-returns`
- `/contact`
- `/privacy-policy`
- `/terms`
- `/terms-of-service`
- `/size-guide`
- `/comments`
- `/socials`
- `/instagram`
- `/tiktok`
- `/facebook`

### Old Checkout Links

Old checkout links appear in:

- `shop-data.js`
- `phat-gorrilla-products.json`
- `elite-products.json`
- `product-component.js`
- `product.html`
- `pod-engine.js`
- `app.html`
- `elite.html`
- `data/printify-products-export.csv`
- `stripe-buy-urls.csv`
- `netlify/functions/printify-products.js`

Pattern:

```text
/.netlify/functions/create-checkout-session?key=...
```

These links will break when Netlify Functions are removed unless WooCommerce product links or redirects replace them.

Old product/customer links should ultimately move to:

- `/shop/`
- `/cart/`
- `/checkout/`
- `/shop/unisex-heavy-cotton-tee/`

## What To Back Up Before Removing Netlify

- Full GitHub repository
- Netlify deploy settings
- Netlify environment variable names, without exposing values
- Netlify Functions list and route names
- `_redirects`
- `_headers`
- `sitemap.xml`
- `robots.txt`
- Google free listings feed
- IndexNow key file
- TikTok verification file
- Google Search Console verification method
- Google Ads tag ID
- Product data files and checkout key mapping
- Legal/support page text
- Social redirect targets

## What Must Be Confirmed Or Recreated In WordPress / EasyWP

- Home page or brand landing page
- WooCommerce shop page
- Elite product/category page
- Product pages with sizes, colours, images, descriptions, shipping, and pricing
- Contact page
- Terms page
- Privacy page
- Shipping & Returns page
- Size Guide page
- `/instagram`, `/tiktok`, `/facebook` redirects
- XML sitemap
- Robots.txt rules
- Google Merchant/free listings feed
- Google Ads tag
- Google Search Console verification
- TikTok verification
- Stripe webhook for WooCommerce
- Printify WooCommerce connection

## DNS Records To Preserve

Current important records from setup notes:

- `phatgorrilla.com` ALIAS `ingress-comporellon.easywp.com`
- `www.phatgorrilla.com` CNAME `ingress-comporellon.easywp.com`
- Google Search Console TXT:
  - `google-site-verification=1AnbvZrJhRw-yZchVBiPIe1aYtbwfWeIPPMBtNbNWrE`
- SSL validation CNAME for the PositiveSSL/Comodo certificate

Do not delete SSL validation records unless the certificate no longer needs them.

Do not remove email, MX, SPF, DKIM, or DMARC records while moving the website.

## What Must Not Be Deleted Yet

Do not delete:

- The Netlify project
- The GitHub repo
- Netlify Functions
- Netlify DNS records
- The old Stripe webhook
- Existing Stripe/Netlify checkout code
- SEO or verification files
- Legal/support pages

These can only be removed after EasyWP is live and tested.

## Safe Removal Order

1. Confirm `https://phatgorrilla.com` loads WordPress.
2. Confirm `https://www.phatgorrilla.com` loads WordPress or redirects cleanly.
3. Confirm `/shop/` works.
4. Confirm `/shop/unisex-heavy-cotton-tee/` works.
5. Confirm cart works.
6. Confirm checkout works.
7. Confirm Stripe mode is correct for the next order.
8. Confirm WooCommerce Stripe webhook works.
9. Confirm Printify receives WooCommerce orders correctly.
10. Confirm legal/support pages exist in WordPress.
11. Confirm `/instagram`, `/tiktok`, and `/facebook` work.
12. Confirm SEO and verification assets exist in WordPress or DNS.
13. Back up DNS records.
14. Preserve Google verification record.
15. Preserve SSL validation CNAME records while SSL depends on them.
16. Replace or redirect old Netlify checkout/product links.
17. Confirm the old Netlify Stripe webhook is no longer needed.
18. Only then remove old Netlify project/site references.
19. Keep DNS zone safe until DNS is moved or confirmed elsewhere.

## Current Blockers Before Netlify Removal

Public route check on 2026-06-07 found:

- `https://phatgorrilla.com/instagram` returns `404 Not Found`
- `https://phatgorrilla.com/tiktok` returns `404 Not Found`
- `https://phatgorrilla.com/facebook` returns `404 Not Found`

These clean social redirects existed in the old Netlify `_redirects` file. Recreate them in WordPress before removing Netlify references completely.

Recommended redirect targets:

- `/instagram` -> `https://www.instagram.com/phatgorrilla/`
- `/tiktok` -> `https://www.tiktok.com/@phatgorrilla`
- `/facebook` -> `https://www.facebook.com/profile.php?id=61590460628534`

## When Netlify Functions Can Be Removed

Netlify Functions can be removed only after:

- WooCommerce live checkout works on the public domain.
- Stripe is receiving WooCommerce orders correctly.
- Printify receives WooCommerce orders correctly.
- Product links no longer point to `/.netlify/functions/create-checkout-session`.
- The old Stripe webhook has no required traffic.
- A rollback plan exists.

Until then, keep them.
