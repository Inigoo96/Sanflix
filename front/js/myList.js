const API_URL = "http://127.0.0.1:3000";

document.addEventListener("DOMContentLoaded", function () {
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario) {
        window.location.href = "../index.html";
        return;
    }

    document.querySelector("#nombre-usuario").textContent = usuario.username || usuario.nombre;
    document.querySelector("#nombre-usuario-hero").textContent = usuario.username || usuario.nombre;

    cargarFavoritos(usuario.id);
});

async function cargarFavoritos(userId) {
    try {
        const response = await fetch(`${API_URL}/favoritos/${userId}`);
        const peliculas = await response.json();
        
        mostrarFavoritos(peliculas);
    } catch (error) {
        console.error("Error al cargar favoritos:", error);
    }
}

function mostrarFavoritos(peliculas) {
    const contenedor = document.getElementById("contenedor-favoritos");
    if (!contenedor) return;

    contenedor.innerHTML = "";

    if (!Array.isArray(peliculas) || peliculas.length === 0) {
        contenedor.innerHTML = '<p class="no-results">No tienes películas en tu lista de favoritos.</p>';
        return;
    }

    peliculas.forEach(pelicula => {
        const tarjeta = document.createElement("div");
        tarjeta.classList.add("tarjeta-pelicula");
        tarjeta.innerHTML = `
            <img src="${pelicula.imagen_url}" alt="${pelicula.titulo}">
            <div class="tarjeta-contenido">
                <h3>${pelicula.titulo}</h3>
                <p><strong>Año:</strong> ${pelicula.anio}</p>
                <p class="descripcion">${pelicula.descripcion}</p>
                <button class="btn-remove-fav" data-id="${pelicula.id}">
                    <i class="fas fa-heart-broken"></i> 
                </button>
            </div>
        `;
        contenedor.appendChild(tarjeta);
    });

    // Event listener for remove buttons
    document.querySelectorAll(".btn-remove-fav").forEach(button => {
        button.addEventListener("click", function () {
            const peliculaId = this.getAttribute("data-id");
            removeFromFavorites(peliculaId);
        });
    });
}


// Función para eliminar película de favoritos con alerta estilizada
async function removeFromFavorites(peliculaId) {
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario) {
        Swal.fire({
            title: "Inicia sesión",
            text: "Debes iniciar sesión para gestionar tus favoritos.",
            icon: "warning",
            background: "#1e1e1e",
            color: "#ffffff",
            confirmButtonColor: "#E50914",
        });
        return;
    }

    try {
        const response = await fetch(`${API_URL}/favoritos`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id_usuario: usuario.id,
                id_peliculas: peliculaId,
            }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Error al quitar de favoritos");

        Swal.fire({
            title: "Eliminado",
            text: "Película eliminada de favoritos.",
            icon: "success",
            background: "#1e1e1e",
            color: "#ffffff",
            confirmButtonColor: "#E50914",
        });

        cargarFavoritos(usuario.id); // Recargar la lista de favoritos
    } catch (error) {
        console.error("Error al quitar de favoritos:", error);
        Swal.fire({
            title: "Error",
            text: "No se pudo quitar la película de favoritos.",
            icon: "error",
            background: "#1e1e1e",
            color: "#ffffff",
            confirmButtonColor: "#E50914",
        });
    }
}


// Función mejorada para filtrar por género
function filtrarPorGenero(genero) {
    if (!genero || genero === "Todos los Géneros") {
        cargarTodasPeliculas();
        return;
    }

    fetch(GET_PELICULAS)
        .then(res => res.json())
        .then(peliculas => {
            const peliculasFiltradas = peliculas.filter(pelicula =>
                pelicula.genero === genero
            );
            mostrarPeliculas(peliculasFiltradas);
        })
        .catch(error => console.error("Error al filtrar por género:", error));
}

// Event Listener principal
document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos del DOM
    const nombreUsuarioElements = document.querySelectorAll('#nombre-usuario, #nombre-usuario-hero');
    const logoutButton = document.getElementById('logout-button');
    const searchInput = document.getElementById('input-titulo');
    const genreSelect = document.getElementById('select-genero');
    const viewButtons = document.querySelectorAll('.view-btn');
    const navbar = document.querySelector('.navbar');

    // Comprobar autenticación y obtener datos del usuario
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (!usuario) {
        window.location.href = '../index.html';
        return;
    }

    // Mostrar username del usuario (modificado para usar username en lugar de nombre)
    nombreUsuarioElements.forEach(element => {
        if (element) {
            // Usar el username si está disponible, si no, usar el nombre o email como fallback
            element.textContent = usuario.username || usuario.nombre || usuario.email;
        }
    });

    // Si no tenemos el username, intentar obtenerlo del servidor
    if (!usuario.username) {
        fetch(`${API_URL}/usuarios?email=${encodeURIComponent(usuario.email)}`)
            .then(res => res.json())
            .then(usuarios => {
                if (usuarios && usuarios.length > 0) {
                    const usuarioCompleto = usuarios[0];
                    // Actualizar el localStorage con la información completa
                    localStorage.setItem('usuario', JSON.stringify({
                        ...usuario,
                        username: usuarioCompleto.username
                    }));
                    // Actualizar el nombre en la interfaz
                    nombreUsuarioElements.forEach(element => {
                        if (element) element.textContent = usuarioCompleto.username;
                    });
                }
            })
            .catch(error => console.error("Error al obtener información del usuario:", error));
    }

    // Buscador con debounce
    let searchTimeout;
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                buscarPorTitulo(e.target.value);
            }, 300);
        });
    }

    // Selector de género
    if (genreSelect) {
        genreSelect.addEventListener('change', (e) => {
            filtrarPorGenero(e.target.value);
        });
    }

    // Botones de vista
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            viewButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const contenedorPeliculas = document.getElementById('contenedor-peliculas');
            if (contenedorPeliculas) {
                contenedorPeliculas.className = this.dataset.view === 'grid' ? 'movies-grid' : 'movies-list';
            }
        });
    });

    // Navbar interactivo
    if (navbar) {
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 20) {
                navbar.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
            } else {
                navbar.style.backgroundColor = 'transparent';
            }

            if (currentScroll > lastScroll && currentScroll > 100) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScroll = currentScroll;
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', function () {
            Swal.fire({
                title: "¿Cerrar sesión?",
                text: "Se cerrará tu sesión y volverás a la pantalla de inicio.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Sí, salir",
                cancelButtonText: "Cancelar",
                background: "#1e1e1e", /* Fondo oscuro */
                color: "#ffffff", /* Texto blanco */
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.clear();
                    window.location.href = '../index.html';
                }
            });
        });
    }


    // Cargar películas inicialmente
    cargarTodasPeliculas();

    // Fade in inicial
    document.body.style.opacity = '1';
});
