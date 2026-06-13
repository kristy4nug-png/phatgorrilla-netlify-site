# Phat Gorrilla Netlify Site

This is the legacy Netlify/static site repo for Phat Gorrilla.

Current launch direction: the real shop is now WordPress/WooCommerce on Namecheap EasyWP at `https://phatgorrilla.com`.

Do not use this repo as the active shop source unless there is an approved rollback. The old Netlify checkout and Stripe/Printify function code is kept for reference and safety until WooCommerce checkout, Stripe, Printify fulfilment, DNS, SSL, SEO, and policy pages are fully confirmed.

Do not delete Netlify or Netlify DNS from this repo alone.

Original assets and brand folders are kept safely in the parent folder.

## Adding New Printify Products Safely

Legacy Netlify process only:

- Add the Printify product/variant to `data/stripe-printify-map.json` before selling it.
- Add the customer-facing product entry to `shop-data.js` with a `buy_url` like `/.netlify/functions/create-checkout-session?key=YOUR_PRODUCT_KEY`.
- The shop and full app page both read live products from `shop-data.js`, so new visible products can appear in both places.
- Never use direct `phat-gorrilla.printify.me/product/...` customer links.
- Do not edit or expose secret keys. Stripe and Printify secrets stay in Netlify environment variables.

Live WooCommerce products should now be managed in WordPress/WooCommerce/Printify instead.

## Free Search Engine Submission

- Submit `https://phatgorrilla.com/sitemap.xml` in Google Search Console and Bing Webmaster Tools.
- Submit `https://phatgorrilla.com/google-free-listings-feed.xml` in Google Merchant Center for free product listings.
- IndexNow ownership is prepared with `https://phatgorrilla.com/phatgorrilla-20260531-indexnow.txt`.
- After deployment, submit changed URLs to IndexNow with key `phatgorrilla-20260531-indexnow`.

## Social Profiles And API Setup

- Official social hub: `https://phatgorrilla.com/socials`
- Official Instagram: `https://www.instagram.com/phatgorrilla/`
- Official TikTok: `https://www.tiktok.com/@phatgorrilla`
- Official Facebook: `https://www.facebook.com/profile.php?id=61590460628534`
- API setup notes are in `SOCIAL_API_SETUP.md`.
- Never commit social API tokens, app secrets, passwords or recovery codes.
