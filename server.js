import express from 'express';
import cors from 'cors';
import contenidoRoutes from './routes/contenido.js';

const app = express();

app.use(cors());
app.use(express.json()); 

app.use('/api/contenido', contenidoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
