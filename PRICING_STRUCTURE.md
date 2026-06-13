# 💰 PHAT GORRILLA - NEW PRICING STRUCTURE
**Updated: June 6, 2026**

---

## ✅ PRICING MARKUP APPLIED

### New Markup Rules:
- **T-Shirts**: +£3 markup
- **Everything else** (Hoodies, Sweatshirts, Posters): +£8 markup
- **Shipping**: £4.99 fixed to UK

---

## 📊 PRICING EXAMPLES

### T-Shirts (Base + £3)
| Item | Base Price | Markup | Customer Price | Shipping | **Total** |
|------|-----------|--------|-----------------|----------|----------|
| Gildan T-Shirt (example) | £24.99 | +£3 | **£27.99** | £4.99 | **£32.98** |

### Hoodies (Base + £8)
| Item | Base Price | Markup | Customer Price | Shipping | **Total** |
|------|-----------|--------|-----------------|----------|----------|
| Heavy Hoodie | £35.99 | +£8 | **£43.99** | £4.99 | **£48.98** |

### Sweatshirts (Base + £8)
| Item | Base Price | Markup | Customer Price | Shipping | **Total** |
|------|-----------|--------|-----------------|----------|----------|
| Crewneck | £31.99 | +£8 | **£39.99** | £4.99 | **£44.98** |

### Posters (Base + £8)
| Item | Base Price | Markup | Customer Price | Shipping | **Total** |
|------|-----------|--------|-----------------|----------|----------|
| A2 Poster | £8.99 | +£8 | **£16.99** | £4.99 | **£21.98** |

---

## 🔄 PRICING FLOW

### On Shop.html (Display)
```
Printify API Price
    ↓ + Markup (£3 for T-Shirt, £8 for other)
Displayed Price (what customer sees)
    ↓
"£27.99" shown on product card
```

### At Checkout (Payment)
```
Displayed Price: £27.99
    + Shipping: £4.99
    ↓
Stripe Charges: £32.98 GBP
```

---

## 🧪 HOW TO VERIFY

### Test on Shop Page:
1. Visit: https://phatgorrilla.com/shop.html
2. Look at T-shirt prices → Should be base + £3
3. Look at hoodie prices → Should be base + £8
4. Select a product and proceed to checkout
5. Stripe checkout total = displayed price + £4.99

### Check Product Prices:
- **T-Shirts**: £27.99, £28.99, £29.99, etc. (base + £3)
- **Hoodies**: £43.99, £45.99, etc. (base + £8)
- **Sweatshirts**: £39.99, £41.99, etc. (base + £8)
- **Posters**: £16.99, £18.99, etc. (base + £8)

---

## 💡 PROFIT CALCULATION

### Example: £27.99 T-Shirt
```
Customer Charge:     £27.99
├─ Printify Cost:   £24.99
├─ Your Markup:     £3.00
└─ Profit:          £3.00 (per shirt)

Plus shipping charge (£4.99) covers delivery costs
```

### Example: £43.99 Hoodie
```
Customer Charge:     £43.99
├─ Printify Cost:   £35.99
├─ Your Markup:     £8.00
└─ Profit:          £8.00 (per hoodie)

Plus shipping charge (£4.99) covers delivery costs
```

---

## 📝 TECHNICAL CHANGES

### Files Updated:
1. **netlify/functions/printify-products.js**
   - Added: `getMarkupPence(type)` function
   - Added: `applyMarkup(price, type)` function
   - Updated: Product prices include markup before display
   - Updated: min_price and max_price fields added

2. **netlify/functions/create-checkout-session.js**
   - Added: `getMarkupPence(type)` function
   - Added: `applyMarkup(price, type)` function
   - Updated: Checkout session price includes markup
   - Added: base_price_pence and markup_pence tracking

3. **shop.html**
   - No changes needed (uses prices from function above)

---

## 🚀 DEPLOYMENT

When you redeploy to Netlify, these changes will take effect immediately:

1. All product prices on shop.html will update to include markup
2. All checkout sessions will charge with markup included
3. Prices will reflect in real-time on all pages

**To deploy:**
1. Go to: https://app.netlify.com
2. Select: phatgorrilla-netlify-site
3. Click: Deploy main branch

---

## ❓ FAQ

**Q: Will customers see the markup?**
A: Yes, they see the final price including markup. The base Printify price is hidden.

**Q: Can I adjust the markup?**
A: Yes - edit the `getMarkupPence` function in both files to change the amounts.

**Q: Does shipping cover markup?**
A: No, they're separate. Shipping (£4.99) covers delivery costs. Markup is your profit.

**Q: What if I want different markup for different products?**
A: Update the `getMarkupPence(type)` function to add more product types with custom markups.

**Q: Will my old prices in Printify change?**
A: No - Printify prices stay the same. The markup is added on top by your functions.

---

## 💰 REVENUE IMPACT

### Assuming 100 Orders/Month:
- 60 T-shirts × £3 markup = **£180/month**
- 30 Hoodies × £8 markup = **£240/month**
- 10 Other items × £8 markup = **£80/month**
- **Total markup profit: £500/month**

(Plus shipping margin: ~£50-100/month)

---

*Pricing structure now applied and ready for production deployment.*
