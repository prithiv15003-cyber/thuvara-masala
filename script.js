
/* THUVARA MASALA — LIMITED-TIME 10% OFFER */

const WHATSAPP_NUMBER = "919751794018";

// Change this date to your actual offer end date.
// This example ends on 30 November 2026, India time.
const OFFER_END_DATE = "2026-11-30T23:59:59+05:30";

const products = {
  chilli: {
    name: "மிளகாய்த்தூள் (Chilli Powder)",
    prices: { 250: 90, 500: 180, 750: 270, 1000: 360 }
  },
  turmeric: {
    name: "மஞ்சள்தூள் (Turmeric Powder)",
    prices: { 250: 65, 500: 140, 750: 205, 1000: 270 }
  },
  coriander: {
    name: "மல்லித்தூள் (Coriander Powder)",
    prices: { 250: 60, 500: 120, 750: 180, 1000: 240 }
  }
};

const OFFER_ACTIVE = Date.now() <= new Date(OFFER_END_DATE).getTime();

function formatWeight(grams) {
  return grams === 1000 ? "1 kg" : `${grams} g`;
}

function getPriceText(price) {
  return Number.isInteger(price) ? `₹${price}` : `₹${price.toFixed(2)}`;
}

function updateProduct(productKey) {
  const product = products[productKey];
  const select = document.getElementById(`weight-${productKey}`);

  if (!product || !select) return;

  const weight = Number(select.value);
  const originalPrice = product.prices[weight];

  if (originalPrice === undefined) return;

  const discountPrice = Math.round(originalPrice * 0.90 * 100) / 100;
  const finalPrice = OFFER_ACTIVE ? discountPrice : originalPrice;

  const card = select.closest(".product-card");
  if (!card) return;

  const priceElement = card.querySelector(".product-price");
  const orderButton = card.querySelector(".product-order-button");

  if (priceElement) {
    priceElement.textContent = getPriceText(finalPrice);
  }

  // Add or update the original price display.
  let originalElement = card.querySelector(".product-original-price");

  if (!originalElement && priceElement) {
    originalElement = document.createElement("span");
    originalElement.className = "product-original-price";
    priceElement.insertAdjacentElement("beforebegin", originalElement);
  }

  if (originalElement) {
    originalElement.textContent = getPriceText(originalPrice);
    originalElement.hidden = !OFFER_ACTIVE;
  }

  // Add a 10% OFF badge to each product image.
  const imageWrap = card.querySelector(".product-image-wrap") || card;

  let badge = imageWrap.querySelector(".offer-badge");

  if (OFFER_ACTIVE && !badge) {
    badge = document.createElement("span");
    badge.className = "offer-badge";
    badge.textContent = "10% OFF";
    imageWrap.appendChild(badge);
  } else if (!OFFER_ACTIVE && badge) {
    badge.remove();
  }

  // Update the WhatsApp order message with the correct price.
  if (orderButton) {
    const message = OFFER_ACTIVE
      ? `வணக்கம்! ${product.name} வேண்டும்.\n` +
        `Weight: ${formatWeight(weight)}\n` +
        `Original Price: ${getPriceText(originalPrice)}\n` +
        `10% Offer Discount: ${getPriceText(originalPrice - discountPrice)}\n` +
        `Offer Price: ${getPriceText(finalPrice)}`
      : `வணக்கம்! ${product.name} வேண்டும்.\n` +
        `Weight: ${formatWeight(weight)}\n` +
        `Price: ${getPriceText(finalPrice)}`;

    orderButton.href =
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Show a limited-time offer announcement near the products heading.
  const heading = document.querySelector(".section-heading");

  if (OFFER_ACTIVE && heading && !document.querySelector(".offer-announcement")) {
    const announcement = document.createElement("p");
    announcement.className = "offer-announcement";
    announcement.textContent =
      "Limited-Time Offer: Get 10% OFF on all three products!";
    heading.appendChild(announcement);
  }

  Object.keys(products).forEach((key) => {
    const select = document.getElementById(`weight-${key}`);

    if (select) {
      select.addEventListener("change", () => updateProduct(key));
      updateProduct(key);
    }
  });
});

