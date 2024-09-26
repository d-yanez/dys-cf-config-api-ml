import { Request, Response } from 'express';
import mongoose from 'mongoose';
import axios from 'axios';
import { URLSearchParams } from 'url';
//fuente: https://www.mercadopago.cl/developers/es/reference/oauth/_oauth_token/post

const Param = mongoose.model('Param', new mongoose.Schema({
  name: String,
  type: String,
  value: String
}));

export class MeliController {
    constructor() {}

    async getToken(req: Request, res: Response): Promise<void> {
        try {
        // Validar API Key
        console.log("Validar API Key")
        const apiKey = req.headers['x-api-key'];
        if (!apiKey || apiKey !== process.env.API_KEY) {
            console.log("api key no valida!!")
            res.status(401).json({ success: false, responseCode: 2,message: 'API Key no valida' });
        }

        // Conexión a MongoDB y obtención del refreshToken
        console.log("Conexión a MongoDB y obtención del refreshToken")
        const param = await Param.findOne({ name: 'code_tg', type: 'auth_ml' });
        if (!param) {
            res.status(500).json({ success: false, responseCode: 1 });
        }
        //const refreshToken = param.value;
        const refreshToken = param?.value;
        console.log(`refreshToken: ${refreshToken}`)
        if (!refreshToken) {
            // Si refreshToken es null o undefined, lanzar un error o manejarlo
            res.status(400).json({ success: false, responseCode: 1, message: 'Refresh token no encontrado' });
            console.log("Si refreshToken es null o undefined, lanzar un error o manejarlo")
            return;
          }
        console.log("Preparar la solicitud a la API de Mercado Libre")
        // Preparar la solicitud a la API de Mercado Libre
        const body = new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: process.env.API_ML_CLIENT_ID!,
            client_secret: process.env.API_ML_CLIENT_SECRET!,
            refresh_token: refreshToken as string
        });

        const meliResponse = await axios.post('https://api.mercadolibre.com/oauth/token', body.toString());
        const accessToken = meliResponse.data.access_token;
        console.log(`accessToken: ${accessToken}`)
        // Respuesta con el token
         res.status(200).json({ token: accessToken, responseCode: 0 });

        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
            // Aquí ya puedes acceder a error.response
            console.error('Error en la respuesta de la API:', error.response.data);
            res.status(500).json({ success: false, responseCode: 2, message: error.response.data });
            } else {
            // Manejar otros errores
            console.error('Error interno:', error);
            res.status(500).json({ success: false, responseCode: 1, message: 'Error interno' });
            }
        }
    }
}
