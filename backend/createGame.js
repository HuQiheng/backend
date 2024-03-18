// Importar el módulo de Socket.IO
const io = require("socket.io")();

// Crear un objeto para almacenar las relaciones entre los sockets y las salas
const sids = new Map(); // Map<SocketId, Set<Room>>
const rooms = new Map(); // Map<Room, Set<SocketId>>

// Función para unirse a una sala
function joinRoom(socketId, room) {
  // Agregar la sala al conjunto identificado por el ID del socket
  if (!sids.has(socketId)) {
    sids.set(socketId, new Set());
  }
  sids.get(socketId).add(room);

  // Agregar el ID del socket al conjunto identificado por el nombre de la sala
  if (!rooms.has(room)) {
    rooms.set(room, new Set());
  }
  rooms.get(room).add(socketId);
}

// Función para salir de una sala
function leaveRoom(socketId, room) {
  // Eliminar la sala del conjunto identificado por el ID del socket
  if (sids.has(socketId)) {
    sids.get(socketId).delete(room);
  }

  // Eliminar el ID del socket del conjunto identificado por el nombre de la sala
  if (rooms.has(room)) {
    rooms.get(room).delete(socketId);
  }
}

// Inicializo a valores de pruebas
const socketId1 = "socket123";
const socketId2 = "socket456";
const roomName = "mi-sala";
const roomName1 = "mi-sala1";

// Me uno a las salas
joinRoom(socketId1, roomName);
joinRoom(socketId2, roomName);
joinRoom(socketId1, roomName1);

// Muestro los conjuntos
console.log(sids);
console.log("-----------------");
console.log(rooms);

// Salgo de la sala
leaveRoom(socketId1, roomName);

// Muestro los conjuntos
console.log(sids);
console.log("-----------------");
console.log(rooms);
