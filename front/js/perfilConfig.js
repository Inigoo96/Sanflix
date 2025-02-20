import UserProfileManager from "./utils/userProfile.js";

document.addEventListener("DOMContentLoaded", async () => {
    console.log("DOM completamente cargado en perfilConfig");

    // Inicializar UserProfileManager
    const profileManager = new UserProfileManager();
    
    // Cargar los datos del usuario desde la API
    await profileManager.loadUserData();

    const passwordBtn = document.querySelector("#update-password-btn");
    if (passwordBtn) {
        passwordBtn.addEventListener("click", updatePassword);
    }

    // Configurar funcionalidades específicas de la página de perfil
    if (window.location.pathname.includes("perfilConfig.html")) {
        configurarSubidaImagen();
        configurarEdicionCampos();
    }
});


function configurarEdicionCampos() {
    document.querySelectorAll(".btn-edit").forEach(button => {
        button.addEventListener("click", function () {
            const field = this.getAttribute("data-field");
            enableEdit(field);
        });
    });

    document.querySelectorAll(".btn-save").forEach(button => {
        button.addEventListener("click", function () {
            const field = this.getAttribute("data-field");
            saveEdit(field);
        });
    });

    document.querySelectorAll(".btn-cancel").forEach(button => {
        button.addEventListener("click", function () {
            const field = this.getAttribute("data-field");
            cancelEdit(field);
        });
    });
}

function configurarSubidaImagen() {
    const uploadBtn = document.getElementById("upload-btn");
    const fileInput = document.getElementById("image-upload");
    const saveImageBtn = document.getElementById("save-image");
    const imageUrlInput = document.getElementById("image-url");
    const profilePicture = document.getElementById("imagen-perfil");

    uploadBtn.addEventListener("click", () => fileInput.click());

    fileInput.addEventListener("change", () => {
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => profilePicture.src = reader.result;
            reader.readAsDataURL(file);
        }
    });

    saveImageBtn.addEventListener("click", () => {
        const token = localStorage.getItem("token");
        const imageUrl = imageUrlInput.value.trim();
        const file = fileInput.files[0];
    
        if (!token) {
            Swal.fire("Error", "No has iniciado sesión.", "error");
            return;
        }
    
        if (file) {
            handleFileUpload(file, token);
        } else if (imageUrl) {
            handleUrlUpload(imageUrl, token);
        } else {
            Swal.fire("Error", "Debes seleccionar una imagen o ingresar una URL.", "warning");
        }
    });
    
    
}

function handleFileUpload(file, token) {
    const formData = new FormData();
    formData.append("imagen", file);
    updateProfileImage(token, formData);
}

function handleUrlUpload(imageUrl, token) {
    fetch("http://127.0.0.1:3000/usuarios/me/imagen", {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ imagen_perfil: imageUrl })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire("Éxito", "Imagen de perfil actualizada.", "success");
            localStorage.setItem("imagen_perfil", data.usuario.imagen_perfil);
            updateProfileImages(data.usuario.imagen_perfil);
        } else {
            Swal.fire("Error", "No se pudo actualizar la imagen.", "error");
        }
    })
    .catch(error => {
        console.error("Error al actualizar imagen:", error);
        Swal.fire("Error", "No se pudo actualizar la imagen.", "error");
    });
}

