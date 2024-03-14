// userRoutes.test.js

const express = require('express');
const request = require('supertest'); // Importa supertest para simular peticiones HTTP
const app = express();

// Importa el archivo userRoutes.js
const userRoutes = require('../../routes/userRoutes');

describe('userRoutes', () => {
  it('debería autenticar al usuario correctamente', async () => {
    // Simula una solicitud POST a /auth con un token válido
    const response = await request(app)
      .post('/auth')
      .send({ token: 'tu_token_de_prueba' });

    // Verifica que la respuesta sea exitosa (código 200) y contenga la información del usuario
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('email');
    expect(response.body).toHaveProperty('image');
  });
});
