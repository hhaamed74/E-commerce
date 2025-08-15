// ================================
// User Authentication & Storage
// ================================

// ✅ Get users from localStorage
function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

// ✅ Save users to localStorage
function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

// ✅ Regex patterns
const usernameRegex = /^[\u0600-\u06FFa-zA-Z\s]{3,20}$/; // عربي وإنجليزي ومسافة، 3-20 حرف
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // تحقق من إيميل صحيح
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/; // باسورد قوي

// ================================
// Register a new user
// ================================
function registerUser(username, email, password) {
  if (!usernameRegex.test(username)) {
    return {
      success: false,
      message: "الاسم يجب أن يكون عربي أو إنجليزي من 3 إلى 20 حرف.",
    };
  }

  if (!emailRegex.test(email)) {
    return { success: false, message: "الإيميل غير صحيح." };
  }

  if (!passwordRegex.test(password)) {
    return {
      success: false,
      message:
        "كلمة المرور يجب أن تحتوي على حرف كبير، حرف صغير، رقم، رمز وطولها 8 أحرف على الأقل.",
    };
  }

  const users = getUsers();
  const userExists = users.some((user) => user.email === email);
  if (userExists) {
    return { success: false, message: "هذا الإيميل مسجل بالفعل." };
  }

  users.push({ username, email, password });
  saveUsers(users);
  return { success: true };
}

// ================================
// Login user
// ================================
function loginUser(email, password) {
  const users = getUsers();
  const user = users.find((u) => u.email === email && u.password === password);
  if (user) {
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    return { success: true, user };
  }
  return { success: false, message: "الإيميل أو كلمة المرور غير صحيحة." };
}

// ================================
// Logout user
// ================================
function logoutUser() {
  localStorage.removeItem("loggedInUser");
}

// ================================
// Get currently logged-in user
// ================================
function getLoggedInUser() {
  return JSON.parse(localStorage.getItem("loggedInUser"));
}

// ================================
// Toast Notification
// ================================
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
  setTimeout(() => toast.classList.remove("show"), duration);
}

// ================================
// Form Handling for Register & Login
// ================================
document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      const result = registerUser(username, email, password);
      if (result.success) {
        showToast("تم التسجيل بنجاح! يمكنك الآن تسجيل الدخول.");
        setTimeout(() => (window.location.href = "/login.html"), 3000);
      } else {
        showToast(result.message);
      }
    });
  }

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      const result = loginUser(email, password);
      if (result.success) {
        showToast(`أهلاً ${result.user.username}! تم تسجيل الدخول.`);
        setTimeout(() => (window.location.href = "/index.html"), 3000);
      } else {
        showToast(result.message);
      }
    });
  }
});
