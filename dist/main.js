"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const meliController_1 = require("./infrastructure/controllers/meliController");
const mongo_1 = require("./infrastructure/database/mongo");
//dotenv.config();
const app = (0, express_1.default)();
exports.app = app;
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
// Conectar a MongoDB
(0, mongo_1.connectMongo)();
// Ruta para obtener el token de Mercado Libre
//app.post('/auth/token', MeliController.getToken);
//app.post('/auth/token', (req, res) => MeliController.getToken(req, res));
//const meliController = new MeliController();
// Crear una instancia de MeliController
const meliController = new meliController_1.MeliController();
app.post('/auth/token', (req, res) => meliController.getToken(req, res));
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
