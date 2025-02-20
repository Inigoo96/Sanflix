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

// Función para cargar películas eliminadas
async function cargarPeliculas() {
    try {
        const response = await fetch(`${API_URL}/recuperar_peliculas`);
        const peliculas = await response.json();
        
        const contenedor = document.getElementById("peliculas-list");
        contenedor.innerHTML = "";

        if (!peliculas.length) {
            contenedor.innerHTML = "<p>No hay películas para restaurar.</p>";
            return;
        }

        peliculas.forEach(pelicula => {
            const peliculaDiv = document.createElement("div");
            peliculaDiv.classList.add("pelicula-item");
            peliculaDiv.innerHTML = `
                <img src="${pelicula.imagen_url}" alt="${pelicula.titulo}">
                <div class="pelicula-info">
                    <h3>${pelicula.titulo}</h3>
                    <p>${pelicula.descripcion}</p>
                    <button class="btn-restore" data-id="${pelicula.id}">
                        <i class="fas fa-undo"></i> Restaurar
                    </button>
                </div>
            `;
            contenedor.appendChild(peliculaDiv);
        });
    } catch (error) {
        console.error("Error al cargar películas:", error);
        mostrarMensaje("Error al cargar las películas", false);
    }
}

// Función para restaurar película
async function restaurarPelicula(peliculaId) {
    Swal.fire({
        title: "¿Restaurar película?",
        text: "La película será devuelta a la lista de películas activas.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, restaurar",
        cancelButtonText: "Cancelar",
        background: "#1e1e1e",
        color: "#ffffff",
    }).then(async (result) => {
        if (!result.isConfirmed) return;

        try {
            await fetch(`${API_URL}/recuperar_peliculas/${peliculaId}`, { method: "PUT" });
            mostrarMensaje("Película restaurada correctamente", true);
            cargarPeliculas(); // Recargar la lista
        } catch (error) {
            console.error("Error al restaurar película:", error);
            mostrarMensaje("No se pudo restaurar la película.", false);
        }
    });
}

// Eventos
document.addEventListener("click", e => {
    if (e.target.closest(".btn-restore")) {
        const peliculaId = e.target.closest(".btn-restore").getAttribute("data-id");
        restaurarPelicula(peliculaId);
    }
});

document.addEventListener("DOMContentLoaded", cargarPeliculas);
