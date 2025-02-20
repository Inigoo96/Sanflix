document.addEventListener("DOMContentLoaded", function () {
    const emailForm = document.getElementById("email-form");
    const emailInput = document.getElementById("index-email");
    
    // Intentar recuperar email del localStorage al cargar
    const savedEmail = localStorage.getItem("lastEmail");
    if (savedEmail) {
        emailInput.value = savedEmail;
    }

    emailForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        
        const emailIntroducido = emailInput.value.trim();
        
        if (!emailIntroducido) {
            Swal.fire({
                title: "Error",
                text: "Por favor, ingresa un correo electrónico.",
                icon: "error",
                background: "#1e1e1e",
                color: "#ffffff"
            });
            return;
        }

        // Guardar el email en localStorage
        localStorage.setItem("lastEmail", emailIntroducido);
        
        try {
            const response = await fetch("http://127.0.0.1:3000/auth/verificar-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: emailIntroducido }),
            });
            
            const data = await response.json();
            
            if (data.existe) {
                window.location.href = `html/login.html?email=${encodeURIComponent(emailIntroducido)}`;
            } else {
                window.location.href = `html/register.html?email=${encodeURIComponent(emailIntroducido)}`;
            }
        } catch (error) {
            console.error("Error al verificar el email:", error);
            Swal.fire({
                title: "Error",
                text: "Hubo un error en el servidor. Inténtalo de nuevo.",
                icon: "error",
                background: "#1e1e1e",
                color: "#ffffff"
            });
        }
    });

    const preguntas = document.querySelectorAll(".faq-question");

    preguntas.forEach((pregunta) => {
        pregunta.addEventListener("click", function () {
            const faqItem = this.parentElement;
            faqItem.classList.toggle("active");

            // Cambiar el icono (+ ➡ -)
            const icono = this.querySelector("i");
            if (faqItem.classList.contains("active")) {
                icono.classList.remove("fa-plus");
                icono.classList.add("fa-minus");
            } else {
                icono.classList.remove("fa-minus");
                icono.classList.add("fa-plus");
            }
        });
    });
});
