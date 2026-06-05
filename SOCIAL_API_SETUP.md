# Phat Gorrilla Social API Setup

This file is for account setup only. Do not commit API keys, access tokens, app secrets, passwords or recovery codes.

## Official Brand Accounts

- Website: `https://phatgorrilla.com`
- Social hub: `https://phatgorrilla.com/socials`
- Instagram: `https://www.instagram.com/phatgorrilla/`
- TikTok: `https://www.tiktok.com/@phatgorrilla`
- Facebook: `https://www.facebook.com/profile.php?id=61590460628534`

## Meta / Facebook / Instagram

Use Meta Business Suite and Meta for Developers.

Recommended public brand setup:

- Business name: `Phat Gorrilla`
- Page name: `Phat Gorrilla`
- Category: `Clothing brand`
- Website: `https://phatgorrilla.com`
- Public contact page: `https://phatgorrilla.com/contact.html`
- Instagram handle: `@phatgorrilla`

Developer app name:

`Phat Gorrilla Social Publisher`

Products to add when available:

- Facebook Login
- Instagram Graph API
- Pages API

Useful permissions/scopes, only if Meta offers and approves them:

- `pages_show_list`
- `pages_read_engagement`
- `pages_manage_metadata`
- `pages_manage_posts`
- `instagram_basic`
- `instagram_content_publish`

Safe storage:

- Store tokens only in platform secrets or a password manager.
- Do not paste tokens into chat.
- Do not save tokens in this repository.

## TikTok

Use TikTok for Developers.

Developer app name:

`Phat Gorrilla Social Publisher`

Website/domain:

`https://phatgorrilla.com`

Terms of Service URL:

`https://phatgorrilla.com/terms-of-service.html`

Privacy Policy URL:

`https://phatgorrilla.com/privacy-policy.html`

App icon:

`assets/brand/tiktok-app-icon-1024.png`

Products to request:

- Login Kit
- Content Posting API

Useful scopes, only if TikTok approves them:

- `user.info.basic`
- `video.publish`
- `video.upload`

Notes:

- TikTok direct posting requires a registered developer app and user authorization.
- TikTok may keep posts from unreviewed apps private until the app passes review.
- Use `https://phatgorrilla.com/socials` as the brand link during review.

## Paste-Ready Profile Bio

`Premium gorilla streetwear. Country drops. Super Elite range. Secure GBP checkout. Printed by Printify. Free demo now. Full app after purchase.`

## First Launch Post

`Phat Gorrilla is live. Premium gorilla streetwear, country drops and the Super Elite range are now available at https://phatgorrilla.com. Secure GBP checkout powered by Stripe. Products are printed and fulfilled by Printify. Free demo now, full app after purchase.`

## Hashtags

`#PhatGorrilla #Streetwear #UKStreetwear #GorillaBrand #SuperElite #CountryDrops #PrintedByPrintify #NewBrand #FashionDrop`

## What Codex Can Do After Login

Once the accounts show an approved app and OAuth screen, Codex can help wire API calls safely using environment variables.

Expected environment variable names:

- `META_APP_ID`
- `META_APP_SECRET`
- `META_PAGE_ID`
- `META_PAGE_ACCESS_TOKEN`
- `INSTAGRAM_BUSINESS_ACCOUNT_ID`
- `TIKTOK_CLIENT_KEY`
- `TIKTOK_CLIENT_SECRET`

Never commit values for these variables.
