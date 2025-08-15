const productsGrid = document.getElementById("favorites-grid");
// Get favorites from localStorage or initialize as empty array
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// Function to generate star rating HTML
function getStarsHTML(rating) {
  if (rating === undefined || rating === null) return "☆☆☆☆☆";
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;
  return "★".repeat(fullStars) + (halfStar ? "⯪" : "") + "☆".repeat(emptyStars);
}

// Function to display favorite products
function displayFavorites() {
  if (!productsGrid) return;
  productsGrid.innerHTML = "";

  // Filter products that are in favorites
  const favoriteProducts = products.filter((p) => favorites.includes(p.id));

  // Show message if no favorite products
  if (favoriteProducts.length === 0) {
    productsGrid.innerHTML = `<div class="text__center"><p >لا يوجد منتجات في المفضلة.</p></div>`;
    return;
  }

  // Loop through each favorite product and create card
  favoriteProducts.forEach((product) => {
    const cartItem = cart.find((item) => item.id === product.id);
    const quantity = cartItem ? cartItem.quantity : 1;

    const productCard = document.createElement("div");
    productCard.classList.add("product-card");

    productCard.innerHTML = `
      <div class="product-image-wrapper">
        <img src="${product.image}" alt="${product.name}" loading="lazy"/>
        <button class="favorite-btn active" data-id="${
          product.id
        }" title="إزالة من المفضلة">
          <i class="fa fa-heart"></i>
        </button>
      </div>
      <div class="product-info">
        <h3><a href="/product.html?id=${product.id}">${product.name}</a></h3>
        <div class="rating">${getStarsHTML(product.rating)}</div>
        <p>${product.description}</p>
        <div class="price">${product.price} جنيه</div>

        <div class="product-actions">
          <button class="qty-btn" data-id="${
            product.id
          }" data-action="decrease">-</button>
          <input type="text" readonly class="quantity" value="${quantity}" />
          <button class="qty-btn" data-id="${
            product.id
          }" data-action="increase">+</button>
          <button class="add-cart-btn" data-id="${
            product.id
          }">أضف إلى السلة</button>
        </div>
      </div>
    `;

    productsGrid.appendChild(productCard);
  });
}

// Event listener for favorite buttons, add-to-cart, and quantity buttons
if (productsGrid) {
  productsGrid.addEventListener("click", (e) => {
    const target = e.target;

    // Remove from favorites
    if (
      target.classList.contains("favorite-btn") ||
      target.closest(".favorite-btn")
    ) {
      const btn = target.classList.contains("favorite-btn")
        ? target
        : target.closest(".favorite-btn");
      const id = parseInt(btn.getAttribute("data-id"));
      favorites = favorites.filter((favId) => favId !== id); // Remove from favorites array
      saveFavorites(); // Save updated favorites to localStorage
      displayFavorites(); // Refresh displayed favorites
      return;
    }

    // Add to cart
    if (target.classList.contains("add-cart-btn")) {
      const id = parseInt(target.getAttribute("data-id"));
      addToCart(id, 1); // Call external function to add item to cart
      showToast("تم إضافة المنتج إلى السلة!"); // Show toast message
      updateCartCount(); // Update cart count in header
      return;
    }

    // Increase or decrease quantity
    if (target.classList.contains("qty-btn")) {
      const id = parseInt(target.getAttribute("data-id"));
      const action = target.getAttribute("data-action");

      const cartItem = cart.find((item) => item.id === id);
      if (!cartItem) {
        cart.push({ id, quantity: 1 });
        saveCart();
        updateCartCount();
        displayFavorites();
        return;
      }

      if (action === "increase") cartItem.quantity++;
      else if (action === "decrease") {
        cartItem.quantity--;
        if (cartItem.quantity < 1) cart = cart.filter((item) => item.id !== id);
      }

      saveCart();
      updateCartCount();
      displayFavorites();
    }
  });
}

// Function to save favorites to localStorage
function saveFavorites() {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

// Load favorites on page load
window.addEventListener("DOMContentLoaded", () => {
  displayFavorites();
});
