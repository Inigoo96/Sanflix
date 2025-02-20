const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// Obtener todas las películas con su género
router.get("/", async (req, res) => {
    try {
        const query = `
            SELECT p.id, p.titulo, p.descripcion, p.anio, p.imagen_url,
                   COALESCE(json_agg(DISTINCT g.titulo) FILTER (WHERE g.titulo IS NOT NULL), '[]') AS generos
            FROM peliculas p
            LEFT JOIN peliculas_generos pg ON p.id = pg.pelicula_id
            LEFT JOIN genero g ON pg.genero_id = g.id
            GROUP BY p.id;
        `;
        const { rows } = await pool.query(query);
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener películas:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});



// Obtener película por ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
            SELECT p.id, p.titulo, p.descripcion, p.anio, p.imagen_url,
                   COALESCE(json_agg(DISTINCT g.titulo) FILTER (WHERE g.titulo IS NOT NULL), '[]') AS generos
            FROM peliculas p
            LEFT JOIN peliculas_generos pg ON p.id = pg.pelicula_id
            LEFT JOIN genero g ON pg.genero_id = g.id
            WHERE p.id = $1
            GROUP BY p.id;
        `;
        const { rows } = await pool.query(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Película no encontrada" });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error("Error al obtener película:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});



// Obtener películas por género
router.get("/genero/:genero", async (req, res) => {
    try {
        const { genero } = req.params;
        const query = `
            SELECT p.id, p.titulo, p.descripcion, p.anio, p.imagen_url,
                   COALESCE(json_agg(g.titulo) FILTER (WHERE g.titulo IS NOT NULL), '[]') AS generos
            FROM peliculas p
            LEFT JOIN peliculas_generos pg ON p.id = pg.pelicula_id
            LEFT JOIN genero g ON pg.genero_id = g.id
            WHERE g.titulo = $1
            GROUP BY p.id;
        `;
        const { rows } = await pool.query(query, [genero]);
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener películas por género:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});


// Añadir nueva película
router.post("/", async (req, res) => {
    try {
        const { titulo, descripcion, anio, imagen_url, generos } = req.body;

        // Insertar película en la tabla principal
        const insertMovieQuery = `
            INSERT INTO peliculas (titulo, descripcion, anio, imagen_url)
            VALUES ($1, $2, $3, $4) RETURNING id;
        `;
        const { rows } = await pool.query(insertMovieQuery, [titulo, descripcion, anio, imagen_url]);
        const peliculaId = rows[0].id;

        // Insertar géneros en la tabla intermedia
        for (const generoId of generos) {
            await pool.query(
                "INSERT INTO peliculas_generos (pelicula_id, genero_id) VALUES ($1, $2);",
                [peliculaId, generoId]
            );
        }

        res.status(201).json({ success: true, message: "Película añadida correctamente", peliculaId });
    } catch (error) {
        console.error("Error al añadir película:", error);
        res.status(500).json({ success: false, message: "Error en el servidor" });
    }
});


// Modificar película (actualización parcial)
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, descripcion, anio, imagen_url, generos } = req.body;

        console.log("Datos recibidos en el backend:", req.body); // 🔍 Verificar qué llega

        // Actualizar película en la tabla principal
        const updateMovieQuery = `
            UPDATE peliculas SET titulo = $1, descripcion = $2, anio = $3, imagen_url = $4
            WHERE id = $5 RETURNING *;
        `;
        const values = [titulo, descripcion || "", anio, imagen_url || "", id]; // 🛠️ Asegurar que no haya null

        const result = await pool.query(updateMovieQuery, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Película no encontrada" });
        }

        //**Evitar el error cuando `generos` no está en la petición**
        if (Array.isArray(generos) && generos.length > 0) {
            // Eliminar géneros actuales
            await pool.query("DELETE FROM peliculas_generos WHERE pelicula_id = $1;", [id]);

            // Insertar nuevos géneros
            for (const generoId of generos) {
                await pool.query(
                    "INSERT INTO peliculas_generos (pelicula_id, genero_id) VALUES ($1, $2);",
                    [id, generoId]
                );
            }
        }

        res.json({ message: "Película modificada correctamente" });
    } catch (error) {
        console.error("Error al modificar película:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});



// Modificar el endpoint DELETE para mover la película a recuperar_peliculas
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar si la película existe
        const { rows } = await pool.query("SELECT * FROM peliculas WHERE id = $1", [id]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "Película no encontrada" });
        }

        const pelicula = rows[0];

        console.log("Moviendo película:", pelicula); //Log para depurar

        // Insertar en recuperar_peliculas
        const insertQuery = `
            INSERT INTO recuperar_peliculas (titulo, descripcion, anio, genero_id, imagen_url)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const insertValues = [pelicula.titulo, pelicula.descripcion, pelicula.anio, pelicula.genero_id, pelicula.imagen_url];

        const insertResult = await pool.query(insertQuery, insertValues);
        console.log("Película movida a recuperar_peliculas:", insertResult.rows[0]); //Log para depurar

        // Eliminar de peliculas
        await pool.query("DELETE FROM peliculas WHERE id = $1", [id]);

        res.json({ success: true, message: "Película movida a la papelera" });

    } catch (error) {
        console.error("Error al mover la película a la papelera:", error);
        res.status(500).json({ success: false, message: "Error en el servidor" });
    }
});

module.exports = router;