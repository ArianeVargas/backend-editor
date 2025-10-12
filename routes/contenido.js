import express from 'express';
import { pool } from '../db.js';

const router = express.Router();


router.post('/', async (req, res) => {
  try {
    const { html } = req.body;
    if (!html) return res.status(400).json({ error: 'El campo HTML es requerido' });

    await pool.query('INSERT INTO contenido (html) VALUES (?)', [html]);
    res.json({ message: 'Contenido guardado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al guardar el contenido' });
  }
});

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM contenido ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los contenidos' });
  }
});

export default router;
