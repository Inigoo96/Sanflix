// auth.js
export function togglePasswordVisibility(passwordInput, toggleButton) {
    toggleButton.addEventListener("click", function () {
        const isPasswordVisible = passwordInput.type === "password";
        passwordInput.type = isPasswordVisible ? "text" : "password";
        
        // Corregido el operador ternario
        toggleButton.innerHTML = isPasswordVisible 
            ? '<i class="fas fa-eye-slash"></i>' 
            : '<i class="fas fa-eye"></i>';
    });
}

export function showError(element, message) {
    if (element) {
        element.textContent = message;
        element.style.display = "block";
    } else {
        // Si no hay elemento de error, usar SweetAlert
        Swal.fire({
            title: "Error",
            text: message,
            icon: "error",
            background: "#1e1e1e",
            color: "#ffffff",
            confirmButtonColor: "#E50914"
        });
    }
}

export function clearError(element) {
    if (element) {
        element.textContent = "";
        element.style.display = "none";
    }
}

export function esEmailValido(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function loginUser(email, password, errorMessage) {
    if (!email || !password) {
        showError(errorMessage, "Por favor, completa todos los campos");
        return false;
    }

    try {
        const response = await fetch("http://127.0.0.1:3000/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || "Error en el login");
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("usuario", JSON.stringify(data.user));
        localStorage.setItem("lastEmail", email);

        return true;
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        showError(errorMessage, "Email o contraseña incorrectos.");
        return false;
    }
}

export async function registerUser(username, email, telefono, password, errorMessage) {
    if (!username || !email || !telefono || !password) {
        showError(errorMessage, "Todos los campos son obligatorios");
        return false;
    }

    if (!esEmailValido(email)) {
        showError(errorMessage, "El correo electrónico no es válido.");
        return false;
    }

    try {
        const response = await fetch("http://localhost:3000/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, telefono, password }),
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || "Error en el registro");
        }

        if (!data.token) {
            throw new Error("No se recibió un token del servidor");
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("usuario", JSON.stringify(data.user));
        localStorage.setItem("lastEmail", email);

        return true;
    } catch (error) {
        console.error("Error en el registro:", error);
        showError(errorMessage, error.message);
        return false;
    }
}