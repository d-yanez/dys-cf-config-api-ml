"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeliController = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const axios_1 = __importDefault(require("axios"));
const url_1 = require("url");
//fuente: https://www.mercadopago.cl/developers/es/reference/oauth/_oauth_token/post
const Param = mongoose_1.default.model('Param', new mongoose_1.default.Schema({
    name: String,
    type: String,
    value: String
}));
class MeliController {
    constructor() { }
    getToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validar API Key
                console.log("Validar API Key");
                const apiKey = req.headers['x-api-key'];
                if (!apiKey || apiKey !== process.env.API_KEY) {
                    console.log("api key no valida!!");
                    res.status(401).json({ success: false, responseCode: 2, message: 'API Key no valida' });
                }
                // Conexión a MongoDB y obtención del refreshToken
                console.log("Conexión a MongoDB y obtención del refreshToken");
                const param = yield Param.findOne({ name: 'code_tg', type: 'auth_ml' });
                if (!param) {
                    res.status(500).json({ success: false, responseCode: 1 });
                }
                //const refreshToken = param.value;
                const refreshToken = param === null || param === void 0 ? void 0 : param.value;
                console.log(`refreshToken: ${refreshToken}`);
                if (!refreshToken) {
                    // Si refreshToken es null o undefined, lanzar un error o manejarlo
                    res.status(400).json({ success: false, responseCode: 1, message: 'Refresh token no encontrado' });
                    console.log("Si refreshToken es null o undefined, lanzar un error o manejarlo");
                    return;
                }
                console.log("Preparar la solicitud a la API de Mercado Libre");
                // Preparar la solicitud a la API de Mercado Libre
                const body = new url_1.URLSearchParams({
                    grant_type: 'client_credentials',
                    client_id: process.env.API_ML_CLIENT_ID,
                    client_secret: process.env.API_ML_CLIENT_SECRET,
                    refresh_token: refreshToken
                });
                const meliResponse = yield axios_1.default.post('https://api.mercadolibre.com/oauth/token', body.toString());
                const accessToken = meliResponse.data.access_token;
                console.log(`accessToken: ${accessToken}`);
                // Respuesta con el token
                res.status(200).json({ token: accessToken, responseCode: 0 });
            }
            catch (error) {
                if (axios_1.default.isAxiosError(error) && error.response) {
                    // Aquí ya puedes acceder a error.response
                    console.error('Error en la respuesta de la API:', error.response.data);
                    res.status(500).json({ success: false, responseCode: 2, message: error.response.data });
                }
                else {
                    // Manejar otros errores
                    console.error('Error interno:', error);
                    res.status(500).json({ success: false, responseCode: 1, message: 'Error interno' });
                }
            }
        });
    }
}
exports.MeliController = MeliController;
