const storeSettings = {
    locale: "en-GB",
    market: "United Kingdom",
    currency: "GBP",
    currencySymbol: "£",
    deliveryNote: "UK-facing store. Final delivery options and cost are shown at checkout.",
    returnsNote: "30-day return support for defects or order issues, handled through the fulfilment partner.",
    appBonus: "Free companion app access included with every store order."
};

const products = [
    {
        name: "Argentina Phat Gorrilla Graphic Tee",
        collection: "Argentina Drop",
        price: "£24.99",
        currency: "GBP",
        country: "Argentina",
        category: "Graphic tee",
        description: "Vintage soccer-inspired graphic tee with front, back, and sleeve artwork. Heavyweight streetwear energy with free companion app access included.",
        fabric: "100% cotton medium-weight fabric, approx. 180 g/m².",
        printAreas: ["Front graphic", "Back graphic", "Sleeve emblem", "Inner neck label"],
        colours: ["White"],
        sizes: ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"],
        care: ["Machine wash cold", "Tumble dry low", "Do not iron print", "Do not dry clean"],
        fulfilment: "Print-on-demand fulfilment through Printify.",
        image: "Phat Gorrilla _ Local-first command power_files/product-argentina-front.jpg",
        gallery: [
            "Phat Gorrilla _ Local-first command power_files/product-argentina-front.jpg",
            "Phat Gorrilla _ Local-first command power_files/product-argentina-back.jpg",
            "Phat Gorrilla _ Local-first command power_files/product-argentina-front-model.jpg",
            "Phat Gorrilla _ Local-first command power_files/product-argentina-back-model.jpg"
        ],
        checkout: "/.netlify/functions/create-checkout-session?key=argentina-phat-gorrilla-world-cup-tee-gildan-5000-11956"
    }
];

document.addEventListener("DOMContentLoaded", () => {
    const storeContainer = document.getElementById("phat-gorrilla-store");
    if (!storeContainer) return;

    const intro = document.createElement("section");
    intro.className = "pg-store-intro";
    intro.innerHTML = `
        <div>
            <p class="pg-kicker">${storeSettings.market} Store</p>
            <h2>Products Priced In ${storeSettings.currency}</h2>
            <p>${storeSettings.deliveryNote} ${storeSettings.appBonus}</p>
        </div>
    `;
    storeContainer.appendChild(intro);

    const grid = document.createElement("div");
    grid.className = "pg-product-grid";

    products.forEach((product) => {
        const card = document.createElement("article");
        card.className = "pg-card";
        const gallery = product.gallery || [product.image];
        card.innerHTML = `
            <div class="pg-image-box">
                <img src="${product.image}" alt="${product.name}">
                <span class="pg-badge">${product.collection}</span>
            </div>
            <div class="pg-thumbs" aria-label="${product.name} mockups">
                ${gallery.map((src, index) => `
                    <img src="${src}" alt="${product.name} mockup ${index + 1}">
                `).join("")}
            </div>
            <div class="pg-info">
                <h3 class="pg-title">${product.name}</h3>
                <div class="pg-line">
                    <p class="pg-price">${product.price}</p>
                    <p class="pg-tax">${product.currency || storeSettings.currency}</p>
                </div>
                <p class="pg-desc">${product.description}</p>
                <dl class="pg-specs">
                    <div><dt>Colours</dt><dd>${product.colours.join(", ")}</dd></div>
                    <div><dt>Sizes</dt><dd>${product.sizes.join(" / ")}</dd></div>
                    <div><dt>Print</dt><dd>${product.printAreas.join(", ")}</dd></div>
                    <div><dt>Fabric</dt><dd>${product.fabric}</dd></div>
                </dl>
                <details class="pg-details">
                    <summary>Care, delivery and access</summary>
                    <ul>
                        ${product.care.map((item) => `<li>${item}</li>`).join("")}
                        <li>${storeSettings.deliveryNote}</li>
                        <li>${storeSettings.returnsNote}</li>
                        <li>${storeSettings.appBonus}</li>
                    </ul>
                </details>
                <a href="${product.checkout}" target="_blank" rel="noopener" class="pg-buy-btn">Secure GBP Checkout</a>
            </div>
        `;
        grid.appendChild(card);
    });

    storeContainer.appendChild(grid);

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        itemListElement: products.map((product, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
                "@type": "Product",
                name: product.name,
                image: product.image,
                description: product.description,
                brand: { "@type": "Brand", name: "Phat Gorrilla" },
                offers: {
                    "@type": "Offer",
                    priceCurrency: product.currency || "GBP",
                    price: product.price.replace(/[^\d.]/g, ""),
                    url: product.checkout,
                    availability: "https://schema.org/InStock"
                },
                size: product.sizes,
                color: product.colours
            }
        }))
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
});
