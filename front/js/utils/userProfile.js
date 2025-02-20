class UserProfileManager {
    constructor() {
        this.elements = {
            profilePic: document.getElementById('imagen-perfil'),
            usernameDisplay: document.getElementById('nombre-usuario'),
            logoutButton: document.getElementById('logout-button')
        };

        if (window.location.pathname.includes("perfilConfig.html")) {
            Object.assign(this.elements, {
                cardUsername: document.getElementById('username-input'), 
                cardEmail: document.getElementById('email-input'),      
                cardPhone: document.getElementById('phone-input')
            });
        }

        this.init();
    }

    async init() {
        if (this.validateElements()) {
            this.setupEventListeners();
            await this.loadUserData();
        }
    }

    validateElements() {
        return Object.values(this.elements).every(el => el !== null);
    }

    setupEventListeners() {
        if (this.elements.logoutButton) {
            this.elements.logoutButton.addEventListener('click', () => this.handleLogout());
        }
    }

    async fetchUserData() {
        const token = localStorage.getItem("token");

        if (!token) {
            console.error("No hay un token válido");
            return null;
        }

        try {
            console.log("Enviando solicitud con token:", token);
            const response = await fetch("http://127.0.0.1:3000/usuarios/me", {
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
    
            const data = await response.json();
            return data.usuario;

        } catch (error) {
            console.error("Error al obtener datos del usuario:", error);
            return null;
        }
    }

    async loadUserData() {
        const userData = await this.fetchUserData();
        if (userData) this.updateUI(userData);
    }

    updateUI(userData) {
        if (this.elements.usernameDisplay) {
            this.elements.usernameDisplay.textContent = userData.username || "Usuario";
        }
    
        // Obtener la imagen de perfil de la API
        let newImageUrl = userData.imagen_perfil;
    
        // Si aún no hay imagen, usar DiceBear como último recurso
        if (!newImageUrl || newImageUrl.trim() === "") {
            const avatarSeed = encodeURIComponent(userData.username || "User");
            newImageUrl = `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${avatarSeed}`;
        }
    
        console.log("Cargando imagen de perfil:", newImageUrl);
    
        // Actualizar la imagen en todas las páginas
        if (this.elements.profilePic) {
            this.elements.profilePic.src = newImageUrl;
        }
    
        const dashboardProfilePic = document.getElementById("imagen-perfil");
        if (dashboardProfilePic) {
            dashboardProfilePic.src = newImageUrl;
        }
    }    
    

    handleLogout() {
        localStorage.removeItem("token");
        window.location.href = "/index.html";
    }
}

export default UserProfileManager;
