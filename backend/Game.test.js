// chat.test.js
// importar createGame
const { joinRoom, leaveRoom, rooms } = require('./Game');
const { serverSocket, cleanUp } =  require('socket.io-client');

// Prueba la función joinRoom
test('joinRoom should add socket to the room', () => {
  const socketId = 'socket123';
  const roomName = 'mi-sala';

  joinRoom(socketId, roomName);

  // Verifica que el socket se haya unido a la sala
  expect([...rooms.get(roomName)]).toContain(socketId);
});

// Prueba la función leaveRoom
test('leaveRoom should remove socket from the room', () => {
  const socketId = 'socket123';
  const roomName = 'mi-sala';

  leaveRoom(socketId, roomName);

  // Verifica que el socket se haya salido de la sala
  expect([...rooms.get(roomName)]).not.toContain(socketId);
});
