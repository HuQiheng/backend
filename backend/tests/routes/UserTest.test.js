
const express = require('express');
const app = express();
// Importa el router que deseas probar
const userRoutes = require('../../routes/userRoutes');
const request = require('supertest');
// Configura una ruta de prueba para verificar la autenticación
app.use('/test', userRoutes);

const t = process.env.TOKEN_PRUEBA; // Use the existing token
describe('Pruebas de la API de autenticación de Google', () => {
  it('debería autenticar correctamente un token válido', async () => {
    const response = await request(app)
      .post('/backend/app.js')
      .send({ token: t });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(uName); 
  }, 10000);

  it('debería devolver un error para un token inválido', async () => {
    const invalidToken = 'token_invalido'; // Reemplaza con un token inválido
    const response = await request(app)
      .post('/backend/app.js')
      .send({ token: invalidToken });

    expect(response.status).toBe(401);
  }, 10000);

  /*it('debería obtener la información del usuario autenticado', async () => {
    const userId = uId; // Reemplaza con el ID correcto
    const response = await request(app)
      .get(`/test/users/${userId}`)
      .set('Authorization', t); // Reemplaza con un token válido

    expect(response.status).toBe(200);
    expect(response.body.email).toBe(uEmail); // Reemplaza con el correo correcto
    // Agrega más expectativas según tus necesidades
  }, 10000);*/
});