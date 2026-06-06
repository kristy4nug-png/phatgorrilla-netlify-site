# Phat Gorrilla Product Improvement Plan

Date: 2026-06-06

## What changed in this phase

The website now has a safer live Printify product layer.

- Published Printify products can be pulled into the shop automatically.
- Products already curated in `shop-data.js` stay featured in the main shop.
- New Printify products that are not in `shop-data.js` can appear in the `Live Printify Drops` section.
- Auto products open `product.html`, where customers choose the live Printify variant before Stripe checkout.
- Checkout only opens after the Netlify function verifies the product and variant against the Printify API.

## Safe publish workflow

Use this every time you make a new product in Printify:

1. Set a strong title.
2. Set the retail price in Printify before publishing.
3. Enable only the sizes and colours you actually want to sell.
4. Choose the best front mockup as the main image.
5. Make sure the product is visible/published.
6. Check `https://phatgorrilla.com/shop.html` after a short refresh.
7. Open the product, choose a variant, and confirm the Stripe checkout page opens.

## Title style

Use titles that sound like a real streetwear shop, not factory listings.

Examples:

- `Phat Gorrilla Scotland Crest Tee`
- `Phat Gorrilla Black Gold Elite Hoodie`
- `Phat Gorrilla World Cup Brazil Tee`
- `Phat Gorrilla Neon Gorilla Crewneck`
- `Phat Gorrilla Country Supporter Tee`

Avoid:

- Long SEO-stuffed titles.
- Duplicate titles.
- Supplier-style names only, such as `Unisex Heavy Cotton Tee`.
- Titles that reveal profit, cost, or backend setup.

## Description style

Use this pattern:

`Premium Phat Gorrilla streetwear with bold gorilla energy, secure GBP checkout and made-on-demand fulfilment by Printify. Selected designs use intentional rustic or distressed print texture for a worn-in streetwear finish.`

For World Cup products:

`Built for bold supporters. A country-inspired Phat Gorrilla tee with strong colour, football energy and intentional rustic print texture. Secure GBP checkout, printed and fulfilled by Printify.`

For Super Elite products:

`A cleaner premium Phat Gorrilla Elite piece with black, gold, cream, stone or army styling. Secure GBP checkout, printed and fulfilled by Printify. Full app access comes free after purchase.`

## Image/mockup rules

- Use the cleanest front mockup first.
- Avoid dark, blurry or cropped mockups as the first image.
- Keep a consistent first image style across similar products.
- For designs with deliberate rustic texture, keep it visible but describe it as intentional.
- Remove weak mockups from customer-facing order if Printify allows it safely.

## Pricing rule

The website now reads live Printify variant prices for auto products.

Before publishing in Printify, check:

- Retail price is correct.
- Your intended margin is already included in the product price.
- Delivery is not shown as profit language on the site.
- Stripe checkout still shows GBP.

## What still stays manual

The main featured shop cards are still curated in `shop-data.js`. This is good because the first screen should stay premium and controlled.

Use auto-sync for newly published products, then move the strongest products into the curated main shop once they are proven.

## Important safety

Do not paste API keys into files.

The live sync uses Netlify environment variables:

- `PRINTIFY_API_TOKEN`
- `PRINTIFY_SHOP_ID`
- `STRIPE_SECRET_KEY`

These must stay private.
