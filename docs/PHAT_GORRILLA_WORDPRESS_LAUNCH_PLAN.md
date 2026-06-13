# Phat Gorrilla WordPress Launch Plan

Last updated: 2026-06-07

## Current Status

Phat Gorrilla is now moving to WordPress/WooCommerce on Namecheap EasyWP Turbo as the real shop.

Confirmed current direction:

- Main domain: `https://phatgorrilla.com`
- EasyWP custom domain is now `phatgorrilla.com`
- Custom SSL is active on EasyWP
- WooCommerce Site Visibility is Live
- WooCommerce currency is GBP / Pound sterling
- Printify is connected to WooCommerce
- Stripe/WooCommerce Stripe Gateway is connected to Phat Gorrilla
- Stripe was left in Test Mode during setup
- Public WooCommerce product count: 26
- Main tested WooCommerce product:
  - Name: Phat Gorrilla Heavy Cotton Tee
  - Product ID: 13
  - Status: Published
  - Stock: In stock
  - URL structure: `/shop/unisex-heavy-cotton-tee/`
  - Tested variant: Dark Chocolate / L at `£24.99`
- Cart now persists products through a Code Snippets front-end Store API helper.
- UK shipping zone exists with `UK Standard Delivery (included)` at `£0.00`.
- Checkout reaches Stripe test-mode payment fields and the Place Order button.

Do not delete Netlify yet. Netlify DNS and the old project are still part of the safe rollback path.

## Old Netlify Checkout References Found

These references must be replaced, redirected, or retired only after WordPress/WooCommerce checkout is fully confirmed.

### Netlify Functions

- `netlify/functions/create-checkout-session.js`
- `netlify/functions/stripe-webhook.js`
- `netlify/functions/printify-products.js`
- `netlify/functions/printify-order-email.js`

Old webhook:

```text
https://phatgorrilla.com/.netlify/functions/stripe-webhook
```

Old checkout pattern:

```text
/.netlify/functions/create-checkout-session?key=...
```

### Frontend Files Still Calling Netlify Functions

- `app.html`
  - Fetches `/.netlify/functions/printify-products`
- `elite.html`
  - Fetches `/.netlify/functions/printify-products`
  - Fetches `/.netlify/functions/printify-products`
- `product.html`
  - Fetches `/.netlify/functions/create-checkout-session`
  - Fetches `/.netlify/functions/printify-products`
- `product-component.js`
  - Fetches `/.netlify/functions/create-checkout-session`
- `pod-engine.js`
  - Contains an old checkout URL to `/.netlify/functions/create-checkout-session`

### Product Data Files With Old Checkout Links

- `shop-data.js`
- `phat-gorrilla-products.json`
- `elite-products.json`
- `data/printify-products-export.csv`
- `stripe-buy-urls.csv`

These files should not be used as the final live WooCommerce product source. WooCommerce/Printify should become the real product and checkout source.

## Launch Checklist

### Homepage

- Confirm `https://phatgorrilla.com` loads over HTTPS.
- Show clear brand message.
- Remove or replace old static Netlify buy buttons once WooCommerce checkout is confirmed.

### Shop Page

- Confirm `https://phatgorrilla.com/shop/` loads.
- Show WooCommerce products.
- Confirm products are in GBP.
- Confirm product images are clear.
- Confirm filters/categories are useful.

### Product Page

- Confirm `/shop/unisex-heavy-cotton-tee/` loads.
- Confirm product title, images, price, size, colour options, shipping, and description.
- Confirm variations work before checkout.

### Basket / Cart

- Add product to basket: confirmed working after Store API basket fix.
- Confirm price remains GBP: confirmed.
- Confirm quantity/product details show in cart: confirmed for Heavy Cotton Tee, Dark Chocolate / L.
- Confirm shipping is clear before payment: confirmed for UK checkout as `UK Standard Delivery (included)`.

### Checkout

- Confirm UK billing/shipping fields: confirmed.
- Confirm Stripe appears as the payment route: confirmed, currently Test Mode.
- Confirm no old Netlify checkout route is used: confirmed in the live WooCommerce flow.
- Confirm order confirmation page works.

### Stripe

- During setup, keep Stripe in Test Mode if running test card orders.
- Before real customers, switch Stripe/WooCommerce Stripe Gateway to Live Mode.
- Do not remove the old Netlify Stripe webhook until one WooCommerce checkout has worked end to end.

### Printify

- Confirm Printify product sync works.
- Confirm product variants match WooCommerce variations.
- Confirm Printify receives the order after checkout.
- Confirm fulfilment/shipping settings are correct.
- Current risk: products manually created in WooCommerce are visible and buyable, but Printify auto-fulfilment is not confirmed until a test order reaches Printify.

