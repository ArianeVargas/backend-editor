import express from 'express';
import { pool } from '../elastic.js';

const router = express.Router();

// router.post('/', async (req, res) => {
//   try {
//     const { html } = req.body;
//     if (!html) return res.status(400).json({ error: 'El campo HTML es requerido' });

//     // PostgreSQL usa $1, $2, ...
//     await pool.query('INSERT INTO contenido (html) VALUES ($1)', [html]);
//     res.json({ message: 'Contenido guardado correctamente' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error al guardar el contenido' });
//   }
// });

// router.get('/', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT * FROM contenido ORDER BY id DESC');
//     res.json(result.rows);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error al obtener los contenidos' });
//   }
// });

// Guardar contenido
router.post('/', async (req, res) => {
  try {
    const { html } = req.body;
    if (!html) {
      return res.status(400).json({ error: 'HTML requerido' });
    }

    await esClient.index({
      index: 'contenidos',
      pipeline: 'limpiar_html',
      document: {
        html,
        creado_en: new Date()
      }
    });

    res.json({ message: 'Contenido guardado en Elastic Cloud' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al guardar contenido' });
  }
});

// Obtener contenidos
router.get('/', async (req, res) => {
  try {
    const result = await esClient.search({
      index: 'contenidos',
      size: 100,
      sort: [{ creado_en: 'desc' }]
    });

    const contenidos = result.hits.hits.map(hit => ({
      id: hit._id,
      ...hit._source
    }));

    res.json(contenidos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener contenidos' });
  }
});

export default router;
