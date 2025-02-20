const express = require("express");
const router = express.Router();
const pool = require("../config/db");

//Obtener todos los géneros con ID y título (para buscar el ID de un género)
router.get("/", async (req, res) => {
    try {
        const { rows } = await pool.query("SELECT id, titulo FROM genero ORDER BY titulo");
        res.json(rows); // Enviar [{id: 1, titulo: "Acción"}, {id: 2, titulo: "Comedia"}]
    } catch (error) {
        console.error("Error al obtener géneros:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
});

//Obtener solo los títulos de los géneros (para llenar el <select>)
router.get("/titulos", async (req, res) => {
    try {
        const { rows } = await pool.query("SELECT titulo FROM genero ORDER BY titulo");
        const titulos = rows.map(row => row.titulo);
        res.json(titulos); // Enviar ["Acción", "Comedia", "Terror"]
    } catch (error) {
        console.error("Error al obtener títulos de géneros:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
});

// Crear un nuevo género
router.post("/", async (req, res) => {
    const { titulo } = req.body;

    if (!titulo) {
        return res.status(400).json({ error: "El título del género es obligatorio" });
    }

    try {
        const resultado = await pool.query(
            "INSERT INTO genero (titulo) VALUES ($1) RETURNING *",
            [titulo]
        );
        res.status(201).json(resultado.rows[0]);
    } catch (error) {
        console.error("Error al insertar género:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
});

module.exports = router;