/* MULTI-PRODUCT CART — THUVARA MASALA */

(() => {
  const cart = [];

  const money = (amount) =>
    "₹" + amount.toLocaleString("en-IN", {
      minimumFractionDigits: amount % 1 ? 2 : 0,
      maximumFractionDigits: 2
    });

  function currentPrice(key, grams) {
    const original = products[key].prices[grams];
    return OFFER_ACTIVE
      ? Math.round(original * 0.90 * 100) / 100
      : original;
  }

  function setupCart() {
    const productSection =
      document.querySelector(".products-section") ||
      document.querySelector("#products");

    if (!productSection || document.getElementById("shopping-cart")) return;

    const cartSection = document.createElement("section");
    cartSection.id = "shopping-cart";
    cartSection.className = "shopping-cart";

    cartSection.innerHTML = `
      <div class="section-heading">
        <p class="section-subtitle">YOUR ORDER</p>
        <h2>Your Shopping Cart</h2>
        <p>Add multiple products and send one combined order on WhatsApp.</p>
      </div>
      <div id="cart-items" aria-live="polite">
        <p>Your cart is empty. Select a product and click Add to Cart.</p>
      </div>
      <div id="cart-summary" hidden>
        <p id="cart-discount"></p>
        <h3>Total: <span id="cart-total">₹0</span></h3>
        
<div class="customer-order-details">
  <h3>Customer Details</h3>

  <label for="customer-name">Your Name *</label>
  <input
    type="text"
    id="customer-name"
    placeholder="Enter your name"
    autocomplete="name"
    required
  />

  <label for="customer-area">Area / Locality</label>
  <input
    type="text"
    id="customer-area"
    placeholder="e.g. Orathanadu, Thanjavur"
    autocomplete="address-level3"
  />

  <label for="order-method">Order Preference *</label>
  <select id="order-method" required>
    <option value="Delivery">Home Delivery</option>
    <option value="Pickup">Mill Pickup</option>
  </select>

  <p class="order-details-note">
    Home delivery availability will be confirmed on WhatsApp.
  </p>
</div>

        <button type="button" id="checkout-whatsapp" class="product-order-button">
          Order All on WhatsApp
        </button>
        <button type="button" id="clear-cart" class="cart-clear-button">
          Clear Cart
        </button>
      </div>
    `;

    productSection.insertAdjacentElement("afterend", cartSection);

    document.querySelectorAll(".product-card").forEach((card) => {
      const select = card.querySelector(".weight-select");
      if (!select) return;

      const productKey = select.id.replace("weight-", "");
      if (!products[productKey]) return;

      const addButton = document.createElement("button");
      addButton.type = "button";
      addButton.className = "cart-add-button";
      addButton.textContent = "Add to Cart";

      const orderButton = card.querySelector(".product-order-button");
      if (orderButton) {
        orderButton.insertAdjacentElement("beforebegin", addButton);
      } else {
        card.querySelector(".product-info")?.appendChild(addButton);
      }

      addButton.addEventListener("click", () => {
        const grams = Number(select.value);
        const existing = cart.find(
          (item) => item.key === productKey && item.grams === grams
        );

        if (existing) {
          existing.quantity += 1;
        } else {
          cart.push({ key: productKey, grams, quantity: 1 });
        }

        renderCart();

        cartSection.scrollIntoView({
          behavior: "smooth",
          block: "nearest"
        });
      });
    });

    document.getElementById("checkout-whatsapp").addEventListener(
      "click",
      checkout
    );

    document.getElementById("clear-cart").addEventListener("click", () => {
      cart.length = 0;
      renderCart();
    });

    renderCart();
  }

  function renderCart() {
    const itemsContainer = document.getElementById("cart-items");
    const summary = document.getElementById("cart-summary");
    if (!itemsContainer || !summary) return;

    if (cart.length === 0) {
      itemsContainer.innerHTML =
        "<p>Your cart is empty. Select a product and click Add to Cart.</p>";
      summary.hidden = true;
      return;
    }

    summary.hidden = false;

    itemsContainer.innerHTML = cart.map((item, index) => {
      const product = products[item.key];
      const price = currentPrice(item.key, item.grams);

      return `
        <div class="cart-item">
          <div class="cart-item-info">
            <strong>${product.name}</strong>
            <span>${item.grams === 1000 ? "1 kg" : item.grams + " g"}</span>
            <span>${money(price)} each</span>
          </div>
          <div class="cart-item-actions">
            <button type="button" data-minus="${index}" aria-label="Decrease quantity">−</button>
            <span>${item.quantity}</span>
            <button type="button" data-plus="${index}" aria-label="Increase quantity">+</button>
            <button type="button" data-remove="${index}" aria-label="Remove item">Remove</button>
          </div>
          <strong>${money(price * item.quantity)}</strong>
        </div>
      `;
    }).join("");

    const originalTotal = cart.reduce(
      (sum, item) => sum + products[item.key].prices[item.grams] * item.quantity,
      0
    );

    const total = cart.reduce(
      (sum, item) => sum + currentPrice(item.key, item.grams) * item.quantity,
      0
    );

    document.getElementById("cart-total").textContent = money(total);

    document.getElementById("cart-discount").textContent = OFFER_ACTIVE
      ? `10% offer applied — You save ${money(originalTotal - total)}`
      : "Offer period has ended.";

    itemsContainer.querySelectorAll("[data-minus]").forEach((button) => {
      button.addEventListener("click", () => {
        const item = cart[Number(button.dataset.minus)];
        item.quantity -= 1;
        if (item.quantity <= 0) {
          cart.splice(Number(button.dataset.minus), 1);
        }
        renderCart();
      });
    });

    itemsContainer.querySelectorAll("[data-plus]").forEach((button) => {
      button.addEventListener("click", () => {
        cart[Number(button.dataset.plus)].quantity += 1;
        renderCart();
      });
    });

    itemsContainer.querySelectorAll("[data-remove]").forEach((button) => {
      button.addEventListener("click", () => {
        cart.splice(Number(button.dataset.remove), 1);
        renderCart();
      });
    });
  }


function checkout() {
  if (cart.length === 0) return;

  const customerName =
    document.getElementById("customer-name").value.trim();

  const customerArea =
    document.getElementById("customer-area").value.trim();

  const orderMethod =
    document.getElementById("order-method").value;

  if (!customerName) {
    alert("Please enter your name.");
    document.getElementById("customer-name").focus();
    return;
  }

  if (orderMethod === "Delivery" && !customerArea) {
    alert("Please enter your delivery area.");
    document.getElementById("customer-area").focus();
    return;
  }

  const lines = cart.map((item, index) => {
    const product = products[item.key];

    return `${index + 1}. ${product.name}\n` +
      `Weight: ${item.grams === 1000 ? "1 kg" : item.grams + " g"}\n` +
      `Quantity: ${item.quantity}`;
  });

  const message =
    "Vanakkam! Thuvara Masala order enquiry.\n\n" +
    `Customer Name: ${customerName}\n` +
    `Order Preference: ${orderMethod === "Pickup" ? "Mill Pickup" : "Home Delivery"}\n` +
    `Area / Locality: ${customerArea || "Not provided (pickup)"}\n\n` +
    "Order Details:\n" +
    lines.join("\n\n") +
    "\n\nPlease confirm availability and " +
    (orderMethod === "Pickup"
      ? "pickup details."
      : "delivery availability and charges.") +
    "\nThank you!";

  const url =
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank", "noopener,noreferrer");
}



  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupCart);
  } else {
    setupCart();
  }
})();
