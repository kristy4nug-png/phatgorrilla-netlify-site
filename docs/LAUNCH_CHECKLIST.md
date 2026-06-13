# Phat Gorrilla Launch Checklist

Last updated: 2026-06-07

This checklist is for the live WordPress/WooCommerce shop on EasyWP.

Do not delete Netlify, change DNS, remove SSL records, or switch Stripe mode until the relevant checks below are complete.

## Current Confirmed Status

- Domain direction: `https://phatgorrilla.com`
- Hosting direction: Namecheap EasyWP Turbo
- Shop platform: WordPress + WooCommerce
- Fulfilment: Printify connected to WooCommerce
- Currency: GBP / Pound sterling
- SSL: EasyWP custom SSL active from setup notes
- Stripe route: WooCommerce Stripe Gateway
- WooPayments: not the main payment route
- Public product count: 26 WooCommerce products
- Main tested product: `Phat Gorrilla Heavy Cotton Tee`
- Main tested product URL: `/shop/unisex-heavy-cotton-tee/`
- Stripe setup note: left in Test Mode during setup
- UK shipping: `UK Standard Delivery (included)` at `£0.00`, because the pricing audit built a `£4.99` postage allowance into product prices
- Cart flow fix: Code Snippets plugin is active with snippet `Phat Gorrilla WooCommerce Store API basket fix`

## Live Build Pass

Completed through API on 2026-06-07:

- Created WooCommerce category `Main Store`.
- Created WooCommerce category `Super Elite`.
- Updated product ID `13` from `Unisex Heavy Cotton Tee` to `Phat Gorrilla Heavy Cotton Tee`.
- Updated product ID `13` copy/description/category.
- Repriced WooCommerce variations using the Printify-cost pricing audit.
- Added 26 WooCommerce products/product pages across Main Store and Super Elite.
- Installed and activated free plugin `Code Snippets` to add a small front-end WooCommerce Store API basket fix.
- Added a UK WooCommerce shipping zone with `UK Standard Delivery (included)` at `£0.00`.
- Copied 25 products from the old Printify storefront shop into the WooCommerce-connected Printify shop.

Remaining blocker:

- Printify automatic fulfilment is not confirmed for the manually created WooCommerce products.
- The 25 copied Printify products are present in the WooCommerce-connected Printify shop, but Printify did not reliably push them through into WooCommerce.
- 25 old Printify products failed to copy because Printify reported their old artwork image references no longer exist.

Current public WooCommerce product check:

- Product count: `26`
- Live product: `Phat Gorrilla Heavy Cotton Tee`
- Price: `£24.99` for tested variant
- URL: `https://phatgorrilla.com/shop/unisex-heavy-cotton-tee/`

Current public WordPress pages:

- `/`
- `/shop/`
- `/super-elite/`
- `/size-guide/`
- `/shipping-returns/`
- `/contact/`
- `/terms/`
- `/privacy-policy/`
- `/instagram/`
- `/tiktok/`
- `/facebook/`
- `/cart/`
- `/checkout/`
- `/my-account/`

Normal WordPress page editing was completed through a WordPress application-password API route. Do not commit or print application passwords.

## Public Route Check

Checked non-destructively on 2026-06-07:

- `https://phatgorrilla.com` -> `200 OK`
- `https://www.phatgorrilla.com` -> `200 OK`
- `https://phatgorrilla.com/shop/` -> `200 OK`
- `https://phatgorrilla.com/shop/unisex-heavy-cotton-tee/` -> `200 OK`
- `https://phatgorrilla.com/cart/` -> `200 OK`
- `https://phatgorrilla.com/checkout/` -> redirects to `/cart/` when cart is empty; loads checkout when cart has an item
- `https://phatgorrilla.com/instagram` -> `200 OK`
- `https://phatgorrilla.com/tiktok` -> `200 OK`
- `https://phatgorrilla.com/facebook` -> `200 OK`

Priority fix before Netlify removal:

- Confirm true external redirects for `/instagram`, `/tiktok`, and `/facebook` if desired. Current WordPress pages exist and are not 404.

## Site Checks

- [x] `https://phatgorrilla.com` loads WordPress over HTTPS.
- [ ] `https://www.phatgorrilla.com` loads or redirects cleanly.
- [ ] Browser shows a valid SSL lock.
- [x] Homepage is set to the intended front page.
- [x] Homepage has a strong `Shop Now` button linking to `/shop/`.
- [x] Navigation is clear on desktop.
- [ ] Navigation is clear on mobile.
- [ ] Footer has support and policy links.

## WooCommerce Checks

- [x] WooCommerce Shop page is assigned.
- [x] `/shop/` loads products.
- [x] Product page loads at `/shop/unisex-heavy-cotton-tee/`.
- [x] Product price is in GBP.
- [x] Product images are clear.
- [x] Product sizes are visible.
- [x] Product colours or variations are visible where available.
- [x] Add to basket works after the Store API basket fix.
- [x] Cart page works.
- [x] Checkout page works.
- [x] UK checkout fields show correctly.
- [x] Shipping is shown before payment for UK addresses.
- [ ] Order confirmation page works.

## Stripe Checks