async function updateProfileImage(token, data, isJson = false) {
    console.log("Token enviado en la solicitud:", token);

    //Validar que el token existe
    if (!token) {
        console.error("Error: No hay token en localStorage.");
        Swal.fire("Error", "No has iniciado sesión.", "error");
        return;
    }

    //Validar que 'data' no esté vacío
    if (!data) {
        console.error("Error: 'data' está indefinida o vacía.");
        Swal.fire("Error", "No se encontró la imagen para actualizar.", "error");
        return;
    }

    //Configurar headers correctamente
    const headers = { "Authorization": `Bearer ${token.trim()}` }; //Asegurar que no tenga espacios extra
    if (isJson) {
        headers["Content-Type"] = "application/json";
        data = JSON.stringify(data);
    }

    console.log("Headers enviados:", headers);
    console.log("Enviando imagen al backend:", data);

    try {
        const response = await fetch("http://127.0.0.1:3000/usuarios/me/imagen", {
            method: "PUT",
            headers,
            body: data
        });

        console.log("Código de respuesta:", response.status);

        //Si la respuesta es 401 (Unauthorized), verificar si el token ha expirado
        if (response.status === 401) {
            console.warn("Error 401: Token inválido o expirado.");
            Swal.fire("Error", "Tu sesión ha expirado. Inicia sesión nuevamente.", "error");
            localStorage.removeItem("token");
            window.location.href = "/login.html";
            return;
        }

        //Si la respuesta no es OK, mostrar error
        if (!response.ok) {
            console.error(`Error en la solicitud: ${response.status} ${response.statusText}`);
            Swal.fire("Error", "No se pudo actualizar la imagen.", "error");
            return;
        }

        const result = await response.json();
        console.log("Respuesta del servidor:", result);

        if (result.success) {
            Swal.fire("Éxito", "Imagen de perfil actualizada.", "success");
            updateProfileImages(result.usuario.imagen_perfil);
        } else {
            console.error("Error en la respuesta del servidor:", result);
            Swal.fire("Error", "No se pudo actualizar la imagen.", "error");
        }
    } catch (error) {
        console.error("Error al actualizar imagen:", error);
        Swal.fire("Error", "No se pudo actualizar la imagen.", "error");
    }
}



function updateProfileImages(newImageUrl) {
    const timestamp = new Date().getTime(); // Evita caché del navegador
    const finalUrl = `${newImageUrl}?t=${timestamp}`;

    // Actualizar la imagen en el perfil
    document.getElementById("imagen-perfil").src = finalUrl;

    // Actualizar la imagen en el dashboard si existe
    const dashboardProfilePic = document.getElementById("imagen-perfil");
    if (dashboardProfilePic) {
        dashboardProfilePic.src = finalUrl;
    }
}


function enableEdit(field) {
    const input = document.getElementById(`${field}-input`);
    const fieldContent = input.closest('.field-content');
    
    input.disabled = false;
    input.focus();

    fieldContent.querySelector('.btn-edit').classList.add('hidden');
    fieldContent.querySelector('.btn-save').classList.remove('hidden');
    fieldContent.querySelector('.btn-cancel').classList.remove('hidden');
}

function saveEdit(field) {
    const token = localStorage.getItem("token");
    const input = document.getElementById(`${field}-input`);
    const newValue = input.value.trim();

    if (!token || newValue === "") {
        Swal.fire("Error", !token ? "No has iniciado sesión." : "El campo no puede estar vacío.", "warning");
        return;
    }

    const fieldMapping = { phone: "telefono" };
    const fieldName = fieldMapping[field] || field;

    fetch("http://127.0.0.1:3000/usuarios/me", {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ [fieldName]: newValue })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire("Éxito", "Cambios guardados correctamente.", "success");
            input.value = newValue;
        } else {
            Swal.fire("Error", data.error, "error");
        }
    })
    .catch(error => {
        console.error("Error al actualizar:", error);
        Swal.fire("Error", "No se pudo actualizar el perfil.", "error");
    });

    input.disabled = true;
    resetButtons(field);
}

function cancelEdit(field) {
    document.getElementById(`${field}-input`).disabled = true;
    resetButtons(field);
}

function resetButtons(field) {
    const fieldContent = document.getElementById(`${field}-input`).closest('.field-content');
    
    fieldContent.querySelector('.btn-edit').classList.remove('hidden');
    fieldContent.querySelector('.btn-save').classList.add('hidden');
    fieldContent.querySelector('.btn-cancel').classList.add('hidden');
}

function updatePassword() {
    const token = localStorage.getItem("token");
    const newPassword = document.getElementById("password-input").value.trim();

    if (!token || newPassword.length < 6) {
        Swal.fire("Error", !token ? "No has iniciado sesión." : "La contraseña debe tener al menos 6 caracteres.", "warning");
        return;
    }

    fetch("http://127.0.0.1:3000/usuarios/me/password", {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ password: newPassword })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire("Éxito", "Contraseña actualizada correctamente.", "success");
            document.getElementById("password-input").value = "";
        } else {
            Swal.fire("Error", data.error, "error");
        }
    })
    .catch(error => {
        console.error("Error al actualizar la contraseña:", error);
        Swal.fire("Error", "No se pudo actualizar la contraseña.", "error");
    });
}

