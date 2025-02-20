const jwt = require("jsonwebtoken");
const SECRET_KEY = "secreto"; //Cambia esto a una variable de entorno

function verificarToken(req, res, next) {
    console.log("Headers recibidos:", req.headers);

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        console.log("No se encontró el token en la cabecera.");
        return res.status(401).json({ success: false, message: "No autorizado, token no encontrado." });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded; // Guarda la info del usuario en `req.user`
        console.log("Usuario decodificado:", req.user);
        next();
    } catch (error) {
        console.log("Token inválido o expirado.");
        return res.status(401).json({ success: false, message: "Token inválido o expirado." });
    }
}

module.exports = verificarToken;
