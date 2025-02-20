const API_URL = "http://127.0.0.1:3000";

// Función para mostrar mensajes de éxito o error
function mostrarMensaje(mensaje, esExito = true) {
    const mensajeDiv = document.createElement('div');
    mensajeDiv.className = `mensaje ${esExito ? 'mensaje-exito' : 'mensaje-error'}`;
    mensajeDiv.textContent = mensaje;
    document.body.appendChild(mensajeDiv);
    setTimeout(() => mensajeDiv.remove(), 3000);
}

// Función para validar el usuario admin
function validarAdmin() {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario || usuario.username !== "ADMIN") {
        window.location.href = "../html/dashboard.html";
        return false;
    }
    document.getElementById("nombre-usuario").textContent = usuario.username;
    return true;
}

// Función para cerrar sesión
function configurarLogout() {
    document.getElementById("logout-button").addEventListener("click", function () {
        localStorage.clear();
        window.location.href = "../index.html";
    });
}

// Función para cargar películas en select o listado
async function cargarPeliculas(enSelect = false) {
    try {
        const response = await fetch(`${API_URL}/peliculas`);
        const peliculas = await response.json();
        const contenedor = enSelect ? document.getElementById('pelicula-id') : document.getElementById("peliculas-list");

        if (!contenedor) return;

        // Verificamos si es un select o un listado
        if (enSelect) {
            contenedor.innerHTML = `<option value="">Seleccione una película...</option>` +
                peliculas.map(p => `<option value="${p.id}">${p.titulo}</option>`).join('');
        } else {
            contenedor.innerHTML = peliculas.map(pelicula => {
                // Convertimos los géneros en una cadena separada por comas
                const generos = Array.isArray(pelicula.generos) ? pelicula.generos.join(', ') : 'Sin género';

                return `
                    <div class="pelicula-item">
                        <img src="${pelicula.imagen_url}" alt="${pelicula.titulo}">
                        <div class="pelicula-info">
                            <h3>${pelicula.titulo}</h3>
                            <p>${pelicula.descripcion}</p>
                            <p><strong>Géneros:</strong> ${generos}</p>
                            <button class="btn-delete" data-id="${pelicula.id}">
                                <i class="fas fa-trash"></i> Eliminar
                            </button>
                        </div>
                    </div>`;
            }).join('');
        }

    } catch (error) {
        console.error("Error al cargar películas:", error);
    }
}

// Función para obtener ID del género o crearlo
async function obtenerIdsGeneros(generosNombres) {
    try {
        const response = await fetch(`${API_URL}/generos`);
        const generos = await response.json();

        // Convertimos los nombres de géneros en un array si no lo es
        const nombresArray = Array.isArray(generosNombres) ? generosNombres : [generosNombres];

        let idsGeneros = [];

        for (const generoNombre of nombresArray) {
            let generoEncontrado = generos.find(g => g.titulo.toLowerCase() === generoNombre.toLowerCase());

            if (generoEncontrado) {
                idsGeneros.push(generoEncontrado.id);
            } else {
                // Si no existe, lo creamos
                const newGeneroResponse = await fetch(`${API_URL}/generos`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ titulo: generoNombre }),
                });

                const newGenero = await newGeneroResponse.json();
                idsGeneros.push(newGenero.id);
            }
        }

        return idsGeneros;
    } catch (error) {
        console.error("Error al obtener o crear géneros:", error);
        return [];
    }
}
