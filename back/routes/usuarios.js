const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const verificarToken = require("../middlewares/authMiddleware");
const multer = require("multer");
const path = require("path");

//Configuración de almacenamiento para `multer`
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, "../uploads/"); // Asegura la ruta correcta
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        if (!file) {
            return cb(new Error("No se ha proporcionado ningún archivo"), null);
        }
        cb(null, `profile_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Formato de imagen no permitido. Solo JPG, PNG, GIF."), false);
    }
};

const upload = multer({ storage, fileFilter });

//Obtener datos del usuario autenticado
router.get("/me", verificarToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { rows } = await pool.query(
            "SELECT id, username, email, telefono, id_cuenta, imagen_perfil FROM usuarios WHERE id = $1",
            [userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ success: false, error: "Usuario no encontrado" });
        }

        res.json({ success: true, usuario: rows[0] });
    } catch (error) {
        console.error("Error al obtener usuario:", error);
        res.status(500).json({ success: false, error: "Error en el servidor" });
    }
});

//Actualizar datos del usuario autenticado
router.put("/me", verificarToken, async (req, res) => {
    console.log("Datos recibidos en el backend:", req.body);
    const userId = req.user.id;
    const { username, email, telefono } = req.body;

    try {
        let fields = [];
        let values = [];
        let index = 1;

        if (username) {
            fields.push(`username = $${index}`);
            values.push(username);
            index++;
        }
        if (email) {
            fields.push(`email = $${index}`);
            values.push(email);
            index++;
        }
        if (telefono) {
            fields.push(`telefono = $${index}`);
            values.push(telefono);
            index++;
        }

        if (values.length === 0) {
            return res.status(400).json({ success: false, error: "No se enviaron datos para actualizar." });
        }

        const query = `UPDATE usuarios SET ${fields.join(", ")} WHERE id = $${index} RETURNING id, username, email, telefono`;
        values.push(userId);

        const result = await pool.query(query, values);

        res.json({ success: true, message: "Perfil actualizado correctamente", usuario: result.rows[0] });
    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        res.status(500).json({ success: false, error: "Error en el servidor" });
    }
});

// **Actualizar imagen de perfil**
router.put("/me/imagen", verificarToken, upload.single("imagen"), async (req, res) => {
    console.log("Token recibido:", req.headers.authorization);
    const userId = req.user.id;

    let imagenFinal = null; // Inicializar como null

    // Si el usuario sube un archivo, se usa la imagen subida
    if (req.file) {
        imagenFinal = `http://127.0.0.1:3000/uploads/${req.file.filename}`;
    }
    
    // Si el usuario envía una URL, se usa la URL enviada (corrige el posible formato JSON incorrecto)
    else if (req.body && req.body.imagen_perfil) {
        try {
            imagenFinal = JSON.parse(req.body.imagen_perfil); // Intenta parsear si viene como JSON
        } catch (error) {
            imagenFinal = req.body.imagen_perfil; // Si no es JSON, úsala tal cual
        }

        imagenFinal = imagenFinal.trim(); // Eliminar espacios en blanco extra
    }

    // Si no hay imagen subida ni URL válida, se usa un avatar de DiceBear
    if (!imagenFinal || !imagenFinal.startsWith("http")) {
        imagenFinal = `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=User${userId}`;
    }

    try {
        const result = await pool.query(
            "UPDATE usuarios SET imagen_perfil = $1 WHERE id = $2 RETURNING id, username, imagen_perfil",
            [imagenFinal, userId]
        );

        res.json({ success: true, message: "Imagen de perfil actualizada", usuario: result.rows[0] });
    } catch (error) {
        console.error("Error al actualizar imagen de perfil:", error);
        res.status(500).json({ success: false, error: "Error en el servidor" });
    }
});

// Servir archivos estáticos desde `uploads/`
router.use("/uploads", express.static(path.join(__dirname, "../uploads/")));

// ACTUALIZAR CONTRASEÑA
router.put("/me/password", verificarToken, async (req, res) => {
    const userId = req.user.id;
    const { password } = req.body;

    if (!password || password.length < 0) {
        return res.status(400).json({ success: false, error: "La contraseña debe tener al menos 1 caracteres." });
    }

    try {
        await pool.query(
            "UPDATE usuarios SET password = $1 WHERE id = $2",
            [password, userId] //Se guarda en texto plano
        );

        res.json({ success: true, message: "Contraseña actualizada correctamente." });
    } catch (error) {
        console.error("Error al actualizar contraseña:", error);
        res.status(500).json({ success: false, error: "Error en el servidor" });
    }
});



//Cerrar sesión
router.post("/logout", (req, res) => {
    res.json({ success: true, message: "Sesión cerrada correctamente. Borra el token en el frontend." });
});

module.exports = router;
