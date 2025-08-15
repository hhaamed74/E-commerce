// Get the products grid container (featured or main products)
const productsGrid =
  document.getElementById("featured-products") ||
  document.getElementById("products-grid");
const searchInput = document.getElementById("search-input");
const sortSelect = document.getElementById("sort-select");

// Favorites data from localStorage
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// Function to generate stars HTML (supports decimal ratings)
function getStarsHTML(rating) {
  if (rating === undefined || rating === null) return "☆☆☆☆☆";

  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  return "★".repeat(fullStars) + (halfStar ? "⯪" : "") + "☆".repeat(emptyStars);
}

// Function to display products in the grid
function displayProducts(list, showDetails = false) {
  if (!productsGrid) return;
  productsGrid.innerHTML = "";

  if (list.length === 0) {
    productsGrid.innerHTML = "<p>لا يوجد منتجات مطابقة.</p>";
    return;
  }

  list.forEach((product) => {
    const isFavorite = favorites.includes(product.id);
    const cartItem = cart.find((item) => item.id === product.id);
    const quantity = cartItem ? cartItem.quantity : 1;

    const productCard = document.createElement("div");
    productCard.classList.add("product-card");

    productCard.innerHTML = `
      <div class="product-image-wrapper">
        <img src="${product.image}" alt="${product.name}" loading="lazy"/>
        <button class="favorite-btn ${isFavorite ? "active" : ""}" data-id="${
      product.id
    }">
          <i class="fa fa-heart"></i>
        </button>
      </div>
      <div class="product-info">
        <h3><a href="/product.html?id=${product.id}">${product.name}</a></h3>
        <div class="rating">${getStarsHTML(product.rating)}</div>
        <p>${product.description}</p>
        <div class="price">${product.price} جنيه</div>
        ${
          showDetails
            ? `
               <div class="category">الفئة: ${product.category}</div>
               <div>المخزون: ${product.stock} قطعة</div>`
            : ""
        }
        <div class="product-actions">
          <button class="qty-btn" data-id="${
            product.id
          }" data-action="decrease">-</button>
          <input type="text" readonly class="quantity" value="${quantity}" />
          <button class="qty-btn" data-id="${
            product.id
          }" data-action="increase">+</button>
          <button class="btn btn-primary add-cart-btn" data-id="${
            product.id
          }">أضف إلى السلة</button>
        </div>
      </div>
    `;

    productsGrid.appendChild(productCard);
  });
}

// Save favorites to localStorage
function saveFavorites() {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

// Event delegation for product interactions
if (productsGrid) {
  productsGrid.addEventListener("click", (e) => {
    const target = e.target;

    // Add to cart
    if (target.classList.contains("add-cart-btn")) {
      const id = parseInt(target.getAttribute("data-id"));
      addToCart(id, 1);
      showToast("تم إضافة المنتج إلى السلة!");
      updateCartCount();
      return;
    }

    // Toggle favorite
    if (
      target.classList.contains("favorite-btn") ||
      target.closest(".favorite-btn")
    ) {
      const btn = target.classList.contains("favorite-btn")
        ? target
        : target.closest(".favorite-btn");
      const id = parseInt(btn.getAttribute("data-id"));

      if (favorites.includes(id)) {
        favorites = favorites.filter((favId) => favId !== id);
        btn.classList.remove("active");
      } else {
        favorites.push(id);
        btn.classList.add("active");
      }
      saveFavorites();
      return;
    }

    // Increase / Decrease quantity
    if (target.classList.contains("qty-btn")) {
      const id = parseInt(target.getAttribute("data-id"));
      const action = target.getAttribute("data-action");

      const cartItem = cart.find((item) => item.id === id);
      if (!cartItem) {
        cart.push({ id, quantity: 1 });
        saveCart();
        updateCartCount();
        displayProducts(
          products,
          window.location.pathname.includes("products.html")
        );
        return;
      }

      if (action === "increase") {
        cartItem.quantity++;
      } else if (action === "decrease") {
        cartItem.quantity--;
        if (cartItem.quantity < 1) {
          cart = cart.filter((item) => item.id !== id);
        }
      }

      saveCart();
      updateCartCount();
      displayProducts(
        products,
        window.location.pathname.includes("products.html")
      );
    }
  });
}

// Search functionality
if (searchInput) {
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();
    let filtered = products.filter((p) => p.name.toLowerCase().includes(query));
    displayProducts(
      filtered,
      window.location.pathname.includes("products.html")
    );
  });
}

// Sorting functionality
if (sortSelect) {
  sortSelect.addEventListener("change", () => {
    let sorted = [...products];
    switch (sortSelect.value) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "rating-desc":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
    }
    displayProducts(sorted, window.location.pathname.includes("products.html"));
  });
}

// Load products when DOM is fully loaded
window.addEventListener("DOMContentLoaded", () => {
  if (productsGrid) {
    if (window.location.pathname.includes("products.html")) {
      // Products page → show all products with details
      displayProducts(products, true);
    } else {
      // Homepage → show first 8 products only without details
      displayProducts(products.slice(0, 8), false);
    }
    updateCartCount();
  }
});
