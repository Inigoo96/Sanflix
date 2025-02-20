const API_URL = "http://127.0.0.1:3000";

import { cargarTodasPeliculas, mostrarPeliculas, toggleView, filtrarPeliculas, checkArrowsVisibility, toggleFavorite } from "./utils/dashboardUtils.js";
import UserProfileManager from './utils/userProfile.js';

document.addEventListener('DOMContentLoaded', async function () {
    const nombreUsuarioElements = document.querySelectorAll('#nombre-usuario, #nombre-usuario-hero');
    const searchInput = document.getElementById('input-titulo');
    const genreSelect = document.getElementById('select-genero');
    const logoutButton = document.getElementById('logout-button');
    const gridViewBtn = document.querySelector(".view-btn[data-view='grid']");
    const listViewBtn = document.querySelector(".view-btn[data-view='list']");
    const adminPanel = document.getElementById("admin-panel");
    const menuToggle = document.querySelector('.menu-toggle');
    const navbarBottom = document.querySelector(".navbar-bottom");
    const mainNav = document.querySelector('.main-nav');
    const navbarCenter = document.querySelector('.navbar-center');
    const searchToggle = document.querySelector(".search-toggle");
    const searchOverlay = document.querySelector(".search-overlay");
    const mainContent = document.querySelector(".main-content");
    const filasDePeliculas = document.querySelectorAll(".fila-horizontal");
    const profilePic = document.getElementById("imagen-perfil");
    const profileCard = document.getElementById("profile-card");
    const savedImage = localStorage.getItem("imagen_perfil");

    if (savedImage) {
        const profilePic = document.getElementById("imagen-perfil");
        if (profilePic) profilePic.src = savedImage;
    }

    document.getElementById("contenedor-peliculas").addEventListener("click", function (event) {
        if (event.target.closest(".btn-favorito")) {
            const button = event.target.closest(".btn-favorito");
            const peliculaId = button.getAttribute("data-id");
            console.log("Clic en favorito:", peliculaId);
            toggleFavorite(peliculaId, button);
        }
    });
    

    // Evita inicializarlo más de una vez
    if (!window.profileManager) { 
        window.profileManager = new UserProfileManager();
        window.profileManager.init();
    }

    // Mostrar/Ocultar la tarjeta cuando se haga clic en la imagen de perfil
    profilePic.addEventListener("click", (event) => {
        event.stopPropagation(); // Evita que el clic se propague y cierre la tarjeta inmediatamente
        profileCard.classList.toggle("visible");
    });

    // Ocultar la tarjeta al hacer clic fuera de ella
    document.addEventListener("click", (event) => {
        if (!profileCard.contains(event.target) && event.target !== profilePic) {
            profileCard.classList.remove("visible");
        }
    });

    // Ocultar con la tecla "Escape"
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            profileCard.classList.remove("visible");
        }
    });

    let isAscending = false;
    let currentView = "list";
    let peliculas = [];
    let searchTimeout;

    menuToggle.addEventListener('click', function() {
        menuToggle.classList.toggle('active');
        mainNav.classList.toggle('active');
        navbarCenter.classList.toggle('active');
    });

    searchToggle.addEventListener("click", () => {
        searchOverlay.classList.toggle("active");
    
        setTimeout(() => {
            if (searchOverlay.classList.contains("active")) {
                mainContent.style.marginTop = "5rem"; // Baja el contenido
            }
        }, 20); // Espera 20ms para asegurarse de que la clase cambió
    });

    if (menuToggle && navbarBottom) {
        menuToggle.addEventListener("click", function () {
            navbarBottom.classList.toggle("active");
            menuToggle.classList.toggle("active"); // Para animación del ícono de hamburguesa
        });
    }    

    // Cerrar la búsqueda al presionar "Escape"
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            searchOverlay.classList.remove("active");
            mainContent.style.marginTop = "0rem"; // Baja el contenido
        }
    });

    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario) {
        window.location.href = "../index.html";
        return;
    }

    if (adminPanel) {
        adminPanel.style.display = usuario.id === 1 ? "inline-block" : "none";
    }

    nombreUsuarioElements.forEach(element => {
        if (element) {
            element.textContent = usuario.username || usuario.nombre || usuario.email;
        }
    });

    if (!usuario.username) {
        fetch(`${API_URL}/usuarios?email=${encodeURIComponent(usuario.email)}`)
            .then(res => res.json())
            .then(usuarios => {
                if (usuarios.length > 0) {
                    localStorage.setItem('usuario', JSON.stringify({
                        ...usuario,
                        username: usuarios[0].username
                    }));
                    nombreUsuarioElements.forEach(element => {
                        if (element) element.textContent = usuarios[0].username;
                    });

                    if (usuarios[0].username === 'ADMIN') {
                        adminPanel.style.display = 'inline-block';
                    }
                }
            })
            .catch(error => console.error("Error al obtener información del usuario:", error));
    }

    try {
        peliculas = await cargarTodasPeliculas();
        changeView(currentView); // Inicializa correctamente la vista
    } catch (error) {
        console.error("Error al cargar películas:", error);
    }

    // Correcciones en la función de filtrado para evitar duplicados y solo filtrar por título
    function filtrarPeliculas(peliculas, titulo) {
        // Normaliza el título ingresado para evitar problemas con mayúsculas y minúsculas
        const tituloBuscado = titulo.toLowerCase();
        
        // Usamos un Set para evitar duplicados basados en el título de la película
        const peliculasUnicas = new Map();
        
        peliculas.forEach(pelicula => {
            if (pelicula.titulo.toLowerCase().includes(tituloBuscado)) {
                if (!peliculasUnicas.has(pelicula.titulo)) {
                    peliculasUnicas.set(pelicula.titulo, pelicula);
                }
            }
        });
        
        return Array.from(peliculasUnicas.values());
    }

    // Corrección en la función actualizarPeliculas para que solo filtre por título
    function actualizarPeliculas() {
        const titulo = searchInput?.value.trim() || "";
        const peliculasFiltradas = filtrarPeliculas(peliculas, titulo);
        mostrarPeliculas(peliculasFiltradas, "list");
    }

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(actualizarPeliculas, 300);
        });
    }

    async function cargarGeneros() {
        try {
            const response = await fetch(`${API_URL}/generos/titulos`);
            if (!response.ok) throw new Error("Error en la respuesta del servidor");
    
            const generos = await response.json(); // Ahora es un array de strings
    
            const genreSelect = document.getElementById("select-genero");
            genreSelect.innerHTML = '<option value="">Todos los Géneros</option>';
    
            generos.forEach(genero => {
                const option = document.createElement("option");
                option.value = genero;
                option.textContent = genero;
                genreSelect.appendChild(option);
            });
        } catch (error) {
            console.error("Error al cargar géneros:", error);
        }
    }

    async function obtenerIdGenero(generoNombre) {
        try {
            const response = await fetch("/generos"); //Ahora llamamos a "/generos"
            const generos = await response.json();
    
            // Buscar género por su nombre
            let generoEncontrado = generos.find(g => g.titulo.toLowerCase() === generoNombre.toLowerCase());
    
            if (generoEncontrado) {
                return generoEncontrado.id;
            }
    
            // Si el género no existe, lo creamos
            const newGeneroResponse = await fetch("/generos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ titulo: generoNombre }),
            });
    
            const newGenero = await newGeneroResponse.json();
            return newGenero.id;
        } catch (error) {
            console.error("Error al obtener o crear género:", error);
            mostrarMensaje("No se pudo obtener o crear el género", false);
            return null;
        }
    }

    // Asegurar que cada película tenga un array de géneros al cargarlas
    async function cargarPeliculasYActualizarVista() {
        try {
            peliculas = await cargarTodasPeliculas();

            peliculas.forEach(pelicula => {
                if (typeof pelicula.generos === "string") {
                    pelicula.generos = pelicula.generos.split(", ").map(g => g.trim());
                }
            });

            // Limpia el contenedor antes de volver a renderizar
        document.getElementById("contenedor-peliculas").innerHTML = "";

            changeView(currentView);
        } catch (error) {
            console.error("Error al cargar películas:", error);
        }
    }
    

    // Llamamos a la función sin eliminar el resto del código
    cargarGeneros();
    cargarPeliculasYActualizarVista();

    if (genreSelect) {
        genreSelect.addEventListener("change", actualizarPeliculas);
    } 

    // Función para actualizar los botones de vista
    function updateActiveButton(view) {
        gridViewBtn.classList.toggle("active", view === "grid");
        listViewBtn.classList.toggle("active", view === "list");
    }

    // Función para cambiar la vista
    function changeView(view) {
        currentView = view;
        updateActiveButton(view);
        mostrarPeliculas(peliculas, view, view === "grid" ? isAscending : undefined);
    }

    // Evento para el botón de Grid
    gridViewBtn.addEventListener("click", function () {
        if (currentView !== "grid") {
            isAscending = false; // Resetear orden al cambiar a grid
        } else {
            isAscending = !isAscending; // Alternar el orden
        }

        changeView("grid");
    });

    // Evento para el botón de Lista
    listViewBtn.addEventListener("click", function () {
        if (currentView !== "list") {
            changeView("list");
        }
    });

    // Establecer la vista inicial correctamente al cargar
    changeView(currentView); // Asegura que la UI se muestre correctamente al inicio


    filasDePeliculas.forEach(fila => {
        const flechaIzquierda = fila.parentElement.querySelector(".flecha-izquierda");
        const flechaDerecha = fila.parentElement.querySelector(".flecha-derecha");

        if (flechaIzquierda && flechaDerecha) {
            checkArrowsVisibility(fila); // Verificamos visibilidad al inicio

            fila.addEventListener("scroll", () => checkArrowsVisibility(fila));
            window.addEventListener("resize", () => checkArrowsVisibility(fila));

            // Eventos para mover la fila al hacer clic en las flechas
            flechaIzquierda.addEventListener("click", () => {
                fila.scrollBy({ left: -fila.clientWidth, behavior: "smooth" });
            });

            flechaDerecha.addEventListener("click", () => {
                fila.scrollBy({ left: fila.clientWidth, behavior: "smooth" });
            });
        }
    });    
    
    if (logoutButton) {
        // Remover cualquier event listener existente
        logoutButton.replaceWith(logoutButton.cloneNode(true));
        
        // Obtener la referencia actualizada después del clonado
        const newLogoutButton = document.getElementById("logout-button");
        
        newLogoutButton.addEventListener("click", async (event) => {
            event.preventDefault();
            event.stopPropagation(); // Detener la propagación del evento
            
            try {
                const result = await Swal.fire({
                    title: "¿Cerrar sesión?",
                    text: "Se cerrará tu sesión y volverás a la pantalla de inicio.",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#d33",
                    cancelButtonColor: "#3085d6",
                    confirmButtonText: "Sí, salir",
                    cancelButtonText: "Cancelar",
                    background: "#1e1e1e",
                    color: "#ffffff",
                });
                
                if (result.isConfirmed) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("usuario");
                    
                    await Swal.fire({
                        title: "Sesión cerrada",
                        text: "Has cerrado sesión correctamente.",
                        icon: "success",
                        background: "#1e1e1e",
                        color: "#ffffff",
                        confirmButtonColor: "#E50914",
                    });
                    
                    window.location.href = "../index.html";
                }
            } catch (error) {
                console.error("Error durante el proceso de logout:", error);
            }
        });
    } else {
        console.error("No se encontró el botón de logout");
    }
});

