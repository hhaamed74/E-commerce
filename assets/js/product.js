// Get the product ID from the URL parameters
const params = new URLSearchParams(window.location.search);
const productId = parseInt(params.get("id"), 10);

if (!isNaN(productId)) {
  // Find the product in the products array
  const product = products.find((p) => p.id === productId);

  if (product) {
    console.log("Product data:", product); // Check if data is loaded

    // Update product image and text fields
    document.getElementById("product-image").src = product.image;
    document.getElementById("product-name").textContent = product.name;
    document.getElementById("product-description").textContent =
      product.description;
    document.getElementById("product-details-text").textContent =
      product.details;
    document.getElementById(
      "product-category"
    ).textContent = `التصنيف: ${product.category}`;
    document.getElementById(
      "product-stock"
    ).textContent = `المخزون المتاح: ${product.stock}`;

    // Display rating number
    const ratingNumberElem = document.getElementById("product-rating-number");
    if (ratingNumberElem) {
      ratingNumberElem.textContent =
        product.rating !== undefined ? product.rating.toFixed(1) : "غير متوفر";
    }

    // Display stars with support for decimal ratings
    const starsContainer = document.getElementById("product-rating-stars");
    if (starsContainer) {
      const rating = product.rating || 0;
      const fullStars = Math.floor(rating);
      const halfStar = rating - fullStars >= 0.5 ? 1 : 0;
      const emptyStars = 5 - fullStars - halfStar;

      starsContainer.innerHTML =
        "★".repeat(fullStars) +
        (halfStar ? "⯪" : "") + // Half star
        "☆".repeat(emptyStars);
    }

    // Display product price
    document.getElementById(
      "product-price"
    ).textContent = `${product.price} جنيه`;

    // Add to cart functionality
    document.getElementById("add-to-cart").addEventListener("click", () => {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      const existingItem = cart.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ id: product.id, quantity: 1 });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();
      alert("تمت إضافة المنتج إلى السلة بنجاح");
    });
  } else {
    // Product not found
    document.getElementById("product-details").innerHTML =
      "<p>المنتج غير موجود.</p>";
  }
} else {
  // Invalid product ID
  document.getElementById("product-details").innerHTML =
    "<p>رقم المنتج غير صحيح.</p>";
}

// Function to update the cart count displayed in the header
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCountElem = document.getElementById("cart-count");
  if (cartCountElem) {
    cartCountElem.textContent = totalQuantity;
  }
}
