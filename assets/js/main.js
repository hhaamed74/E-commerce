// ================================
// General Utility Functions
// ================================

// Toast notification function
function showToast(message, duration = 3000) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.classList.add("toast");
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, duration);
}

// Generate star rating HTML (for multiple pages)
function getStarsHTML(rating) {
  let fullStars = Math.floor(rating);
  let halfStar = rating % 1 >= 0.5 ? 1 : 0;
  let emptyStars = 5 - fullStars - halfStar;

  let starsHTML = "";
  for (let i = 0; i < fullStars; i++) starsHTML += `<i class="fa fa-star"></i>`;
  if (halfStar) starsHTML += `<i class="fa fa-star-half-alt"></i>`;
  for (let i = 0; i < emptyStars; i++)
    starsHTML += `<i class="fa fa-star-o"></i>`;

  return starsHTML;
}

// ================================
// Cart Management
// ================================

// Global cart variable
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Update cart count in header
function updateCartCount() {
  const cartCountElem = document.getElementById("cart-count");
  if (!cartCountElem) return;
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountElem.textContent = totalQuantity;
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Add or update product in cart
function addToCart(productId, quantity) {
  const productInCart = cart.find((item) => item.id == productId);
  if (productInCart) {
    productInCart.quantity += quantity;
  } else {
    cart.push({ id: productId, quantity: quantity });
  }
  saveCart();
  updateCartCount();
}

// ================================
// Header & Navigation Management
// ================================

// Update header links depending on login status
function updateHeaderLinks() {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const nav = document.querySelector(".nav ul");
  if (!nav) return;

  nav.innerHTML = ""; // Clear old links

  if (loggedInUser) {
    nav.innerHTML = `
      <li><a href="index.html" class="active">الرئيسية</a></li>
      <li><a href="products.html">المنتجات</a></li>
      <li><a href="favorites.html">المفضلة</a></li>
      <li><a href="/orders.html">سجل الطلبات</a></li>
      <li>
        <a href="cart.html">
          <i class="fa fa-shopping-cart"></i> سلة التسوق
          <span id="cart-count" class="cart-count">0</span>
        </a>
      </li>
      <li class="dropdown">
        <a href="#" class="dropbtn">${loggedInUser.username} <i class="fa fa-caret-down"></i></a>
        <div class="dropdown-content">
          <a href="#" id="logout-link">تسجيل خروج</a>
        </div>
      </li>
    `;

    // Logout functionality
    document.getElementById("logout-link").addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("loggedInUser");
      showToast("تم تسجيل الخروج");
      updateHeaderLinks();
      updateCartCount();
    });
  } else {
    nav.innerHTML = `
      <li><a href="index.html" class="active">الرئيسية</a></li>
      <li><a href="products.html">المنتجات</a></li>
      <li>
        <a href="cart.html">
          <i class="fa fa-shopping-cart"></i> سلة التسوق
          <span id="cart-count" class="cart-count">0</span>
        </a>
      </li>
      <li><a href="login.html">دخول</a></li>
      <li><a href="register.html">إنشاء حساب</a></li>
    `;
  }
}

// ================================
// Responsive Menu & Dropdown
// ================================

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    nav.classList.toggle("active");
  });
}

// Mobile dropdown handling
document.addEventListener("click", (e) => {
  if (e.target.closest(".dropbtn")) {
    e.preventDefault();
    const dropdown = e.target.closest(".dropdown");
    dropdown.classList.toggle("active");
  } else {
    document
      .querySelectorAll(".dropdown.active")
      .forEach((dd) => dd.classList.remove("active"));
  }
});

// ================================
// Initialize on page load
// ================================

window.addEventListener("DOMContentLoaded", () => {
  updateHeaderLinks();
  updateCartCount();
});
