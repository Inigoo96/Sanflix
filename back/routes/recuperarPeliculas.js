const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// Obtener todas las películas eliminadas (sin `genero_id`)
router.get("/", async (req, res) => {
    try {
        const { rows } = await pool.query(`
            SELECT id, titulo, descripcion, anio, imagen_url, fecha_eliminacion
            FROM recuperar_peliculas
            ORDER BY titulo ASC;
        `);
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener las películas eliminadas:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

// Restaurar película eliminada
router.put("/:id", async (req, res) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const { id } = req.params;

        // Obtener detalles de la película eliminada (sin `genero_id`)
        const { rows: [pelicula] } = await client.query(
            "SELECT * FROM recuperar_peliculas WHERE id = $1",
            [id]
        );

        if (!pelicula) {
            await client.query("ROLLBACK");
            return res.status(404).json({ message: "Película no encontrada en la papelera" });
        }

        // Restaurar película en `peliculas` SIN `genero_id`
        const insertPeliculas = await client.query(`
            INSERT INTO peliculas (titulo, descripcion, anio, imagen_url)
            VALUES ($1, $2, $3, $4)
            RETURNING id;
        `, [pelicula.titulo, pelicula.descripcion, pelicula.anio, pelicula.imagen_url]);

        const nuevaPeliculaId = insertPeliculas.rows[0].id;

        // Obtener los géneros asociados en `recuperar_peliculas_generos`
        const generos = await client.query(`
            SELECT genero_id FROM recuperar_peliculas_generos WHERE pelicula_id = $1;
        `, [id]);

        // Insertar los géneros en `peliculas_generos`
        for (const genero of generos.rows) {
            await client.query(`
                INSERT INTO peliculas_generos (pelicula_id, genero_id)
                VALUES ($1, $2);
            `, [nuevaPeliculaId, genero.genero_id]);
        }

        // Eliminar la película de `recuperar_peliculas`
        await client.query("DELETE FROM recuperar_peliculas WHERE id = $1", [id]);

        // Eliminar géneros de `recuperar_peliculas_generos`
        await client.query("DELETE FROM recuperar_peliculas_generos WHERE pelicula_id = $1", [id]);

        await client.query("COMMIT");

        res.json({ message: "Película restaurada correctamente" });
        } catch (error) {
        await client.query("ROLLBACK");
        console.error("Error al restaurar película:", error);
        res.status(500).json({ message: "Error en el servidor" });
    } finally {
        client.release();
    }
});

module.exports = router;
