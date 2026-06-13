/**
 * PHAT GORRILLA PRODUCT COMPONENT v2
 * Smart variant selection: size buttons + colour swatches
 * Integrates: Printify variants → Stripe Checkout
 */

class PhatGorrillaProduct {
  constructor(productElement) {
    this.element = productElement;
    this.productId = this.element.dataset.productId;
    this.variants = JSON.parse(this.element.dataset.variants || '[]');
    this.rawSizes = JSON.parse(this.element.dataset.sizes || '[]');
    this.rawColours = JSON.parse(this.element.dataset.colours || '[]');
    this.selectedSize = null;
    this.selectedColour = null;

    this.init();
  }

  init() {
    this.renderSelectors();
    this.attachListeners();
  }

  // ─── Build Available Sizes / Colours from Variants ────────────────────────
  getAvailableSizes() {
    // If we have structured sizes use them, otherwise parse from variant titles
    if (this.rawSizes && this.rawSizes.length > 0) return this.rawSizes;
    const sizeWords = new Set(['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL', 'ONE SIZE']);
    const seen = [];
    const seenSet = new Set();
    this.variants.forEach(v => {
      if (!v || !v.title) return;
      v.title.split('/').map(p => p.trim().toUpperCase()).forEach(part => {
        if ((sizeWords.has(part) || /^\d+XL$/.test(part)) && !seenSet.has(part)) {
          seenSet.add(part);
          seen.push(part);
        }
      });
    });
    return seen;
  }

  getAvailableColours() {
    if (this.rawColours && this.rawColours.length > 0) return this.rawColours;
    const sizeWords = new Set(['xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', 'one size']);
    const seen = [];
    const seenSet = new Set();
    this.variants.forEach(v => {
      if (!v || !v.title) return;
      v.title.split('/').map(p => p.trim()).forEach(part => {
        const lower = part.toLowerCase();
        if (!sizeWords.has(lower) && !/^\d+xl$/.test(lower) && !seenSet.has(part)) {
          seenSet.add(part);
          seen.push(part);
        }
      });
    });
    return seen;
  }

  // ─── Render Size Buttons & Colour Swatches ────────────────────────────────
  renderSelectors() {
    const variantsContainer = this.element.querySelector('.pg-product-variants');
    if (!variantsContainer) return;

    const sizes = this.getAvailableSizes();
    const colours = this.getAvailableColours();

    let html = '';

    if (sizes.length > 0) {
      html += `
        <div class="pg-variant-group">
          <label class="pg-variant-label">
            Size
            <span class="pg-selected-label" data-for="size"></span>
          </label>
          <div class="pg-size-buttons" role="group" aria-label="Select size">
            ${sizes.map(size => `
              <button type="button" class="pg-size-btn" data-size="${size}" aria-pressed="false">
                ${size}
              </button>
            `).join('')}
          </div>
        </div>
      `;
    }

    if (colours.length > 1) {
      html += `
        <div class="pg-variant-group">
          <label class="pg-variant-label">
            Colour
            <span class="pg-selected-label" data-for="colour"></span>
          </label>
          <div class="pg-colour-buttons" role="group" aria-label="Select colour">
            ${colours.map(colour => `
              <button type="button" class="pg-colour-btn" data-colour="${colour}" aria-pressed="false"
                title="${colour}"
                style="background:${this.colourToCSS(colour)};">
                <span class="pg-colour-label">${colour}</span>
              </button>
            `).join('')}
          </div>
        </div>
      `;
    } else if (colours.length === 1) {
      // Auto-select single colour silently
      this.selectedColour = colours[0];
    }

    variantsContainer.innerHTML = html;
  }

  colourToCSS(name) {
    const map = {
      'black': '#111',
      'white': '#f8f8f8',
      'navy': '#1a2a4a',
      'navy blue': '#1a2a4a',
      'red': '#cc2200',
      'royal blue': '#2255cc',
      'royal': '#2255cc',
      'green': '#1a7a2a',
      'forest green': '#1a5c2a',
      'army green': '#4a5a2a',
      'olive': '#6b7a2a',
      'grey': '#777',
      'gray': '#777',
      'sport grey': '#999',
      'charcoal': '#444',
      'maroon': '#6e1a1a',
      'yellow': '#d4b800',
      'gold': '#c9a227',
      'purple': '#5a2090',
      'orange': '#c85500',
      'pink': '#d44070',
      'light pink': '#e88090',
      'heather grey': '#9a9a9a',
      'sand': '#c8b070',
      'cream': '#e8d8a8',
      'stone': '#a8988a',
      'natural': '#d4c8a0',
    };
    const lower = name.toLowerCase().trim();
    if (map[lower]) return map[lower];
    // Try partial match
    for (const [key, val] of Object.entries(map)) {
      if (lower.includes(key)) return val;
    }
    // Fallback gradient
    return 'linear-gradient(135deg, #333, #555)';
  }

