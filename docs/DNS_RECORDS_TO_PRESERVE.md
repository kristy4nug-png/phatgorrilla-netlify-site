# DNS Records To Preserve

Last updated: 2026-06-07

## Safe DNS Rule

Do not remove or replace any current DNS records until EasyWP provides the exact target records and the WordPress/WooCommerce site has been tested.

The current Netlify setup protects the live domain. DNS should be changed only after the EasyWP site is ready.

## Current Domain

- Main domain: `phatgorrilla.com`
- Current live host: Netlify
- Future host target: Namecheap EasyWP / WordPress / WooCommerce

## Records / Settings To Preserve

Preserve existing records for:

- `phatgorrilla.com`
- `www.phatgorrilla.com`
- Any Netlify records currently keeping the live site online
- Any email/MX records for `phatgorrilla.com`
- Any SPF, DKIM, or DMARC records used for email delivery
- Any Google Search Console verification TXT or CNAME records
- Any Google Ads / Google services verification records
- Any other third-party verification records

Do not remove email records while moving the website. Website hosting records and email records are separate.

## Important Notes

The clean social paths are not DNS records:

- `/instagram`
- `/tiktok`
- `/facebook`

They are website redirects. They must be recreated in WordPress, a redirect plugin, or the final hosting layer.

## SEO / Verification To Preserve During DNS Change

Current repo assets include:

- `sitemap.xml`
- `robots.txt`
- `google-free-listings-feed.xml`
- `phatgorrilla-20260531-indexnow.txt`
- `tiktok9EDqKzVymfITSScfk67zYoTUU1uKFbDJ.txt`
- Google Ads tag: `AW-18200925736`
- Google Search Console meta verification in `index.html`

If Google Search Console is verified by DNS, preserve that DNS record even after moving the site.

## EasyWP DNS Change Plan

Only make DNS changes after EasyWP shows the exact required records.

Typical options may include:

- A record for the apex/root domain
- CNAME for `www`
- CNAME or EasyWP-specific records requested by Namecheap

Use the exact values provided by EasyWP/Namecheap. Do not guess IP addresses.

## DNS Switch Checklist

Before changing DNS:

- WooCommerce currency is GBP.
- The WordPress site loads on the EasyWP temporary URL.
- The shop page works.
- At least one real product is published.
- Stripe checkout works through WooCommerce.
- Printify receives WooCommerce orders.
- Legal/support pages exist.
- Social redirects are ready.
- SEO/verification files or plugin equivalents are ready.
- Current DNS records have been copied/screenshot/exported.
- Email/MX records are confirmed and preserved.

After changing DNS:

- Check `https://phatgorrilla.com`
- Check `https://www.phatgorrilla.com`
- Check `/shop`
- Check `/elite`
- Check `/instagram`
- Check `/tiktok`
- Check `/facebook`
- Check `/contact`
- Check `/terms`
- Check `/privacy-policy`
- Check `/shipping-returns`
- Check `/size-guide`
- Check sitemap and robots.txt
- Run one final WooCommerce checkout test

## Do Not Delete Netlify Yet

Even after DNS changes, keep Netlify available until:

- The EasyWP site has been stable after DNS propagation.
- WooCommerce checkout is confirmed.
- Stripe webhook replacement is confirmed.
- Printify fulfilment is confirmed.
- Old Netlify checkout links have been replaced or redirected.
- SEO and verification assets are confirmed on the new site.
