// Configuración de la API
const API_URL = "http://127.0.0.1:3000";

// Función para mostrar alertas con SweetAlert2
function mostrarMensaje(mensaje, esExito = true) {
    Swal.fire({
        title: esExito ? "Éxito" : "Error",
        text: mensaje,
        icon: esExito ? "success" : "error",
        background: "#1e1e1e",
        color: "#ffffff",
        confirmButtonColor: "#E50914",
    });
}

// Obtener ID del género (o crearlo si no existe)
async function obtenerIdsGeneros(generosTexto) {
    try {
        const generosArray = generosTexto.split(",").map(g => g.trim()).filter(g => g !== "");
        if (generosArray.length === 0) return null;

        const response = await fetch(`${API_URL}/generos`);
        const generosExistentes = await response.json();
        let generosIds = [];

        for (const genero of generosArray) {
            let generoEncontrado = generosExistentes.find(g => g.titulo.toLowerCase() === genero.toLowerCase());

            if (generoEncontrado) {
                generosIds.push(generoEncontrado.id);
            } else {
                // Crear género si no existe
                const newGeneroResponse = await fetch(`${API_URL}/generos`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ titulo: genero }),
                });

                const newGenero = await newGeneroResponse.json();
                generosIds.push(newGenero.id);
            }
        }

        return generosIds;
    } catch (error) {
        console.error("Error al obtener o crear géneros:", error);
        mostrarMensaje("No se pudieron procesar los géneros", false);
        return null;
    }
}

// Función para validar el formulario
function validarFormulario(formData) {
    const titulo = formData.get("titulo").trim();
    const descripcion = formData.get("descripcion").trim();
    const anio = formData.get("anio");
    const imagen_url = formData.get("imagen_url").trim();
    const generosTexto = formData.get("genero").trim(); // Puede contener varios géneros

    if (!titulo || !descripcion || !anio || !generosTexto || !imagen_url) {
        mostrarMensaje("Todos los campos son obligatorios", false);
        return false;
    }

    if (anio < 1900 || anio > 2024) {
        mostrarMensaje("El año debe estar entre 1900 y 2024", false);
        return false;
    }

    try {
        new URL(imagen_url);
    } catch {
        mostrarMensaje("La URL de la imagen no es válida", false);
        return false;
    }

    return generosTexto;
}

// Función para manejar el envío del formulario
async function manejarEnvioFormulario(e) {
    e.preventDefault();
    const formData = new FormData(e.target);

    const generosTexto = validarFormulario(formData);
    if (!generosTexto) return;

    const generosIds = await obtenerIdsGeneros(generosTexto);
    if (!generosIds || generosIds.length === 0) {
        mostrarMensaje("No se pudo asignar géneros.", false);
        return;
    }

    const pelicula = {
        titulo: formData.get("titulo"),
        descripcion: formData.get("descripcion"),
        anio: formData.get("anio"),
        imagen_url: formData.get("imagen_url"),
        generos: generosIds // Enviar array de IDs de géneros
    };

    try {
        const response = await fetch(`${API_URL}/peliculas`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(pelicula)
        });

        if (!response.ok) throw new Error("Error al añadir la película");

        // Limpiar formulario
        e.target.reset();
        mostrarMensaje("Película añadida correctamente");

        // Redirigir a la gestión de películas
        setTimeout(() => {
            window.location.href = "../html/administrarPeliculas.html";
        }, 2000);
    } catch (error) {
        console.error("Error:", error);
        mostrarMensaje("Error al añadir la película", false);
    }
}

// Event Listener principal
document.addEventListener("DOMContentLoaded", function () {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario || usuario.username !== "ADMIN") {
        window.location.href = "../html/dashboard.html";
        return;
    }

    // Configurar formulario
    const formPelicula = document.getElementById("form-pelicula");
    if (formPelicula) {
        formPelicula.addEventListener("submit", manejarEnvioFormulario);
    }
});
