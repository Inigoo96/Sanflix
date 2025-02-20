const API_URL = "http://127.0.0.1:3000";

/**
 * Carga todas las películas desde la API.
 */
export async function cargarTodasPeliculas() {
    try {
        const response = await fetch(`${API_URL}/peliculas`);
        let peliculas = await response.json();

        // Asegurar que cada película tenga un array de géneros
        peliculas.forEach(pelicula => {
            if (typeof pelicula.generos === "string") {
                pelicula.generos = pelicula.generos.split(", ").map(g => g.trim());
            }
        });

        return peliculas;
    } catch (error) {
        console.error("Error al cargar películas:", error);
        return [];
    }
}

/**
 * Muestra las películas en el DOM, agrupadas por género (list-view) o por año (grid-view).
 */
export async function mostrarPeliculas(peliculas, viewMode = "list", isAscending = false) {
    console.log("View mode:", viewMode); // Debugging log
    const contenedor = document.getElementById("contenedor-peliculas");
    if (!contenedor) return;

    contenedor.innerHTML = "";

    if (!Array.isArray(peliculas) || peliculas.length === 0) {
        contenedor.innerHTML = '<p class="no-results">No se encontraron películas</p>';
        return;
    }

    // Obtener favoritos del usuario
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    let favoritos = [];
    if (usuario) {
        try {
            const favResponse = await fetch(`${API_URL}/favoritos/${usuario.id}`);
            favoritos = await favResponse.json();

            if (!Array.isArray(favoritos)) {
                favoritos = []; // Asegurar que sea un array 
            }
        } catch (error) {
            console.error("Error al obtener favoritos:", error);
        }
    }

    //MODO GRID (Ordenado por Año)
    if (viewMode === "grid") {
        peliculas.sort((a, b) => isAscending ? a.anio - b.anio : b.anio - a.anio);

        contenedor.classList.add("grid-view");
        contenedor.classList.remove("list-view");

        peliculas.forEach(pelicula => {
            const tarjeta = crearTarjetaPelicula(pelicula, favoritos);
            contenedor.appendChild(tarjeta);
        });

    } else {  
        //MODO LIST (Agrupado por Género)
        contenedor.classList.add("list-view");
        contenedor.classList.remove("grid-view");

        const peliculasPorGenero = agruparPeliculasPorGenero(peliculas);

        Object.keys(peliculasPorGenero).forEach(genero => {
            const seccionGenero = document.createElement("div");
            seccionGenero.classList.add("fila-genero");

            const headerGenero = document.createElement("div");
            headerGenero.classList.add("header-genero");

            const tituloGenero = document.createElement("h2");
            tituloGenero.textContent = genero;
            tituloGenero.classList.add("titulo-genero");

            // Contenedor de botones de navegación
            const navContainer = document.createElement("div");
            navContainer.classList.add("nav-container");

            const flechaIzquierda = document.createElement("button");
            flechaIzquierda.className = "flecha-navegacion flecha-izquierda";
            flechaIzquierda.innerHTML = '<i class="fas fa-chevron-left"></i>';

            const flechaDerecha = document.createElement("button");
            flechaDerecha.className = "flecha-navegacion flecha-derecha";
            flechaDerecha.innerHTML = '<i class="fas fa-chevron-right"></i>';

            navContainer.appendChild(flechaIzquierda);
            navContainer.appendChild(flechaDerecha);

            headerGenero.appendChild(tituloGenero);
            headerGenero.appendChild(navContainer);
            seccionGenero.appendChild(headerGenero);

            const contenedorFila = document.createElement("div");
            contenedorFila.classList.add("fila-horizontal");

            peliculasPorGenero[genero].forEach(pelicula => {
                const tarjeta = crearTarjetaPelicula(pelicula, favoritos);
                contenedorFila.appendChild(tarjeta);
            });

            // Eventos de navegación
            const scrollAmount = 4 * 220; // Mover de 4 en 4, suponiendo que cada tarjeta mide 220px aprox

            flechaIzquierda.addEventListener("click", () => {
                contenedorFila.scrollBy({ left: -scrollAmount, behavior: "smooth" });
            });

            flechaDerecha.addEventListener("click", () => {
                contenedorFila.scrollBy({ left: scrollAmount, behavior: "smooth" });
            });

            seccionGenero.appendChild(contenedorFila);
            contenedor.appendChild(seccionGenero);

            setTimeout(() => checkArrowsVisibility(contenedorFila, flechaIzquierda, flechaDerecha), 100);
            window.addEventListener("resize", () => checkArrowsVisibility(contenedorFila, flechaIzquierda, flechaDerecha));
        });
    }    
    
}

/**
 * Agrupa las películas por género.
 * Ahora una película puede pertenecer a múltiples géneros, por lo que la agregamos a cada uno.
 */
