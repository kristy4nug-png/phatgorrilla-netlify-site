# Phat Gorrilla Netlify Site

This is the clean deploy folder for phatgorrilla.com.

Original assets and brand folders are kept safely in the parent folder.

## Adding New Printify Products Safely

- Add the Printify product/variant to `data/stripe-printify-map.json` before selling it.
- Add the customer-facing product entry to `shop-data.js` with a `buy_url` like `/.netlify/functions/create-checkout-session?key=YOUR_PRODUCT_KEY`.
- The shop and full app page both read live products from `shop-data.js`, so new visible products can appear in both places.
- Never use direct `phat-gorrilla.printify.me/product/...` customer links.
- Do not edit or expose secret keys. Stripe and Printify secrets stay in Netlify environment variables.

## Free Search Engine Submission

- Submit `https://phatgorrilla.com/sitemap.xml` in Google Search Console and Bing Webmaster Tools.
- Submit `https://phatgorrilla.com/google-free-listings-feed.xml` in Google Merchant Center for free product listings.
- IndexNow ownership is prepared with `https://phatgorrilla.com/phatgorrilla-20260531-indexnow.txt`.
- After deployment, submit changed URLs to IndexNow with key `phatgorrilla-20260531-indexnow`.
