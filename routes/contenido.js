import express from 'express';
import { pool } from '../db.js';
import { esClient } from '../elastic.js';

const router = express.Router();

// Guardar contenido
// router.post('/', async (req, res) => {
//   try {
//     const { html } = req.body;
//     if (!html) {
//       return res.status(400).json({ error: 'HTML requerido' });
//     }

//     await esClient.index({
//       index: 'contenidos',
//       pipeline: 'limpiar_html',
//       document: {
//         html,
//         creado_en: new Date()
//       }
//     });

//     res.json({ message: 'Contenido guardado en Elastic Cloud' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error al guardar contenido' });
//   }
// });

// // Obtener contenidos
// router.get('/', async (req, res) => {
//   try {
//     const result = await esClient.search({
//       index: 'contenidos',
//       size: 100,
//       sort: [{ creado_en: 'desc' }]
//     });

//     const contenidos = result.hits.hits.map(hit => ({
//       id: hit._id,
//       ...hit._source
//     }));

//     res.json(contenidos);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error al obtener contenidos' });
//   }
// });

// Guardar contenido
router.post('/', async (req, res) => {
  const client = await pool.connect();

  try {
    const { html } = req.body;
    if (!html) {
      return res.status(400).json({ error: 'HTML requerido' });
    }

    // 1️⃣ Guardar en DB
    const insertQuery = `
      INSERT INTO contenido (html, creado_en)
      VALUES ($1, NOW())
      RETURNING id, creado_en
    `;

    const { rows } = await client.query(insertQuery, [html]);
    const contenido = rows[0];

    // 2️⃣ Replicar en Elasticsearch (NO bloqueante)
    esClient.index({
      index: 'contenidos',
      id: contenido.id.toString(), // mismo ID que la DB
      pipeline: 'limpiar_html',
      document: {
        html,
        creado_en: contenido.creado_en
      }
    }).catch(err => {
      console.error('❌ Error indexando en Elasticsearch:', err);
    });

    // 3️⃣ Responder al frontend
    res.json({
      message: 'Contenido guardado correctamente',
      id: contenido.id
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al guardar contenido' });
  } finally {
    client.release();
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

    res.json(result.hits.hits.map(hit => ({
      id: hit._id,
      ...hit._source
    })));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener contenidos' });
  }
});

export default router;
