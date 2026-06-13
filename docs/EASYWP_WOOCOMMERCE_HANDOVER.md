# EasyWP WooCommerce Handover

Last updated: 2026-06-07

## Target

Move Phat Gorrilla from the old Netlify shop flow to a real WooCommerce shop on Namecheap EasyWP.

Primary domain target:

- `phatgorrilla.com`

Known EasyWP temporary/admin URL:

- `https://phat-gorrilla-shop-13eabbe.ingress-comporellon.ewp.live/wp-admin/plugins.php`

Do not remove Netlify until this EasyWP/WooCommerce site works on the public domain.

## Required Plugins

Confirmed active from migration notes:

- WooCommerce
- WooCommerce Stripe Gateway
- Printify Shipping Method
- Code Snippets

Required before launch:

- WooCommerce
- WooCommerce Stripe Gateway
- Printify for WooCommerce / Printify shipping integration
- Code Snippets snippet `Phat Gorrilla WooCommerce Store API basket fix`
- SEO plugin or equivalent sitemap/robots/feed support
- Redirect plugin or server-level redirect support
- Cookie/privacy support if required by the final WordPress setup

## Required WooCommerce Settings

Set or verify:

- Store country: United Kingdom
- Currency: GBP / Pound sterling
- Currency symbol: `£`
- Permalinks: Post name
- Admin email: `kristy4nug@gmail.com`
- Public support email: `support@phatgorrilla.com`
- Stripe statement descriptor: `PHAT GORRILLA`

Important known issue:

- WooCommerce currency is now GBP / Pound sterling.
- Stripe is still visible in Test Mode at checkout; do not switch to live until the owner is ready.
- Add-to-basket required a small Store API cart helper because the standard product form showed a success message but did not persist the cart session on EasyWP.
- UK shipping zone now exists with `UK Standard Delivery (included)` at `£0.00`; product prices include the `£4.99` postage allowance from the pricing audit.

## Stripe

Stripe is already connected/enabled according to the migration notes.

Before switching traffic:

- Confirm WooCommerce Stripe Gateway is in live mode when ready.
- Confirm checkout accepts GBP.
- Confirm Stripe receives WooCommerce test/live orders correctly.
- Confirm WooCommerce's Stripe webhook endpoint is configured in Stripe.
- Do not delete the old Netlify webhook until WooCommerce checkout is confirmed working.

Old Netlify webhook to keep until replacement is confirmed:

```text
https://phatgorrilla.com/.netlify/functions/stripe-webhook
```

## Printify

Use existing Printify shop ID:

```text
27674090
```

WooCommerce-connected Printify shop seen during migration:

```text
27674827
```

Rules:

- Connect Printify to the public HTTPS WordPress/WooCommerce shop.
- Do not connect final Printify fulfilment to localhost.
- Publish one product first.
- Verify title, description, images, colours, sizes, price, shipping, basket, checkout, WooCommerce order, and Printify order flow.
- Do not assume manually created WooCommerce products will auto-fulfil until a WooCommerce test order appears in Printify.

## Product Structure

Recommended WooCommerce structure:

- Main Store
  - Standard Phat Gorrilla T-shirts
  - Gildan 5000 standard shirts at `£19.99` plus `£4.99` postage
- Elite
  - More expensive premium shirts
  - Black and gold visual direction
  - More polished product writing and higher-end presentation
  - Country/international themed products
  - Clear colour and size variations

Each product should include:

- Product title
- Premium product description
- Short description
- Product images
- Colour variation images where available
- Size options
- Colour options
- Price
- Shipping cost/rules
- Category
- SKU or Printify product reference

## Pages To Recreate In WordPress

Recreate or redirect:

- `/`
- `/shop`
- `/elite`
- `/contact`
- `/terms`
- `/terms-of-service`
- `/privacy-policy`
- `/shipping-returns`
- `/size-guide`
- `/socials`
- `/instagram`
- `/tiktok`
- `/facebook`
- `/thank-you`

## SEO / Verification Handover

Before removing Netlify, WordPress must provide or preserve:

- Sitemap
- Robots.txt
- Google Merchant/free listings feed
- IndexNow verification/key if still used
- TikTok verification
- Google Ads tag: `AW-18200925736`
- Google Search Console verification

The current Google Search Console verification also appears in the Netlify `index.html` meta tags. If DNS verification already exists, preserve the DNS record as well.

## Launch Test Order

1. Confirm WooCommerce currency remains GBP.
2. Confirm WooCommerce pages exist.
3. Confirm Stripe/WooCommerce Stripe Gateway is connected.
4. Confirm Printify is connected to the public EasyWP/WooCommerce site.
5. Confirm product images, colours, sizes, writing, price, shipping, and stock/availability.
6. Add product to basket.
7. Confirm cart keeps product, colour, size, quantity, and GBP price.
8. Confirm checkout loads.
9. Confirm UK shipping option appears.
10. Complete a Stripe test order while Stripe is still in Test Mode.
11. Confirm WooCommerce order appears.
12. Confirm Stripe test payment appears.
13. Confirm Printify fulfilment receives the order.
14. Confirm confirmation/customer emails are acceptable.
15. Confirm legal/support/social/SEO pages exist.
16. Only then switch Stripe to live mode and send real customers to checkout.

## Manual EasyWP Tasks Remaining

- Confirm EasyWP's correct DNS records for the final domain.
- Confirm `https://www.phatgorrilla.com` works from a normal browser.
- Confirm Printify receives a WooCommerce test order for the products now visible in WooCommerce.
- Configure redirects for old Netlify paths.
- Configure SEO/feed/verification.
- Run a full Stripe test checkout.
- Switch Stripe from Test Mode to Live Mode only when ready for real payments.
- Confirm old Netlify checkout traffic can stop.
