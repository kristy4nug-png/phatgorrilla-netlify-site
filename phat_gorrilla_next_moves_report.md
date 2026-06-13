# Phat Gorrilla Next Moves Report

Audit date: 2026-06-06

Scope: Phase 1 audit plus the first safe Phase 2 cleanup/refresh pass. No checkout, price, Stripe, Printify fulfilment, Netlify function or public social posting logic was changed.

## 1. Current Repo State

- Local branch: `main`
- GitHub remote: `https://github.com/kristy4nug-png/phatgorrilla-netlify-site.git`
- Latest local commit checked: `ac93869 Complete official brand hub information`
- GitHub `main` matches the latest local commit.
- Netlify project: `roaring-pothos-c5796c`
- Netlify admin URL: `https://app.netlify.com/projects/roaring-pothos-c5796c`
- Live site: `https://phatgorrilla.com`

Current local leftovers:

- `thank-you.html` shows as modified locally, but the diff appears to be line-ending noise only.
- Several old Printify export JSON files and local review/backup pages were found during audit.
- A backup zip was created, then the confusing local leftovers were removed from the working folder so they do not get mistaken for live site pages.

## 2. Main Website Pages Found

Customer-facing tracked pages:

- `index.html`
- `shop.html`
- `elite.html`
- `app-demo.html`
- `app.html`
- `free-app.html`
- `socials.html`
- `about.html`
- `comments.html`
- `contact.html`
- `contact-thank-you.html`
- `thank-you.html`
- `terms-of-service.html`
- `privacy-policy.html`
- `shipping-returns.html`
- `size-guide.html`
- `scotland_fixed_product_review_v2.html` was present during audit and has now been removed because it was a public review utility page, not a customer page.

Ignored/local review or backup pages also exist in the folder:

- `elite.backup_20260531_135901.html`
- `elite.backup_before_cream_army_page_20260531_150400.html`
- `index_backup_fix_main_range_duplicate_20260530_113947.html`
- `index_backup_rugged_logo_20260530_112413.html`
- `scotland_final_review.html`
- `scotland_fix_review.html`
- `world_cup_product_visual_review.html`

These backup/review pages included local `file:///C:/...` image paths and were backed up before being removed from the working folder.

## 3. Checkout And Fulfilment Files

Important files are present:

- `netlify/functions/create-checkout-session.js`
- `netlify/functions/stripe-webhook.js`
- `netlify/functions/printify-order-email.js`
- `data/stripe-printify-map.json`
- `netlify.toml`

Checkout status:

- `shop-data.js`: 12 checkout links, 0 missing map keys
- `elite.html`: 23 checkout links, 0 missing map keys
- Stripe checkout uses GBP.
- Shipping is added in Stripe checkout as UK Standard Delivery.
- Printify order creation is handled by the Stripe webhook after `checkout.session.completed`.

Important safety note:

- No secret values were printed or inspected.
- Environment variable names are referenced in code, which is correct.

## 4. Product Data Files

Product and export files found:

- `shop-data.js`
- `elite-products.json`
- `phat-gorrilla-products.json`
- `printify_country_products_for_site.json`
- `data/stripe-printify-map.json`
- `data/printify-products-export.csv`
- `google-free-listings-feed.xml`
- local/untracked Printify API export JSON files

Counts:

- Stripe/Printify map keys: 1094
- Main shop products in `shop-data.js`: 16 total, 12 visible, 4 hidden
- Elite products in `elite-products.json`: 23
- Country products in `printify_country_products_for_site.json`: 11
- Google free listings feed items: 12
- Sitemap URLs: 14

## 5. Product Quality Findings

Main shop:

- Functional but product data is thin.
- Visible products have titles, images, prices, offers and checkout links.
- Visible products do not include size or colour fields in `shop-data.js`.
- Product descriptions/offers repeat the same wording too much.
- Some titles are inconsistent or not premium enough, for example:
  - `Paper Poster`
  - `Phat Gorrilla Heavy Cotton Tee`
  - duplicate `Phat Gorrilla Heavy Cotton Tee`
  - long mixed-style titles copied from Printify
- 4 hidden products still use `#checkout-not-ready`, which is safe while hidden.

Elite page:

- Checkout links are mapped and working from a static scan.
- Visual direction is closer to premium than the main shop.
- Product copy is repeated across most cards:
  - `Realistic premium Elite piece in cream, army, stone, olive, black and gold styling...`
- `elite-products.json` lacks rich descriptions, sizes and colours.
- The page can be improved by grouping products more clearly and using stronger product-specific copy.


- 14 product cards and checkout keys are mapped.
- The theme is clear.
- Some mockups appear to use inconsistent camera labels or front/back choices.
- Product titles can be sharpened for supporters and country pride.
- Sizes and colours are not shown clearly on the customer-facing cards.

Product visuals:

