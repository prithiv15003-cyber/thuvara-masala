
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
