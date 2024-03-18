// Game.js
const io = require("socket.io")();

// Genero los conjuntos
const sids = new Map();
const rooms = new Map(); 

// Función para unirse a una sala
function joinRoom(socketId, room) {
  if (!sids.has(socketId)) {
    sids.set(socketId, new Set());
  }
  sids.get(socketId).add(room);
  if (!rooms.has(room)) {
    rooms.set(room, new Set());
  }
  rooms.get(room).add(socketId);
}

// Función para salir de una sala
function leaveRoom(socketId, room) {
  if (sids.has(socketId)) {
    sids.get(socketId).delete(room);
  }
  if (rooms.has(room)) {
    rooms.get(room).delete(socketId);
  }
}

io.on("connection", (socket) => {
    // Me uno a una única sala
    socket.on("joinRoom", (roomName) => {
      joinRoom(socket.id, roomName);
      console.log(`Socket ${socket.id} joined room ${roomName}`);
    });

    // Salir de una sala en específico
    socket.on("leaveRoom", (roomName) => {
        leaveRoom(socket.id, roomName);
        console.log(`Socket ${socket.id} left room ${roomName}`);
    });

    // Salir de todas las salas por desconexión
    socket.on("disconnect", () => {
        // Cojo todas las salas en la que está el cliente
        const rooms = sids.get(socket.id);
        if (rooms) {
            for (let room of rooms) {
                leaveRoom(socket.id, room);
            }
        }
    });
  });

  module.exports = { joinRoom, leaveRoom, rooms };