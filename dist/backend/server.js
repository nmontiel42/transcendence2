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
const fastify_1 = __importDefault(require("fastify"));
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = require("dotenv");
const fastify_cors_1 = __importDefault(require("fastify-cors"));
// Cargar las variables de entorno desde el archivo .env
(0, dotenv_1.config)();
const server = (0, fastify_1.default)();
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
// Habilitar CORS
server.register(fastify_cors_1.default);
// En tu servidor Fastify
server.get('/api/auth-url', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const CLIENT_ID = process.env.CLIENT_ID;
    const REDIRECT_URI = process.env.REDIRECT_URI;
    const AUTH_URL = `https://api.intra.42.fr/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&prompt=login&scope=public`;
    reply.raw.setHeader('Set-Cookie', 'session=your_token; HttpOnly; Path=/; SameSite=Lax;');
    reply.send({ url: AUTH_URL });
}));
server.get('/api/user-info', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = request.query;
    if (!token)
        return reply.status(400).send({ success: false, error: 'El token de acceso es requerido' });
    try {
        const response = yield axios_1.default.get('https://api.intra.42.fr/v2/me', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        reply.send({ success: true, user: response.data });
    }
    catch (error) {
        console.error('Error al obtener el usuario:', error);
        return reply.status(500).send({ success: false, error: 'Error al obtener la información del usuario' });
    }
}));
// Ruta para manejar la autenticación
server.post('/api/auth', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { code } = req.body;
    if (!code) {
        return res.status(400).send({ success: false, error: 'Código de autorización faltante' });
    }
    try {
        const response = yield fetch('https://api.intra.42.fr/oauth/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                grant_type: 'authorization_code',
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
                code,
                redirect_uri: 'http://localhost:3000/callback',
            }),
        });
        const data = yield response.json();
        if (data.access_token) {
            res.send({ success: true, token: data });
        }
        else {
            res.status(400).send({ success: false, error: data.error_description || 'Error al obtener el token' });
        }
    }
    catch (err) {
        console.error('Error al obtener el token:', err);
        res.status(500).send({ success: false, error: 'Error interno del servidor' });
    }
}));
// Iniciar el servidor en el puerto 3000
server.listen({ port: 3000, host: '0.0.0.0' }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Servidor escuchando en ${address}`);
});
