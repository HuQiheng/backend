// Game.test.js
// importar Game
const { createRoom, joinRoom, leaveRoom, rooms } = require('./Game');
const { serverSocket, cleanUp } =  require('socket.io-client');

// Prueba crear sala
test('Crear sala', () => {
  const socketId = serverSocket;
  createRoom(socketId, 'sala1');
  expect(rooms.has('sala1')).toBe(true);
});

// Prueba unirse a sala
test('Unirse a una sala existente', () => {
  const socketId = serverSocket;
  joinRoom(socketId, 'sala1', 3);
  expect(rooms.get('sala1').has(socketId)).toBe(true);
});

// Prueba error al unirse a sala que no existe
test('Error al unirse a una sala que no existe', () => {
  const socketId = serverSocket;
  joinRoom(socketId, 'sala3', 'sala3');
  expect(rooms.has('sala3')).toBe(false);
});

// Prueba salir de una sala
test('Salir de una sala', () => {
  const socketId = serverSocket;
  leaveRoom(socketId);
  expect(rooms.get('sala1').has(socketId)).toBe(false);
});

// Limpiar variables globales
afterAll(() => {
  cleanUp;
});