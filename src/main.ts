import express from 'express';
import { MeliController } from './infrastructure/controllers/meliController';
import { connectMongo } from './infrastructure/database/mongo';
import dotenv from 'dotenv';

//dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Conectar a MongoDB
connectMongo();

// Ruta para obtener el token de Mercado Libre
//app.post('/auth/token', MeliController.getToken);
//app.post('/auth/token', (req, res) => MeliController.getToken(req, res));
//const meliController = new MeliController();


// Crear una instancia de MeliController
const meliController = new MeliController();

app.post('/auth/token', (req, res) => meliController.getToken(req, res));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export { app }; // Asegúrate de exportar la función