### Policies And Trust

- Shipping & Returns page present.
- Privacy Policy page present.
- Terms page present.
- Contact/support route present.
- Size Guide present.
- Public support email visible: `support@phatgorrilla.com`

### Social Links

Preserve:

- `/instagram`
- `/tiktok`
- `/facebook`

Socials:

- Instagram: `@phatgorrilla`
- TikTok: `@phatgorrilla`
- Facebook profile/page

### SEO Basics

- Confirm sitemap exists in WordPress.
- Confirm robots.txt works.
- Preserve Google Search Console verification.
- Preserve Google Ads tag: `AW-18200925736`
- Preserve Google Merchant/free listings plan.
- Preserve TikTok verification if still needed.

## Navigation Plan

Main navigation:

- Home
- Shop
- Super Elite
- Size Guide
- Shipping & Returns
- Contact

Social / footer navigation:

- Instagram
- TikTok
- Facebook
- Privacy Policy
- Terms

Recommended WordPress routes:

- `/`
- `/shop/`
- `/super-elite/` or `/elite/`
- `/size-guide/`
- `/shipping-returns/`
- `/contact/`
- `/instagram`
- `/tiktok`
- `/facebook`

## Launch-Ready Copy

### Homepage Hero

Headline:

```text
Phat Gorrilla
```

Supporting copy:

```text
Bold streetwear built for people who like their style loud, clean, and impossible to miss. Graphic tees, international drops, and premium black-and-gold pieces from the official Phat Gorrilla shop.
```

Buttons:

```text
Shop the Drop
View Super Elite
```

### Shop Intro

```text
The official Phat Gorrilla store brings together statement graphics, everyday heavyweight tees, and limited streetwear drops. Choose your colour, pick your size, and order securely through our WooCommerce checkout.
```

### About / Brand Section

```text
Phat Gorrilla is a UK streetwear brand with a heavyweight attitude: bold graphics, sharp colourways, and pieces made to stand out without trying too hard. The look is confident, direct, and built around designs people remember.
```

### Super Elite Section

```text
Super Elite is the premium Phat Gorrilla line: darker, sharper, and more refined. Black-and-gold styling, stronger product presentation, and elevated pieces for customers who want the most polished version of the brand.
```


```text
```

### Shipping & Returns

```text
Phat Gorrilla products are made and fulfilled through our print-on-demand production partners. Shipping times and costs are shown at checkout before payment. Please check your size carefully before ordering, as made-to-order items may not be eligible for return unless they arrive damaged, faulty, or incorrect.
```

### Contact / Support

```text
Need help with an order, product, size, or delivery question? Contact Phat Gorrilla support and include your order number if you have one.

Email: support@phatgorrilla.com
```

### Product Description Template

```text
[Product Name] brings the Phat Gorrilla look to a clean everyday streetwear fit. The design is bold without feeling messy, with strong graphic detail and colour options made to work with jeans, cargos, jackets, and layered outfits.

Choose your size and colour before checkout. Each item is produced through our fulfilment partner and shipped directly to you.

Details:
- Official Phat Gorrilla design
- Available in selected colours and sizes
- Printed to order
- Secure checkout in GBP
- Shipping shown before payment
```

## Safe Netlify Removal Order

Do not delete Netlify immediately.

Correct order:

1. Confirm `https://phatgorrilla.com` works on EasyWP.
2. Confirm `https://www.phatgorrilla.com` works on EasyWP.
3. Confirm `/shop/` works.
4. Confirm the product page works.
5. Confirm cart works.
6. Confirm checkout works.
7. Confirm Stripe is in the correct mode for the next order.
8. Confirm Printify fulfilment receives WooCommerce orders.
9. Back up DNS records.
10. Preserve Google Search Console TXT verification.
11. Preserve SSL validation CNAME records while SSL depends on them.
12. Replace or redirect old Netlify checkout/product links.
13. Only then remove old Netlify project/site references.

## DNS Records To Keep

Do not change DNS from this repo.

Current important records from setup notes:

- `phatgorrilla.com` ALIAS `ingress-comporellon.easywp.com`
- `www.phatgorrilla.com` CNAME `ingress-comporellon.easywp.com`
- Google Search Console TXT:
  - `google-site-verification=1AnbvZrJhRw-yZchVBiPIe1aYtbwfWeIPPMBtNbNWrE`
- SSL validation CNAME for the PositiveSSL/Comodo certificate

Do not delete SSL validation records unless the certificate no longer needs them.
