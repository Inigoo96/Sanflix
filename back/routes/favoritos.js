const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// Agregar película a favoritos
router.post("/", async (req, res) => {
    const { id_usuario, id_peliculas } = req.body;

    if (!id_usuario || !id_peliculas) {
        return res.status(400).json({ success: false, message: "Faltan datos" });
    }

    try {
        // Verificar si ya está en favoritos
        const exists = await pool.query(
            "SELECT * FROM favoritos WHERE id_usuario = $1 AND id_peliculas = $2",
            [id_usuario, id_peliculas]
        );

        if (exists.rows.length > 0) {
            return res.status(400).json({ success: false, message: "Ya está en favoritos" });
        }

        // Insertar en favoritos
        const insertFavorite = await pool.query(
            "INSERT INTO favoritos (id_usuario, id_peliculas, fecha_agregado) VALUES ($1, $2, NOW()) RETURNING *",
            [id_usuario, id_peliculas]
        );

        res.json({ success: true, message: "Película añadida a favoritos", favorito: insertFavorite.rows[0] });

    } catch (error) {
        console.error("Error en el servidor:", error);
        res.status(500).json({ success: false, message: "Error en el servidor" });
    }
});

// Obtener favoritos de un usuario
router.get("/:id_usuario", async (req, res) => {
    const { id_usuario } = req.params;

    try {
        console.log("ID usuario recibido:", id_usuario); //Verifica si el ID es correcto
        const { rows } = await pool.query(
            `SELECT peliculas.id, peliculas.titulo, peliculas.descripcion, peliculas.anio, 
                    peliculas.imagen_url, 
                    ARRAY_AGG(genero.titulo) AS generos
             FROM favoritos
             JOIN peliculas ON favoritos.id_peliculas = peliculas.id
             JOIN peliculas_generos ON peliculas.id = peliculas_generos.pelicula_id
             JOIN genero ON peliculas_generos.genero_id = genero.id
             WHERE favoritos.id_usuario = $1
             GROUP BY peliculas.id`,
            [id_usuario]
        );

        res.json(rows);
    } catch (error) {
        console.error("Error al obtener favoritos:", error);
        res.status(500).json({ success: false, message: "Error en el servidor" });
    }
});

// Eliminar película de favoritos
router.delete("/", async (req, res) => {
    const { id_usuario, id_peliculas } = req.body;

    if (!id_usuario || !id_peliculas) {
        return res.status(400).json({ success: false, message: "Faltan datos" });
    }

    try {
        const deleteFavorite = await pool.query(
            "DELETE FROM favoritos WHERE id_usuario = $1 AND id_peliculas = $2 RETURNING *",
            [id_usuario, id_peliculas]
        );

        if (deleteFavorite.rowCount === 0) {
            return res.status(404).json({ success: false, message: "La película no estaba en favoritos" });
        }

        res.json({ success: true, message: "Película eliminada de favoritos" });
    } catch (error) {
        console.error("Error al eliminar de favoritos:", error);
        res.status(500).json({ success: false, message: "Error en el servidor" });
    }
});

module.exports = router;
