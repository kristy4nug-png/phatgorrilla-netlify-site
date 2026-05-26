const products = [
    {
        name: "Classic Roar Tee - Blue",
        collection: "Blue",
        price: "£24.99",
        description: "Heavyweight 180gsm ring-spun cotton. Cut for the street, built to last.",
        image: "https://placehold.co/600x600/111/FFF?text=Blue+Mockup", 
        checkout: "https://printify.me/placeholder-blue"
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const storeContainer = document.getElementById('phat-gorrilla-store');
    if (!storeContainer) return;

    const grid = document.createElement('div');
    grid.className = 'pg-product-grid';

    products.forEach(p => {
        grid.innerHTML += \
            <div class="pg-card">\
                <div class="pg-image-box">\
                    <img src="\ + p.image + \" alt="\ + p.name + \OutsideLink">\
                    <span class="pg-badge">\ + p.collection + \</span>\
                </div>\
                <div class="pg-info">\
                    <h3 class="pg-title">\ + p.name + \</h3>\
                    <p class="pg-price">\ + p.price + \</p>\
                    <p class="pg-desc">\ + p.description + \</p>\
                    <a href="\ + p.checkout + \" target="_blank" class="pg-buy-btn">Secure Checkout</a>\
                </div>\
            </div>\
        \;
    });
    
    storeContainer.appendChild(grid);
});
