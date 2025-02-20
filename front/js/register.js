import { togglePasswordVisibility, clearError, registerUser } from "./utils/auth.js";

document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("register-form");
    const usernameInput = document.getElementById("register-username");
    const emailInput = document.getElementById("register-email");
    const telefonoInput = document.getElementById("register-telefono");
    const passwordInput = document.getElementById("register-password");
    const togglePasswordButton = document.querySelector(".toggle-password");
    const errorMessage = document.getElementById("register-error");

    const urlParams = new URLSearchParams(window.location.search);
    const emailFromUrl = urlParams.get("email");
    const savedEmail = localStorage.getItem("lastEmail");

    if (emailInput) {
        emailInput.value = emailFromUrl || savedEmail || "";
    }

    if (togglePasswordButton) togglePasswordVisibility(passwordInput, togglePasswordButton);

    registerForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        clearError(errorMessage);
        const success = await registerUser(
            usernameInput.value.trim(), 
            emailInput.value.trim(), 
            telefonoInput.value.trim(), 
            passwordInput.value.trim(), 
            errorMessage
        );
        if (success) {
            window.location.href = "../html/dashboard.html";
        }
    });
});
