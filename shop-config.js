(function () {
  var config = {
    SHOP_URL: 'https://shop.phatgorrilla.com',
    SHOP_LIVE: false,
    FALLBACK_SHOP_PATH: '/shop.html',
    BRAND_SITE_URL: 'https://phatgorrilla.com',
    SUPPORT_EMAIL: 'support@phatgorrilla.com',
    SOCIALS: {
      instagram: 'https://www.instagram.com/phatgorrilla/',
      tiktok: 'https://www.tiktok.com/@phatgorrilla',
      facebook: 'https://www.facebook.com/profile.php?id=61590460628534'
    }
  };

  window.PHAT_GORRILLA_SHOP_CONFIG = config;

  function applyShopLinks() {
    var target = config.SHOP_LIVE ? config.SHOP_URL : config.FALLBACK_SHOP_PATH;
    document.querySelectorAll('[data-shop-link]').forEach(function (link) {
      link.setAttribute('href', target);
      if (config.SHOP_LIVE) {
        link.setAttribute('rel', 'noopener');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyShopLinks);
  } else {
    applyShopLinks();
  }
})();