- Many customer-facing product images come directly from Printify mockup URLs.
- Some images likely need better featured image selection and consistent mockup order.
- This should be handled in Phase 3 after inspecting Printify products through the API.

## 6. Social Links And Brand Hub

Connected social URLs:

- Instagram: `https://www.instagram.com/phatgorrilla/`
- TikTok: `https://www.tiktok.com/@phatgorrilla`
- Facebook: `https://www.facebook.com/profile.php?id=61590460628534`

Clean site short links:

- `https://phatgorrilla.com/instagram`
- `https://phatgorrilla.com/tiktok`
- `https://phatgorrilla.com/facebook`

Brand hub:

- `https://phatgorrilla.com/socials`
- Good direction, but social accounts themselves still need real content, bios, links, launch posts and product visuals.

## 7. SEO, Feed And Verification Files

Found and connected:

- `sitemap.xml`
- `robots.txt`
- `google-free-listings-feed.xml`
- `phatgorrilla-20260531-indexnow.txt`
- TikTok verification file
- Google site verification meta tag in `index.html`
- Google Ads tag: `AW-18200925736`

SEO findings:

- Main pages have basic titles and meta descriptions.
- Some support pages have short meta descriptions.
- Some pages lack Open Graph images.
- `about.html` lacks a canonical link and Open Graph image.
- Product schema exists on `shop.html`, but it is basic and can be strengthened.
- Google product feed exists but only has 12 items and could use better titles/descriptions/images.

## 8. Broken Links, Missing Images And Duplicates

Customer-facing production pages:

- No duplicate nav links were detected.
- Checkout keys checked against the Stripe/Printify map with 0 missing keys.
- No old direct `phat-gorrilla.printify.me/product/...` customer checkout links were found in active customer pages.

Static scan notes:

- `shop.html` and `app.html` show false-positive dynamic links/images such as `${product.buy_url}` and `${product.image}` because those are generated by JavaScript at runtime.
- Backup/review pages contained many local `file:///C:/...` image references. These were backed up and removed from the working folder.
- One old ignored Elite backup file contained an old direct Printify storefront link. It was backed up and removed from the working folder.

## 9. Pages That Look Unfinished Or Need Polish

Highest priority:

- `index.html`: needed a more premium launch hero and stronger new-drop/product sections. This has now had a safe first refresh.
- `shop.html`: functional, but needed more premium cards, product badges and collection grouping. This has now had a safe first refresh.
- `elite.html`: good base, but repeated copy made it feel generated. The first refresh added stronger trust and collection framing.
- `socials.html`: useful hub, but could support active launch campaigns with pinned content and social proof.
- `comments.html`: present, but should feel more like community/testimonial content.

Lower priority:

- `free-app.html`: was a plain redirect-style page. It has now been refreshed with proper app-demo wording, meta description and a clearer CTA.
- `scotland_fixed_product_review_v2.html`: removed after backup because it looked like a review utility page and did not belong in the public production site.

## 10. Social Media Gap

Current issue:

- The technical connections exist, but Instagram, TikTok and Facebook are not filled with enough content yet.
- The profiles need:
  - bio
  - website link
  - profile image
  - cover image where available
  - first launch post
  - pinned post strategy
  - first 9 Instagram grid posts
  - TikTok launch video plan
  - Facebook intro/launch post

Existing useful local asset folder:

- `C:\Users\Chris Nugent\Desktop\PHAT_GORRILLA_SIMPLE_ASSETS\SocialProfiles`

## 11. Recommended First Batch Of Changes

Do this first, before deeper API work:

2. Improve product card layout without changing checkout URLs or prices.
3. Rewrite visible product titles/descriptions in website data only.
4. Add visible size/colour/trust notes where data already exists.
5. Add a stronger homepage launch layout:
   - Shop the Drop
   - Super Elite Range
   - Follow @phatgorrilla
   - Limited designs. Made on demand.
6. Clean social/account presentation through content files first, not API auto-posting.
7. Create the 30-day social content CSV and caption file.
8. After that, inspect Printify via API and make a product improvement plan before any Printify updates.

## 12. What Not To Touch Yet

Do not change yet:

- Product prices
- Stripe checkout function
- Stripe webhook
- Printify order creation
- `data/stripe-printify-map.json`
- Netlify environment variables
- Printify products in bulk
- Public social posting

## 13. Phase 2 Starting Point

Safe first implementation batch:

- Backed up the main customer pages and confusing local leftovers once.
- Refreshed:
  - `index.html`
  - `shop.html`
  - `elite.html`
  - `app-demo.html`
  - `app.html`
  - `free-app.html`
  - shared premium refresh CSS
- Kept all existing `/.netlify/functions/create-checkout-session?key=...` links unchanged.
- Added stronger customer-facing wording for made-on-demand Printify fulfilment, secure GBP Stripe checkout, social following and free demo/full app access.
- Tested checkout key counts before and after.
- Do not deploy until local checks pass.
