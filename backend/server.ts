import Fastify from 'fastify';
import axios from 'axios';
import { config } from 'dotenv';
import fastifyCors from 'fastify-cors';

// Cargar las variables de entorno desde el archivo .env
config();

const server = Fastify();

// Habilitar CORS
server.register(fastifyCors);

// En tu servidor Fastify
server.get('/api/auth-url', async (request, reply) => {
  const CLIENT_ID = process.env.CLIENT_ID!;
  const REDIRECT_URI = process.env.REDIRECT_URI!;
  
  const AUTH_URL = `https://api.intra.42.fr/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&prompt=login&scope=public`;
  reply.raw.setHeader('Set-Cookie', 'session=your_token; HttpOnly; Path=/; SameSite=Lax;');
  reply.send({ url: AUTH_URL });
});

// Obtener la información del usuario

/* server.get('/api/user-info', async (request, reply) => {
  const { token } = request.query as { token: string };

  if (!token)
    return reply.status(400).send({ success: false, error: 'El token de acceso es requerido' });

  try {
    const response = await axios.get('https://api.intra.42.fr/v2/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    reply.send({ success: true, user: response.data });
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
    return reply.status(500).send({ success: false, error: 'Error al obtener la información del usuario' });
  }
}); */

// Ruta para manejar la autenticación
server.post('/api/auth', async (req, res) => {
  const { code } = req.body as { code: string };
  if (!code) {
    return res.status(400).send({ success: false, error: 'Código de autorización faltante' });
  }
  try {
    const response = await fetch('https://api.intra.42.fr/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code,
        redirect_uri: 'http://127.0.0.1:5500/frontend/index.html',
      }),
    });
    const data = await response.json();
    // Actualiza la respuesta de la API para que solo se envíe el token
if (data.access_token) {
  res.send({ success: true, token: { access_token: data.access_token } }); // Solo el token
} else {
  res.status(400).send({ success: false, error: data.error_description || 'Error al obtener el token' });
}

  } catch (err) {
    console.error('Error al obtener el token:', err);
    res.status(500).send({ success: false, error: 'Error interno del servidor' });
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
