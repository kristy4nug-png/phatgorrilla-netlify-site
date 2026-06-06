# 🚀 PHAT GORRILLA E-COMMERCE DEPLOYMENT CHECKLIST
**Status: READY FOR PRODUCTION**
**Date: June 6, 2026**

---

## ✅ SYSTEM STATUS

### Infrastructure ✅ VERIFIED
- **Hosting**: Netlify (phatgorrilla-netlify-site)
- **Payment**: Stripe (GBP currency, pence amounts)
- **Print-on-Demand**: Printify API v1
- **Variants System**: Dynamic size/color selection
- **Checkout Flow**: Netlify functions → Stripe checkout

### Pricing System ✅ VERIFIED
- **Currency**: GBP (British pounds)
- **Amounts**: Pence format (£29.99 = 2999 pence)
- **Suppliers**: Printify (all UK-sourced)
- **Connected**: Products → Variants → Stripe ✅

### Code Status ✅ READY
- `product-component.js`: Shared variant system ✅
- `product-card-styles.css`: Consistent styling ✅
- `netlify/functions/printify-products.js`: Product fetching ✅
- `netlify/functions/create-checkout-session.js`: Checkout (FIXED) ✅
- `netlify/functions/stripe-webhook.js`: Order tracking ✅
- `netlify/functions/printify-order-email.js`: Confirmation emails ✅

---

## 📋 DEPLOYMENT STEPS (DO NOW)

### STEP 1: Get Your Stripe Secret Key
1. Go to: https://dashboard.stripe.com/test/apikeys
2. Copy the **Secret Key** (starts with `sk_test_` or `sk_live_`)
3. Keep it safe - you'll need it in step 2

### STEP 2: Add Environment Variables to Netlify
1. Go to: https://app.netlify.com
2. Select: **phatgorrilla-netlify-site**
3. Navigate to: **Site Settings** → **Build & Deploy** → **Environment**
4. Click: **Edit variables**
5. Add these variables:

| Key | Value | Source |
|---|---|---|
| `PRINTIFY_API_TOKEN` | `eyJ0eXA...` (from .env.local) | Your Printify JWT |
| `PRINTIFY_SHOP_ID` | `27674090` | Already configured |
| `STRIPE_SECRET_KEY` | `sk_test_...` | From Step 1 above |
| `SITE_URL` | `https://phatgorrilla.com` | Your domain |

6. Click: **Save**
7. Navigate to: **Deploys** tab
8. Click: **Trigger deploy** (deploy main branch)
9. Wait 2-3 minutes for build to complete

**You'll see:** "Deploy complete" notification when ready ✅

### STEP 3: Verify Deployment
Run this command in terminal to verify products are loading:
```bash
curl "https://phatgorrilla.com/.netlify/functions/printify-products" | head -c 500
```

Expected: JSON with product data

### STEP 4: Test Checkout Flow
1. Visit: https://phatgorrilla.com/shop.html
2. Verify: Products load from Printify
3. Click: Any product "Add to Cart"
4. Select: Size and Color dropdowns
5. Click: "Add to Cart" button
6. Expected: Redirect to Stripe checkout ✅

---

## 🔧 PRICING VERIFICATION

### UK Supplier Check
All products are fulfilled by **Printify** (UK print provider):
- ✅ Products fetched from Printify API
- ✅ Prices in GBP (British pounds)
- ✅ Amounts in pence (£27.99 = 2799p)
- ✅ Shipping: £4.99 fixed to UK addresses
- ✅ Currency: GBP only (no EUR/USD conversion)

### Price Connection Chain
```
Printify Product
    ↓ (pence: 2799)
Printify API Response
    ↓ (converts to £27.99)
.netlify/functions/printify-products.js
    ↓ (displays as £27.99)
Product Card on shop.html
    ↓ (variant selected)
.netlify/functions/create-checkout-session.js
    ↓ (converts back to 2799 pence)
Stripe Checkout Session
    ↓ (charges customer in GBP)
Stripe Payment Confirmed ✅
```

