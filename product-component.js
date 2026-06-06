/**
 * PHAT GORRILLA PRODUCT COMPONENT
 * Shared variant selection system for all product pages
 * Integrates: Printify → Stripe Checkout
 */

class PhatGorrillaProduct {
  constructor(productElement) {
    this.element = productElement;
    this.productId = this.element.dataset.productId;
    this.variants = JSON.parse(this.element.dataset.variants || '[]');
    this.selections = {};
    
    this.init();
  }

  init() {
    this.attachListeners();
  }

  attachListeners() {
    // Size selector
    const sizeSelect = this.element.querySelector('.variant-size');
    if (sizeSelect) {
      sizeSelect.addEventListener('change', (e) => {
        this.selections.size = e.target.value;
      });
    }

    // Color selector
    const colorSelect = this.element.querySelector('.variant-color');
    if (colorSelect) {
      colorSelect.addEventListener('change', (e) => {
        this.selections.color = e.target.value;
      });
    }

    // Add to cart button
    const addBtn = this.element.querySelector('.add-to-cart-btn');
    if (addBtn) {
      addBtn.addEventListener('click', (e) => this.handleCheckout(e));
    }
  }

  findMatchingVariant() {
    const { size, color } = this.selections;

    // Single variant - just use it
    if (this.variants.length === 1) {
      return this.variants[0];
    }

    // Multiple variants - find match
    let matched = null;
    if (size || color) {
      matched = this.variants.find(v => {
        if (!v || !v.title || v.price <= 0) return false;
        const title = v.title.toLowerCase();
        const matchSize = !size || title.includes(size.toLowerCase());
        const matchColor = !color || title.includes(color.toLowerCase());
        return matchSize && matchColor;
      });
    }

    // Fallback to first available
    return matched || this.variants.find(v => v && v.price > 0);
  }

  async handleCheckout(e) {
    const btn = e.target;
    const variant = this.findMatchingVariant();

    if (!variant) {
      this.showError('Please select valid options');
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Processing...';

    try {
      const params = new URLSearchParams({
        printify_product_id: this.productId,
        variant_id: variant.id
      });

      const response = await fetch(`/.netlify/functions/create-checkout-session?${params}`);
      if (!response.ok) throw new Error('Checkout failed');

      const { sessionId } = await response.json();
      if (!sessionId) throw new Error('No session');

      // Redirect to Stripe
      window.location.href = `https://checkout.stripe.com/pay/${sessionId}`;
    } catch (error) {
      console.error('Checkout error:', error);
      this.showError(`Error: ${error.message}`);
      btn.disabled = false;
      btn.textContent = 'Add to Cart';
    }
  }

  showError(message) {
    const banner = document.createElement('div');
    banner.className = 'error-banner';
    banner.textContent = message;
    banner.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(255, 68, 68, 0.15);
      border: 1px solid #ff4444;
      color: #ff9999;
      padding: 16px;
      border-radius: 4px;
      z-index: 1000;
      max-width: 400px;
    `;
    document.body.appendChild(banner);
    setTimeout(() => banner.remove(), 4000);
  }
}

// Auto-initialize all products on page load
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-product-id][data-variants]').forEach(el => {
    new PhatGorrillaProduct(el);
  });
});

// Export for manual use
window.PhatGorrillaProduct = PhatGorrillaProduct;
