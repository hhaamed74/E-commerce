// Load cart from localStorage (if it exists)
// let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartItemsContainer = document.getElementById("cart-items"); // Container for cart items
const cartSummary = document.getElementById("cart-summary"); // Container for total price
const clearCartBtn = document.getElementById("clear-cart"); // Button to clear all cart items

const toast = document.getElementById("toast"); // Simple toast message element
const toastConfirm = document.getElementById("toast-confirm"); // Confirmation toast for clearing cart
const confirmYesBtn = document.getElementById("confirm-yes"); // "Yes" button in confirmation toast
const confirmNoBtn = document.getElementById("confirm-no"); // "No" button in confirmation toast

// ✅ Show a normal toast message
function showToast(message, duration = 3000) {
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, duration);
}

// ✅ Display cart items dynamically
function displayCart() {
  cartItemsContainer.innerHTML = "";

  const checkoutBtn = document.querySelector(".checkout-btn"); // Checkout button

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<p class="cart__empty">سلة التسوق فارغة.</p>`;
    cartSummary.textContent = "";
    clearCartBtn.style.display = "none";

    if (checkoutBtn) checkoutBtn.style.display = "none"; // Hide checkout button if cart is empty

    updateCartCount();
    return;
  }

  clearCartBtn.style.display = "inline-block";
  if (checkoutBtn) checkoutBtn.style.display = "inline-block"; // Show checkout button if cart has items

  cart.forEach((item) => {
    const product = products.find((p) => p.id === item.id);
    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");

    cartItem.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <div class="cart-item-info">
        <h4>${product.name}</h4>
        <div class="price">${product.price} جنيه</div>
      </div>
      <div class="cart-item-actions">
        <input type="number" min="1" value="${item.quantity}" data-id="${item.id}" />
        <button class="remove-item" data-id="${item.id}">حذف</button>
      </div>
    `;

    cartItemsContainer.appendChild(cartItem);
  });

  updateCartSummary();
  updateCartCount();
}

// ✅ Update total price summary
function updateCartSummary() {
  const total = cart.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.id);
    return sum + product.price * item.quantity;
  }, 0);

  cartSummary.textContent = `المجموع: ${total} جنيه`;
}

// ✅ Update cart item count in header
function updateCartCount() {
  const cartCountElem = document.getElementById("cart-count");
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountElem.textContent = totalQuantity;
}

// ✅ Update quantity when input changes
cartItemsContainer.addEventListener("change", (e) => {
  if (e.target.tagName === "INPUT" && e.target.type === "number") {
    const id = parseInt(e.target.getAttribute("data-id"));
    let newQty = parseInt(e.target.value);
    if (isNaN(newQty) || newQty < 1) newQty = 1;

    const item = cart.find((i) => i.id === id);
    if (item) {
      item.quantity = newQty;
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartSummary();
      updateCartCount();
    }
  }
});

// ✅ Remove a single item from cart
cartItemsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-item")) {
    const id = parseInt(e.target.getAttribute("data-id"));
    cart = cart.filter((item) => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
    showToast("تم حذف المنتج من السلة.");
  }
});

// ✅ Clear entire cart (show confirmation toast instead of default confirm)
clearCartBtn.addEventListener("click", () => {
  toastConfirm.classList.remove("hidden");
});

// ✅ "Yes" clicked in confirmation toast
confirmYesBtn.addEventListener("click", () => {
  cart = [];
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
  toastConfirm.classList.add("hidden");
  showToast("تم مسح جميع المنتجات من السلة.");
});

// ✅ "No" clicked in confirmation toast
confirmNoBtn.addEventListener("click", () => {
  toastConfirm.classList.add("hidden");
});

// ✅ Initial load
window.addEventListener("DOMContentLoaded", () => {
  displayCart();
});
