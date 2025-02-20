// Configuración de la API
const API_URL = "http://127.0.0.1:3000";

// Objeto para almacenar los datos originales de la película seleccionada
let datosOriginales = {};

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

// Cargar películas en el select
async function cargarPeliculas() {
    try {
        const response = await fetch(`${API_URL}/peliculas`);
        const peliculas = await response.json();

        const selectPelicula = document.getElementById("pelicula-id");
        selectPelicula.innerHTML =
            `<option value="">Seleccione una película...</option>` +
            peliculas.map(p => `<option value="${p.id}">${p.titulo}</option>`).join("");
    } catch (error) {
        console.error("Error al cargar películas:", error);
        mostrarMensaje("Error al cargar las películas", false);
    }
}

// Evento al seleccionar una película
document.getElementById("pelicula-id").addEventListener("change", async function () {
    const peliculaId = this.value;
    if (!peliculaId) return;

    try {
        const response = await fetch(`${API_URL}/peliculas/${peliculaId}`);
        if (!response.ok) throw new Error("No se pudo obtener la película");

        const pelicula = await response.json();
        if (!pelicula) return;

        console.log("Película obtenida:", pelicula); // Log para verificar los datos recibidos

        // Guardar los valores originales
        datosOriginales = {
            titulo: pelicula.titulo || "",
            descripcion: pelicula.descripcion || "", //Ahora se carga correctamente
            anio: pelicula.anio || "",
            imagen_url: pelicula.imagen_url || "", //Ahora se carga correctamente
            generos: pelicula.generos ? pelicula.generos.join(", ") : "" // Convertir array a string
        };

        // Llenar los campos del formulario con los datos originales
        document.getElementById("titulo").value = datosOriginales.titulo;
        document.getElementById("descripcion").value = datosOriginales.descripcion;
        document.getElementById("anio").value = datosOriginales.anio;
        document.getElementById("imagen_url").value = datosOriginales.imagen_url;
        document.getElementById("genero").value = datosOriginales.generos;

    } catch (error) {
        console.error("Error al cargar película:", error);
        mostrarMensaje("Error al cargar los datos de la película", false);
    }
});

// Enviar cambios al servidor con confirmación
// Enviar cambios al servidor con confirmación
document.getElementById("form-modificar-pelicula").addEventListener("submit", async function (e) {
    e.preventDefault();

    const peliculaId = document.getElementById("pelicula-id").value;
    if (!peliculaId) {
        mostrarMensaje("Debe seleccionar una película", false);
        return;
    }

    // Obtener valores del formulario
    const titulo = document.getElementById("titulo").value.trim() || datosOriginales.titulo; // 🛠️ Si está vacío, usa el original
    const descripcion = document.getElementById("descripcion").value.trim() || datosOriginales.descripcion;
    const anio = document.getElementById("anio").value.trim() || datosOriginales.anio;
    const imagen_url = document.getElementById("imagen_url").value.trim() || datosOriginales.imagen_url;
    const generosTexto = document.getElementById("genero").value.trim();

    // Asegurar que enviamos TODOS los datos necesarios
    let datosActualizados = {
        titulo,
        descripcion,
        anio,
        imagen_url,
    };

    // Procesar los géneros si han cambiado
    if (generosTexto !== datosOriginales.generos) {
        const generosNuevos = generosTexto.split(",").map(g => g.trim());
        try {
            const generosIds = await Promise.all(
                generosNuevos.map(async genero => await obtenerIdGenero(genero))
            );
            datosActualizados.generos = generosIds.filter(id => id !== null);
        } catch (error) {
            console.error("Error al procesar géneros:", error);
            mostrarMensaje("Error al procesar los géneros.", false);
            return;
        }
    }

    console.log("Enviando datos al servidor:", JSON.stringify(datosActualizados, null, 2));

    // Confirmación antes de modificar
    Swal.fire({
        title: "¿Confirmar cambios?",
        text: "Se modificarán solo los campos que editaste.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#E50914",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, modificar",
        cancelButtonText: "Cancelar",
        background: "#1e1e1e",
        color: "#ffffff",
    }).then(async (result) => {
        if (!result.isConfirmed) return;

        try {
            console.log("Enviando datos al servidor:", JSON.stringify(datosActualizados, null, 2));
            const response = await fetch(`${API_URL}/peliculas/${peliculaId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datosActualizados),
            });

            if (!response.ok) throw new Error("Error al modificar película");

            mostrarMensaje("Película modificada correctamente", true);

            // Recargar la lista de películas para ver cambios
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (error) {
            console.error("Error al modificar:", error);
            mostrarMensaje("No se pudo modificar la película", false);
        }
    });
});

// Obtener ID del género (o crearlo si no existe)
async function obtenerIdGenero(tituloGenero) {
    if (!tituloGenero) return null;
    
    try {
        const response = await fetch(`${API_URL}/generos`);
        if (!response.ok) return null;
        
        const generos = await response.json();
        let genero = generos.find(g => g.titulo.toLowerCase() === tituloGenero.toLowerCase());

        if (genero) {
            return genero.id;
        }

        // Si el género no existe, lo creamos
        const newGeneroResponse = await fetch(`${API_URL}/generos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ titulo: tituloGenero }),
        });

        if (!newGeneroResponse.ok) return null;
        
        const newGenero = await newGeneroResponse.json();
        return newGenero.id;
    } catch (error) {
        console.error("Error al obtener o crear género:", error);
        return null;
    }
}


// Comprobar si el usuario es admin y cargar la lista de películas
document.addEventListener("DOMContentLoaded", function () {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario || usuario.username !== "ADMIN") {
        window.location.href = "../html/dashboard.html";
        return;
    }

    cargarPeliculas();
});
