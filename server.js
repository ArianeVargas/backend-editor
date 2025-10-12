import express from 'express';
import cors from 'cors';
import contenidoRoutes from './routes/contenido.js';
// import { pool } from './db.js';

const app = express();

app.use(cors());
app.use(express.json()); 

app.use('/api/contenido', contenidoRoutes);

// (async () => {
//   try {
//     const [rows] = await pool.query('SELECT 1 + 1 AS resultado');
//     console.log('✅ Conexión a MySQL exitosa. Resultado:', rows[0].resultado);

//     await pool.query("INSERT INTO contenido (html) VALUES ('<p>Prueba directa desde backend</p>')");
//     console.log('🧾 Registro de prueba insertado en la tabla "contenido".');
//   } catch (error) {
//     console.error('❌ Error al conectar o insertar en MySQL:', error);
//   }
// })();

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor backend corriendo en http://localhost:${PORT}`);
});
