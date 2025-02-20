require("dotenv").config(); // Cargar variables de entorno

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000; // Usar el puerto del .env o 3000 por defecto

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../front")));
app.use(express.urlencoded({ extended: true }));

app.use('/favicon.ico', express.static(path.join(__dirname, "../front/img/favicon_io/favicon.ico")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Importar rutas
const peliculasRoutes = require("./routes/peliculas");
const usuariosRoutes = require("./routes/usuarios");
const generosRoutes = require("./routes/generos");
const favoritosRoutes = require("./routes/favoritos");
const authRoutes = require("./routes/auth");
const recuperarPeliculasRoutes = require("./routes/recuperarPeliculas");

// Usar rutas
app.use("/peliculas", peliculasRoutes);
app.use("/usuarios", usuariosRoutes);
app.use("/generos", generosRoutes);
app.use("/favoritos", favoritosRoutes);
app.use("/auth", authRoutes);
app.use("/recuperar_peliculas", recuperarPeliculasRoutes);

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