- [ ] Stripe/WooCommerce Stripe Gateway is enabled.
- [ ] Stripe account is connected to Phat Gorrilla.
- [ ] Stripe mode is intentionally chosen:
  - Test Mode is currently visible at checkout.
  - Live Mode only when ready for real customer payments.
- [ ] Stripe statement descriptor is recognisable.
- [ ] WooCommerce Stripe webhook is working.
- [ ] Old Netlify Stripe webhook is kept until WooCommerce orders work.

## Printify Checks

- [x] Printify is connected to WooCommerce.
- [ ] Product sync/fulfilment route is confirmed for the manually created WooCommerce products.
- [ ] Product variations match WooCommerce product choices.
- [ ] Shipping profile is correct for UK customers.
- [ ] Printify receives a WooCommerce test/live order correctly.
- [ ] Fulfilment status updates back into WooCommerce if supported.

## Pages And Policies

- [x] Contact page exists.
- [x] Public support email is visible: `support@phatgorrilla.com`.
- [x] Shipping & Returns page exists.
- [x] Privacy Policy page exists.
- [x] Terms page exists.
- [x] Size Guide page exists.
- [ ] Product descriptions mention made-to-order fulfilment where needed.
- [ ] No page says the shop is still coming soon.

## Social And SEO

- [x] `/instagram` works.
- [x] `/tiktok` works.
- [x] `/facebook` works.
- [ ] Instagram links to `@phatgorrilla`.
- [ ] TikTok links to `@phatgorrilla`.
- [ ] Facebook link is correct.
- [ ] Sitemap exists.
- [ ] Robots.txt exists.
- [ ] Google Search Console verification is preserved.
- [ ] Google Ads tag `AW-18200925736` is preserved if still needed.
- [ ] Google Merchant/free listings feed plan is ready.

## Final Launch Readiness

- [ ] One complete checkout has been tested successfully.
- [ ] Stripe received the order correctly.
- [ ] WooCommerce order appeared correctly.
- [ ] Printify fulfilment route is confirmed.
- [ ] DNS records are backed up.
- [ ] SSL validation records are preserved.
- [ ] Netlify has not been deleted yet.

Netlify is not safe to remove until every relevant launch check above is complete.

## App And Plugin Options

Do not install extra plugins until the core shop is stable.

### A. Current Core

Keep:

- WooCommerce
- WooCommerce Stripe Gateway
- Printify for WooCommerce / Printify Shipping Method
- EasyWP SSL/security basics

Add only after checking compatibility:

- One SEO plugin
- One cache/performance plugin if EasyWP recommends or supports it

### B. Design / Builder

Recommended route:

- Continue with Brizy if the current homepage already depends on Brizy.
- Otherwise use native WordPress blocks for a simpler, faster build.
- Do not mix several page builders.
- Build mobile-first sections with clean navigation, strong product imagery, and a polished footer.

### C. SEO

Pick one:

- Rank Math SEO
- Yoast SEO

Tasks:

- Meta title and description templates.
- Product schema where supported.
- Sitemap check.
- Robots.txt check.
- Google Search Console verification preserved.
- Image alt text.
- Clean URLs.

### D. Performance

Use only if needed:

- Image compression.
- Lazy loading.
- EasyWP-compatible cache plugin.
- Remove unused plugins.
- Avoid heavy animations.
- Keep checkout uncached.

### E. Email / Marketing

Later options:

- Mailchimp for WooCommerce.
- Klaviyo.
- Brevo.
- Newsletter signup.
- Abandoned cart recovery.
- Welcome email.
- Launch drop email.
- Post-purchase email.

Do not connect email marketing before checkout/product flow is stable.

### F. Social / Media

Recommended:

- Keep simple social links first.
- Add Instagram feed only if lightweight.
- Add TikTok pixel later.
- Add Meta/Facebook pixel later.
- Add Google Ads tag later if needed.
- Avoid heavy social widgets before launch.

Required redirects:

- `/instagram`
- `/tiktok`
- `/facebook`

### G. Analytics

Recommended simple stack:

- Google Analytics 4.
- Google Search Console.
- WooCommerce analytics.
- Google Ads tag `AW-18200925736` only if still needed.

Do not add too many trackers before launch.

### H. Trust / Conversion

Add:

- Clear shipping message.
- Returns policy.
- Contact/support page.
- Secure checkout text.
- Size guide.
- Product care info.
- Delivery estimate.
- Refund policy.

Do not add fake reviews or fake scarcity.

### I. Product / Shop

Recommended:

- Main Store category.
- Super Elite category.
- Featured product collection.
- Product description template.
- Product image standards.
- Product naming standards.
- Price consistency.
- Category images.
- Variation swatches only if lightweight and compatible.

### J. Customer Account

Recommended:

- Guest checkout enabled.
- Optional account creation.
- Order emails tested.
- My Account page visible only if properly configured.

### K. Legal / Policy Pages

Needed:

- Terms.
- Privacy Policy.
- Shipping & Returns.
- Contact.
- Size Guide.
- Cookie notice if required by the final plugin stack.

### L. Security

Keep:

- WordPress and plugins updated.
- Unused plugins removed.
- Strong admin login.
- Backups enabled.
- API keys private.
- No secrets in repo.
- SSL active.
