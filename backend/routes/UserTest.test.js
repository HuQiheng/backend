const express = require('express');
const app = express();
// Importa el router que deseas probar
const userRoutes = require('../routes/userRoutes');
const request = require('supertest');
// Configura una ruta de prueba para verificar la autenticación
app.use('/test', userRoutes);
const jwt = require('jsonwebtoken');

// Datos simulados del usuario
const uId = '123'; // ID del usuario
const uEmail = 'test@example.com'; // Correo electrónico
const uName = 'John Doe'; // Nombre del usuario

// Generar el token
const secretKey = 'mi_clave_secreta'; // Clave secreta para pruebas
const t = jwt.sign({ sub: uId, email: uEmail, name: uName }, secretKey);

console.log('Token de prueba:', t);

describe('Pruebas de la API de autenticación de Google', () => {
  it('debería autenticar correctamente un token válido', async () => {
    const response = await request(app)
      .post('/test/auth')
      .send({ token: t });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(uName); 
  }, 10000);

  it('debería devolver un error para un token inválido', async () => {
    const invalidToken = 'token_invalido'; // Reemplaza con un token inválido
    const response = await request(app)
      .post('/test/auth')
      .send({ token: invalidToken });

    expect(response.status).toBe(401);
  });

  it('debería obtener la información del usuario autenticado', async () => {
    const userId = uId; // Reemplaza con el ID correcto
    const response = await request(app)
      .get(`/test/users/${userId}`)
      .set('Authorization', t); // Reemplaza con un token válido

    expect(response.status).toBe(200);
    expect(response.body.email).toBe(uEmail); // Reemplaza con el correo correcto
    // Agrega más expectativas según tus necesidades
  });
});

