import Fastify from 'fastify';
import axios from 'axios';
import { config } from 'dotenv';
import fastifyCors from 'fastify-cors';

// Cargar las variables de entorno desde el archivo .env
config();

const server = Fastify();

const CLIENT_ID = process.env.CLIENT_ID!;
const CLIENT_SECRET = process.env.CLIENT_SECRET!;
const REDIRECT_URI = process.env.REDIRECT_URI!;

// Habilitar CORS
server.register(fastifyCors);

// En tu servidor Fastify
server.get('/api/auth-url', async (request, reply) => {
  const CLIENT_ID = process.env.CLIENT_ID!;
  const REDIRECT_URI = process.env.REDIRECT_URI!;
  
  const AUTH_URL = `https://api.intra.42.fr/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;
  
  reply.send({ url: AUTH_URL });
});


// Ruta para manejar la autenticación
server.post('/api/auth', async (request, reply) => {
  const { code } = request.body as { code: string };

  if (!code) {
    return reply.status(400).send({ success: false, error: 'El código de autorización es requerido' });
  }

  try {
    // Realizamos la solicitud para obtener el access token usando el código de autorización
    const response = await axios.post('https://api.intra.42.fr/oauth/token', new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code: code,
      redirect_uri: REDIRECT_URI,
    }).toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    // Verifica la respuesta de la API de 42
    console.log('Respuesta de 42:', response.data);

    reply.send({ success: true, token: response.data });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error al obtener el token:', error.response?.data || error.message);
      return reply.status(500).send({ success: false, error: error.response?.data || error.message });
    } else {
      console.error('Error al obtener el token:', (error as Error).message);
      return reply.status(500).send({ success: false, error: (error as Error).message });
    }
  }
});

// Iniciar el servidor en el puerto 3000
server.listen({ port: 3000, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Servidor escuchando en ${address}`);
});
