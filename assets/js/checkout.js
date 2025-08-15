// ✅ Ensure cart exists (if already defined, don't redefine)
window.cart = window.cart || JSON.parse(localStorage.getItem("cart")) || [];

// Helper functions
const num = (v) =>
  typeof v === "number" ? v : parseFloat(String(v).replace(/[^\d.]/g, "")) || 0; // Convert value to number safely
const formatPrice = (n) => `${n.toFixed(2)} جنيه`; // Format price with 2 decimals

/** Calculate cart total */
function calcCartTotal() {
  return cart.reduce((sum, item) => {
    const p = products.find((x) => x.id === item.id);
    return p ? sum + num(p.price) * item.quantity : sum;
  }, 0);
}

/** Calculate shipping cost */
function getShippingCost() {
  const city = document.getElementById("city")?.value;
  const payment = document.getElementById("payment")?.value;
  if (payment === "cash") {
    if (city === "cairo" || city === "giza") return 50; // Local cities
    if (city && city !== "") return 100; // Other cities
  }
  return 0; // Online payment has no shipping cost
}

/** Update shipping cost and total display */
function updateShippingCost() {
  const shippingCost = getShippingCost();
  const shippingCostEl = document.getElementById("shippingCost");
  if (shippingCostEl) {
    shippingCostEl.textContent = shippingCost
      ? `💵 مصاريف الشحن: ${shippingCost} جنيه`
      : "";
  }
  const totalEl = document.getElementById("totalPrice");
  if (totalEl) {
    totalEl.textContent = formatPrice(calcCartTotal() + shippingCost);
  }
}

/** Render a single item in the checkout summary */
function renderOrderItem(product, quantity) {
  const lineTotal = num(product.price) * quantity;

  return `
<div class="order-item" data-id="${product.id}">
  <img src="${product.image}" alt="${product.name}" loading="lazy"/>
  <div class="item-info">
    <h4 class="product-name">${product.name}</h4>
    <div class="item-price">${formatPrice(lineTotal)}</div>
    <div class="item-controls">
      <button class="qty-btn" data-action="dec" aria-label="Decrease">-</button>
      <input class="qty" type="text" value="${quantity}" readonly />
      <button class="qty-btn" data-action="inc" aria-label="Increase">+</button>
      <button class="remove-item" aria-label="Remove">Remove</button>
    </div>
  </div>
</div>
`;
}

/** Main render function for checkout */
function renderCheckout() {
  const list = document.getElementById("orderItems");
  if (!list) return;

  if (!Array.isArray(cart) || cart.length === 0) {
    list.innerHTML = `<p class="cart__empty">سلة الشراء فارغة.</p>`;
    updateShippingCost();
    return;
  }

  const html = cart
    .map((ci) => {
      const p = products.find((x) => x.id === ci.id);
      if (!p) return ""; // Product missing
      return renderOrderItem(p, ci.quantity);
    })
    .join("");

  list.innerHTML = html;
  updateShippingCost();
}

/** Save cart to localStorage */
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

/** Show toast message */
function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 100);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

/** Handle + / - / Remove buttons */
function attachCheckoutHandlers() {
  const list = document.getElementById("orderItems");
  if (!list) return;

  list.addEventListener("click", (e) => {
    const itemRow = e.target.closest(".order-item");
    if (!itemRow) return;
    const id = parseInt(itemRow.getAttribute("data-id"));
    const cartItem = cart.find((x) => x.id === id);
    if (!cartItem) return;

    // Handle quantity buttons
    const qtyBtn = e.target.closest(".qty-btn");
    if (qtyBtn) {
      const action = qtyBtn.getAttribute("data-action");
      if (action === "inc") cartItem.quantity++;
      if (action === "dec")
        cartItem.quantity = Math.max(1, cartItem.quantity - 1);
      saveCart();
      renderCheckout();
      return;
    }

    // Handle remove item
    if (e.target.classList.contains("remove-item")) {
      cart = cart.filter((x) => x.id !== id);
      saveCart();
      renderCheckout();
      return;
    }
  });
}

/** Handle form submission */
function attachFormHandler() {
  const form = document.getElementById("checkoutForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Check if cart is empty
    if (!Array.isArray(cart) || cart.length === 0) {
      showToast("⚠️ يجب إضافة منتج قبل إتمام الطلب", "error");
      setTimeout(() => {
        window.location.href = "products.html";
      }, 2000);
      return;
    }

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const citySelect = document.getElementById("city");
    const paymentSelect = document.getElementById("payment");

    // Validate name (at least 3 words)
    const nameValue = nameInput.value
      .replace(/[\u200B-\u200F\u202A-\u202E]/g, "")
      .replace(/[\s\u00A0\u2000-\u200D]+/g, " ")
      .trim();
    if (nameValue.split(" ").filter((w) => w.length > 0).length < 3) {
      showToast("⚠️ يرجى إدخال اسم ثلاثي على الأقل", "error");
      nameInput.focus();
      return;
    }

    // Validate phone number (Egyptian)
    const digitsOnly = phoneInput.value.replace(/\D/g, "");
    if (!/^(010|011|012|015)\d{8}$/.test(digitsOnly)) {
      showToast(
        "⚠️ رقم الهاتف غير صحيح. يجب أن يكون 11 رقمًا ويبدأ بـ 010 أو 011 أو 012 أو 015",
        "error"
      );
      phoneInput.focus();
      return;
    }
    phoneInput.value = digitsOnly;

    // Validate email
    const emailValue = emailInput.value.trim();
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/.test(emailValue)) {
      showToast("⚠️ يرجى إدخال بريد إلكتروني صحيح", "error");
      emailInput.focus();
      return;
    }

    // Validate city and payment
    if (!citySelect.value) {
      showToast("⚠️ يرجى اختيار المحافظة", "error");
      citySelect.focus();
      return;
    }
    if (!paymentSelect.value) {
      showToast("⚠️ يرجى اختيار طريقة الدفع", "error");
      paymentSelect.focus();
      return;
    }

    const shippingCost = getShippingCost();
    const finalTotal = calcCartTotal() + shippingCost;

    // ✅ Save order before clearing cart
    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    const order = {
      date: new Date(),
      customer: {
        name: nameValue,
        email: emailValue,
        phone: digitsOnly,
        city: citySelect.value,
        payment: paymentSelect.value,
      },
      items: cart.map((ci) => {
        const product = products.find((p) => p.id === ci.id);
        return {
          id: ci.id,
          name: product?.name || "Unknown product",
          price: Number(product?.price) || 0,
          quantity: ci.quantity,
        };
      }),
      shippingCost,
      total: finalTotal,
    };
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));

    showToast(
      `✅ تم تأكيد الطلب بنجاح! الإجمالي: ${formatPrice(finalTotal)}`,
      "success"
    );

    cart = []; // Clear cart
    saveCart(); // Save empty cart
    form.reset(); // Reset form
    renderCheckout(); // Re-render checkout
  });
}

// DOMContentLoaded: initialize checkout
document.addEventListener("DOMContentLoaded", () => {
  renderCheckout();
  attachCheckoutHandlers();
  attachFormHandler();

  // Update shipping cost when city or payment changes
  document
    .getElementById("city")
    ?.addEventListener("change", updateShippingCost);
  document
    .getElementById("payment")
    ?.addEventListener("change", updateShippingCost);
});
