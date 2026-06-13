# Phat Gorrilla — WordPress Brand Assets

Active brand assets for the Phat Gorrilla WordPress/WooCommerce store at [phatgorrilla.com](https://phatgorrilla.com).

## What's In Here

| File | Use |
|---|---|
| `brand-assets/built-different.png` | Homepage hero image |
| `brand-assets/new-drop.png` | Shop page banner |
| `brand-assets/elite-range-black-gold.png` | Super Elite category image |
| `brand-assets/elite-colourways-neon.png` | Neon colourway promo |
| `brand-assets/elite-colourways-earth.png` | Earth-tone promo |
| `brand-assets/join-the-movement.png` | Social/footer callout |
| `brand-assets/wordpress-theme-colours.css` | Theme colour tokens |

## Core Brand Palette

```
#050505  Black (background)
#141414  Charcoal
#F91A7D  Hot Magenta (primary accent)
#BA0752  Deep Magenta
#A6C303  Acid Lime (secondary accent)
#576D02  Army Green
#C99E41  Metallic Gold
#F7D87B  Bright Gold
#E3D4C0  Cream
#C4A684  Sand
#3D4E02  Olive
```

## Live Store

- **Website:** https://phatgorrilla.com
- **Shop:** WooCommerce
- **Payments:** Stripe (live mode)
- **Fulfilment:** Printify → WooCommerce
- **App:** https://github.com/kristy4nug-png/PowerGorilla

## Rules

- Do NOT deploy from this repo — WordPress is the live source of truth
- Do NOT commit API keys, `.env` files, or Stripe keys
- Upload images via WordPress Media Library only
- See `PRINTIFY_NEW_PRODUCT_RULES.md` in the brand pack for product workflow

## App Page

The app page (`/app`) on phatgorrilla.com is built from `app-page/app-page.html`.  
Post-purchase delivery is handled by `app-page/woocommerce-app-delivery.php`.
