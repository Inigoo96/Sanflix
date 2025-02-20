const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt"); // Opcional para futuras mejoras

const SECRET_KEY = "secreto"; //Cambia esto a una variable de entorno en producción

const verificarToken = require("../middlewares/authMiddleware"); // Asegurar que se importe

router.get("/usuarios/me", verificarToken, async (req, res) => {
    try {
        const { id } = req.user; // Extraemos el ID del usuario desde el token

        const result = await pool.query("SELECT id, username, email, telefono FROM usuarios WHERE id = $1", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Usuario no encontrado" });
        }

        res.json({ success: true, usuario: result.rows[0] });
    } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
        res.status(500).json({ success: false, message: "Error en el servidor" });
    }
});


//Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ success: false, message: "Usuario no encontrado" });
        }

        const user = result.rows[0];

        if (user.password !== password) {
            return res.status(401).json({ success: false, message: "Contraseña incorrecta" });
        }

        // Generar token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, id_cuenta: user.id_cuenta },
                SECRET_KEY,
            { expiresIn: "1h" }
        );
        console.log("Token generado:", token);

        return res.json({
            success: true,
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                telefono: user.telefono,
                id_cuenta: user.id_cuenta
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error en el servidor" });
    }
});

//Registro de usuario (Mejorado)
// Registro de usuario con generación de token
router.post("/register", async (req, res) => {
    const { username, email, password, telefono } = req.body;

    if (!username || !email || !password || !telefono) {
        return res.status(400).json({ success: false, message: "Todos los campos son obligatorios" });
    }

    try {
        // Verificar si el email ya está registrado
        const userExists = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ success: false, message: "El email ya está registrado" });
        }

        // Encriptar la contraseña (para futuras mejoras con bcrypt)
        // const hashedPassword = await bcrypt.hash(password, 10);
        const hashedPassword = password;

        // Insertar usuario en la base de datos
        const newUser = await pool.query(
            "INSERT INTO usuarios (username, email, password, telefono) VALUES ($1, $2, $3, $4) RETURNING id, username, email, telefono",
            [username, email, hashedPassword, telefono]
        );

        // Generar token JWT
        const token = jwt.sign(
            { id: newUser.rows[0].id, email: newUser.rows[0].email },
            SECRET_KEY,
            { expiresIn: "1h" } // Token válido por 1 hora
        );

        console.log("Token generado en el registro:", token);

        // Enviar respuesta con el usuario y el token
        res.json({
            success: true,
            message: "Usuario registrado con éxito",
            token,  //Ahora enviamos el token al frontend
            user: newUser.rows[0]
        });

    } catch (error) {
        console.error("Error en el registro:", error);
        res.status(500).json({ success: false, message: "Error en el servidor" });
    }
});

//Verificar Email
router.post("/verificar-email", async (req, res) => {
    const { email } = req.body;

    try {
        const result = await pool.query("SELECT email FROM usuarios WHERE email = $1", [email]);

        res.json({ existe: result.rows.length > 0 });
    } catch (error) {
        console.error("Error al verificar el email:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
});

module.exports = router;