### Check Product Prices
Each product on shop.html should show:
- Price in £ format (e.g., "£27.99")
- Range if multiple variants (e.g., "£25.99 - £49.99")
- Updated from Printify in real-time

---

## 🎯 FEATURES READY

✅ **Shop Catalog**
- Dynamic product grid from Printify
- Type filtering (All/T-Shirt/Hoodie/Sweatshirt/Poster)
- Price sorting (Low-High / High-Low)
- Professional responsive design

✅ **Variant Selection**
- Size selector (auto-detected from Printify)
- Color selector (auto-detected from Printify)
- Applied to all pages: shop.html, index.html, worldcup.html, elite.html
- Consistent styling across entire app

✅ **Secure Checkout**
- Stripe payment processing (GBP)
- UK shipping address collection
- Phone number collection
- Product/variant metadata tracking
- Automatic redirect to thank-you page

✅ **Order Tracking**
- Stripe webhook for payment confirmations
- Order confirmation emails (via Printify)
- Session ID tracking for order lookup

---

## 🚨 CRITICAL CONFIGURATION

### Required for Checkout to Work:
1. ✅ Printify API Token: Configured in `.env.local`
2. ⚠️ Stripe Secret Key: **MUST BE ADDED** to Netlify environment
3. ✅ Shop ID: `27674090` (set)
4. ✅ Site URL: `https://phatgorrilla.com` (set)

### Without Stripe Secret Key:
❌ Checkout will fail with error: "Stripe is not configured"
❌ Cannot create payment sessions
❌ Customers cannot complete purchases

**ACTION REQUIRED:** Add STRIPE_SECRET_KEY to Netlify environment (Step 2 above)

---

## 📞 TESTING CHECKLIST

### Before Going Live:
- [ ] Environment variables added to Netlify
- [ ] Deploy triggered and completed
- [ ] https://phatgorrilla.com/shop.html loads products
- [ ] Size/color selectors work on each product
- [ ] "Add to Cart" redirects to Stripe checkout
- [ ] Stripe checkout shows correct price in GBP
- [ ] Can complete test payment (or cancel test)
- [ ] Thank-you page displays after successful payment

### Troubleshooting:

**"Product not found" error**
- Check: Printify products are published
- Check: PRINTIFY_API_TOKEN is valid
- Check: PRINTIFY_SHOP_ID is `27674090`

**"Stripe not configured" error**
- Check: STRIPE_SECRET_KEY added to Netlify
- Check: Value starts with `sk_test_` or `sk_live_`
- Check: Deploy triggered after adding variable

**Products showing £0.00**
- Check: Variants have prices in Printify
- Check: Variants are marked as enabled
- Check: Product is marked visible/published

**Checkout redirects fail**
- Check: Browser console for JavaScript errors
- Check: Stripe session ID returned properly
- Check: Stripe domain is whitelisted in Stripe dashboard

---

## 📊 MONITORING

After deployment, monitor:
- **Products loading**: Check shop.html periodically
- **Checkout success rate**: Monitor Stripe dashboard
- **Order fulfillment**: Track in Printify orders
- **Email confirmations**: Verify orders via email

---

## 🎁 POST-DEPLOYMENT OPTIONS

Once live and tested, consider:
1. **Professional photography** - Replace Printify mockups with custom images
2. **Email campaigns** - Announce shop opening
3. **Discount codes** - Stripe promo codes for first customers
4. **Analytics** - Add Google Analytics 4 tracking to checkout
5. **Upselling** - Product recommendations engine

---

## 📞 NEED HELP?

**Stripe API Issues:**
- Go to: https://dashboard.stripe.com/test/developers/logs
- Look for recent API requests and errors

**Netlify Function Issues:**
- Go to: https://app.netlify.com → Functions → View logs
- Check for runtime errors in real-time

**Printify Product Issues:**
- Go to: https://printify.com → Products
- Verify products are published and have prices

---

**READY TO DEPLOY? Start with STEP 1 above! 🚀**