  // ─── Event Listeners ──────────────────────────────────────────────────────
  attachListeners() {
    // Size buttons
    this.element.querySelectorAll('.pg-size-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.element.querySelectorAll('.pg-size-btn').forEach(b => {
          b.classList.remove('selected');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('selected');
        btn.setAttribute('aria-pressed', 'true');
        this.selectedSize = btn.dataset.size;

        const lbl = this.element.querySelector('.pg-selected-label[data-for="size"]');
        if (lbl) lbl.textContent = `— ${this.selectedSize}`;

        this.updatePrice();
      });
    });

    // Colour buttons
    this.element.querySelectorAll('.pg-colour-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.element.querySelectorAll('.pg-colour-btn').forEach(b => {
          b.classList.remove('selected');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('selected');
        btn.setAttribute('aria-pressed', 'true');
        this.selectedColour = btn.dataset.colour;

        const lbl = this.element.querySelector('.pg-selected-label[data-for="colour"]');
        if (lbl) lbl.textContent = `— ${this.selectedColour}`;

        this.updatePrice();
      });
    });

    // Checkout button
    const addBtn = this.element.querySelector('.add-to-cart-btn');
    if (addBtn) {
      addBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.handleCheckout(e);
      });
    }
  }

  // ─── Update Price When Variant Found ─────────────────────────────────────
  updatePrice() {
    const variant = this.findMatchingVariant();
    if (!variant) return;

    const priceEl = this.element.querySelector('.pg-product-price, .price-row strong, .price');
    if (priceEl && variant.price) {
      priceEl.textContent = variant.price;
    }

    if (variant.image) {
      const imgEl = this.element.querySelector('.pg-product-image img, .product-image-wrap img');
      if (imgEl) imgEl.src = variant.image;
    }
  }

  // ─── Find Best Matching Variant ───────────────────────────────────────────
  findMatchingVariant() {
    if (this.variants.length === 0) return null;
    if (this.variants.length === 1) return this.variants[0];

    const size = (this.selectedSize || '').toLowerCase().trim();
    const colour = (this.selectedColour || '').toLowerCase().trim();

    if (!size && !colour) return null;

    // Score each variant: exact word match in title
    let best = null;
    let bestScore = -1;

    this.variants.forEach(v => {
      if (!v || !v.title) return;
      const parts = v.title.split('/').map(p => p.trim().toLowerCase());
      let score = 0;

      if (size) {
        const sizeMatch = parts.some(p => p === size);
        const sizePartial = parts.some(p => p.includes(size) || size.includes(p));
        if (sizeMatch) score += 2;
        else if (sizePartial) score += 1;
      }

      if (colour) {
        const colourMatch = parts.some(p => p === colour);
        const colourPartial = parts.some(p => p.includes(colour) || colour.includes(p));
        if (colourMatch) score += 2;
        else if (colourPartial) score += 1;
      }

      if (score > bestScore) {
        bestScore = score;
        best = v;
      }
    });

    return bestScore > 0 ? best : null;
  }

  // ─── Checkout Handler ─────────────────────────────────────────────────────
  async handleCheckout(e) {
    const btn = e.target.closest('button');
    const sizes = this.getAvailableSizes();
    const colours = this.getAvailableColours();

    // Validate size selection
    if (sizes.length > 0 && !this.selectedSize) {
      this.highlightMissing('size');
      this.showError('👆 Please select a size first');
      return;
    }

    // Validate colour selection (only if multiple colours)
    if (colours.length > 1 && !this.selectedColour) {
      this.highlightMissing('colour');
      this.showError('👆 Please select a colour first');
      return;
    }

    const variant = this.findMatchingVariant();

    if (!variant) {
      this.showError('⚠️ This size/colour combination is not available. Please try a different option.');
      return;
    }

    btn.disabled = true;
    const originalText = btn.textContent;
    btn.textContent = '⏳ Redirecting to secure checkout...';
    btn.style.opacity = '0.8';

    try {
      const params = new URLSearchParams({
        printify_product_id: this.productId,
        variant_id: variant.id
      });

      const response = await fetch(`/.netlify/functions/create-checkout-session?${params}`);
      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const data = await response.json();
      if (!data.success || !data.url) throw new Error('No checkout URL returned');

      window.location.href = data.url;
    } catch (error) {
      console.error('Checkout error:', error);
      this.showError(`❌ Checkout failed: ${error.message}. Please try again.`);
      btn.disabled = false;
      btn.textContent = originalText;
      btn.style.opacity = '';
    }
  }

  highlightMissing(type) {
    const selector = type === 'size' ? '.pg-size-buttons' : '.pg-colour-buttons';
    const container = this.element.querySelector(selector);
    if (!container) return;
    container.classList.add('pg-missing-selection');
    setTimeout(() => container.classList.remove('pg-missing-selection'), 1500);
  }

  showError(message) {
    // Remove any existing error
    const existing = this.element.querySelector('.pg-inline-error');
    if (existing) existing.remove();

    const banner = document.createElement('div');
    banner.className = 'pg-inline-error';
    banner.textContent = message;

    const actions = this.element.querySelector('.pg-product-actions');
    if (actions) {
      actions.parentNode.insertBefore(banner, actions);
    } else {
      this.element.appendChild(banner);
    }

    setTimeout(() => banner.remove(), 4000);
  }
}

// ─── Auto-initialise on DOM ready ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-product-id][data-variants]').forEach(el => {
    new PhatGorrillaProduct(el);
  });
});

window.PhatGorrillaProduct = PhatGorrillaProduct;