function agruparPeliculasPorGenero(peliculas) {
    return peliculas.reduce((acc, pelicula) => {
        // Aseguramos que los géneros sean un array
        const generos = Array.isArray(pelicula.generos) ? pelicula.generos : ["Sin género"];

        generos.forEach(genero => {
            if (!acc[genero]) {
                acc[genero] = [];
            }
            acc[genero].push(pelicula);
        });

        return acc;
    }, {});
}

/**
 * Crea la tarjeta de película con su contenido.
 */
function crearTarjetaPelicula(pelicula, favoritos) {
    const isFavorito = favoritos.some(fav => fav.id === pelicula.id);
    const heartClass = isFavorito ? "favorited" : "";

    const tarjeta = document.createElement("div");
    tarjeta.classList.add("tarjeta-pelicula");
    tarjeta.innerHTML = `
        <img src="${pelicula.imagen_url}" alt="${pelicula.titulo}">
        <div class="tarjeta-contenido">
            <h3>${pelicula.titulo}</h3>
            <p><strong>Año:</strong> ${pelicula.anio}</p>
            <p class="descripcion">${pelicula.descripcion}</p>
            <button class="btn-favorito ${heartClass}" data-id="${pelicula.id}">
                <i class="fas fa-heart"></i> 
            </button>
        </div>
    `;
    return tarjeta;
}

/**
 * Verifica si las flechas de navegación deben mostrarse.
 */
export function checkArrowsVisibility(contenedorFila) {
    const flechaIzquierda = contenedorFila.parentElement.querySelector(".flecha-izquierda");
    const flechaDerecha = contenedorFila.parentElement.querySelector(".flecha-derecha");

    if (!flechaIzquierda || !flechaDerecha) return; // Evita errores si no encuentra las flechas

    const maxScrollLeft = contenedorFila.scrollWidth - contenedorFila.clientWidth;
    const hayDesplazamiento = contenedorFila.scrollWidth > contenedorFila.clientWidth;

    flechaIzquierda.style.display = hayDesplazamiento ? "flex" : "none";
    flechaDerecha.style.display = hayDesplazamiento ? "flex" : "none";

    function actualizarFlecha(flecha, estado) {
        if (estado === "disabled") {
            flecha.classList.add("disabled");
            flecha.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
            flecha.style.color = "rgba(255, 255, 255, 0.4)";
            flecha.style.pointerEvents = "none";
            flecha.style.opacity = "0.3";
        } else {
            flecha.classList.remove("disabled");
            flecha.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
            flecha.style.color = "#ffffff";
            flecha.style.pointerEvents = "auto";
            flecha.style.opacity = "1";
        }
    }

    const scrollLeftRedondeado = Math.round(contenedorFila.scrollLeft);
    const maxScrollLeftRedondeado = Math.round(maxScrollLeft);

    actualizarFlecha(flechaIzquierda, scrollLeftRedondeado <= 0 ? "disabled" : "enabled");
    actualizarFlecha(flechaDerecha, scrollLeftRedondeado >= maxScrollLeftRedondeado ? "disabled" : "enabled");
}



/**
 * Alterna una película como favorita.
 */
export async function toggleFavorite(peliculaId, button) {
    console.log("Ejecutando toggleFavorite para:", peliculaId);

    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario) {
        alert("Debes iniciar sesión.");
        return;
    }

    const heartIcon = button.querySelector("i");
    const isFavorito = button.classList.contains("favorited");

    try {
        const response = await fetch(`${API_URL}/favoritos`, {
            method: isFavorito ? "DELETE" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_usuario: usuario.id, id_peliculas: peliculaId })
        });

        if (!response.ok) throw new Error("Error en favoritos");

        // Alternar estado visual del botón
        button.classList.toggle("favorited");
        console.log(isFavorito ? "Película eliminada de favoritos" : "Película añadida a favoritos");
    } catch (error) {
        console.error("Error al cambiar favoritos:", error);
    }
}

export function toggleView(view) {
    const container = document.getElementById("contenedor-peliculas");
    if (!container) return;

    container.classList.toggle("grid-view", view === "grid");
    container.classList.toggle("list-view", view === "list");
}


// dashboardUtils.js

/**
 * Filtra las películas por título y género.
 * @param {Array} peliculas - Lista de películas en formato JSON.
 * @param {string} titulo - Texto ingresado en el campo de búsqueda.
 * @param {string} genero - Género seleccionado en el filtro.
 * @returns {Array} - Lista de películas filtradas.
 */
export function filtrarPeliculas(peliculas, titulo, generoSeleccionado) {
    return peliculas.filter(pelicula => {
        const tituloCoincide = titulo === "" || pelicula.titulo.toLowerCase().includes(titulo.toLowerCase());

        const generoCoincide =
            generoSeleccionado === "" ||
            (pelicula.generos && pelicula.generos.some(g => g.toLowerCase() === generoSeleccionado.toLowerCase()));

        return tituloCoincide && generoCoincide;
    });
}


