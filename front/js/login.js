import { togglePasswordVisibility, clearError, loginUser } from "./utils/auth.js";

document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");
    const emailInput = document.getElementById("login-email");
    const passwordInput = document.getElementById("login-password");
    const errorMessage = document.getElementById("login-error");
    const togglePasswordBtn = document.querySelector(".toggle-password");

    const urlParams = new URLSearchParams(window.location.search);
    const emailFromUrl = urlParams.get("email");
    const savedEmail = localStorage.getItem("lastEmail");

    if (emailInput) {
        emailInput.value = emailFromUrl || savedEmail || "";
    }

    if (togglePasswordBtn) togglePasswordVisibility(passwordInput, togglePasswordBtn);

    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        clearError(errorMessage);
        const success = await loginUser(emailInput.value.trim(), passwordInput.value.trim(), errorMessage);
        if (success) {
            window.location.href = "../html/dashboard.html";
        }
    });
});
