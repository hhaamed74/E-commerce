// Retrieve orders from localStorage
let orders = JSON.parse(localStorage.getItem("orders")) || [];
const container = document.getElementById("ordersContainer");

// Check if there are any saved orders
if (orders.length === 0) {
  container.innerHTML = `<p class="no-orders">لا توجد طلبات محفوظة حتى الآن.</p>`;
} else {
  // Loop through each order and display it
  orders.forEach((order, index) => {
    const orderEl = document.createElement("div");
    orderEl.className = "order-card";

    orderEl.innerHTML = `
      <div class="order-header">
        <strong class="order-number">📦 طلب رقم: ${index + 1}</strong>
        <button class="download-btn">⬇ تحميل JSON</button>
      </div>

      <div class="order-details">
        <p><strong>👤 الاسم:</strong> <span>${order.customer.name}</span></p>
        <p><strong>📧 البريد الإلكتروني:</strong> <span>${
          order.customer.email
        }</span></p>
        <p><strong>📱 الهاتف:</strong> <span>${order.customer.phone}</span></p>
        <p><strong>📍 المحافظة:</strong> <span>${order.customer.city}</span></p>
        <p><strong>💳 طريقة الدفع:</strong> <span>${
          order.customer.payment
        }</span></p>
        <p><strong>🚚 مصاريف الشحن:</strong> <span class="price">${
          order.shippingCost
        } جنيه</span></p>
        <p><strong>💰 الإجمالي:</strong> <span class="price">${order.total.toFixed(
          2
        )} جنيه</span></p>
        <p><strong>🗓 التاريخ:</strong> <span>${new Date(
          order.date
        ).toLocaleString()}</span></p>
      </div>

      <div class="order-items">
        <strong>🛍 المنتجات:</strong>
        ${order.items
          .map(
            (item) => `
          <div class="order-item">
            <span>${item.name}</span>
            <span class="price">${item.quantity} × ${item.price.toFixed(
              2
            )} جنيه</span>
          </div>
        `
          )
          .join("")}
      </div>
    `;

    // Download order as JSON
    const downloadBtn = orderEl.querySelector(".download-btn");
    downloadBtn.addEventListener("click", () => {
      const blob = new Blob([JSON.stringify(order, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `order-${index + 1}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });

    // Append order card to container
    container.appendChild(orderEl);
  });
}
