// ✅ User storage functions (store users as an array in localStorage)
function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

// ✅ Register a new user
function registerUser(username, email, password) {
  const users = getUsers();
  // Check if email is already registered
  const userExists = users.some((user) => user.email === email);
  if (userExists) {
    return { success: false, message: "هذا الإيميل مسجل بالفعل." };
  }
  users.push({ username, email, password });
  saveUsers(users);
  return { success: true };
}

// ✅ Login user (check email and password)
function loginUser(email, password) {
  const users = getUsers();
  const user = users.find((u) => u.email === email && u.password === password);
  if (user) {
    // Save logged-in user in localStorage
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    return { success: true, user };
  }
  return { success: false, message: "الإيميل أو كلمة المرور غير صحيحة." };
}

// ✅ Logout current user
function logoutUser() {
  localStorage.removeItem("loggedInUser");
}

// ✅ Get currently logged-in user
function getLoggedInUser() {
  return JSON.parse(localStorage.getItem("loggedInUser"));
}

// ✅ Toast element (add in HTML: <div id="toast" class="toast"></div>)
const toast = document.getElementById("toast");

// ✅ Show a toast message
function showToast(message, duration = 3000) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, duration);
}

// ==== Form handling for Register & Login pages ====
document.addEventListener("DOMContentLoaded", () => {
  // ✅ Register form submission
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
        // Redirect to login page after 3 seconds
        setTimeout(() => {
          window.location.href = "login.html";
        }, 3000);
      } else {
        showToast(result.message);
      }
    });
  }

  // ✅ Login form submission
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      const result = loginUser(email, password);
      if (result.success) {
        showToast(`أهلاً ${result.user.username}! تم تسجيل الدخول.`);
        // Redirect to homepage after 3 seconds
        setTimeout(() => {
          window.location.href = "index.html";
        }, 3000);
      } else {
        showToast(result.message);
      }
    });
  }
});
