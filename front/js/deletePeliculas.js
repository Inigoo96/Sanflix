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

// Función para cargar películas en la página de eliminación
async function cargarPeliculas() {
    try {
        const response = await fetch(`${API_URL}/peliculas`);
        const peliculas = await response.json();
        
        const contenedor = document.getElementById("peliculas-list");
        contenedor.innerHTML = "";

        if (!peliculas.length) {
            contenedor.innerHTML = "<p>No hay películas disponibles.</p>";
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
                    <button class="btn-delete" data-id="${pelicula.id}">
                        <i class="fas fa-trash"></i> Eliminar
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

// Función para eliminar película con confirmación
async function eliminarPelicula(peliculaId) {
    Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción eliminará la película permanentemente.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        background: "#1e1e1e",
        color: "#ffffff",
    }).then(async (result) => {
        if (!result.isConfirmed) return;

        try {
            const response = await fetch(`${API_URL}/peliculas/${peliculaId}`, {
                method: "DELETE",
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message || "Error al eliminar la película");

            mostrarMensaje("Película eliminada correctamente", true);
            cargarPeliculas(); // Recargar la lista después de eliminar
        } catch (error) {
            console.error("Error al eliminar la película:", error);
            mostrarMensaje("No se pudo eliminar la película.", false);
        }
    });
}

// Asignar evento a los botones de eliminar
document.addEventListener("click", function (e) {
    if (e.target.closest(".btn-delete")) {
        const peliculaId = e.target.closest(".btn-delete").getAttribute("data-id");
        eliminarPelicula(peliculaId);
    }
});

// Comprobar si el usuario es admin
document.addEventListener("DOMContentLoaded", function () {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario || usuario.username !== "ADMIN") {
        window.location.href = "../html/dashboard.html";
        return;
    }

    // Cargar películas
    cargarPeliculas();
});
