// Game.js
const io = require("socket.io")();

// Genero los conjuntos
const sids = new Map();
const rooms = new Map(); 

// Función para crear una sala y que el socket genere el codigo de invitación para que se lo pueda enviar a sus amigos
function createRoom(socketId, room) {
  if (!rooms.has(room)) {
    rooms.set(room, new Set());
  }
  rooms.get(room).add(socketId);
  //genera el código de invitación para unirse a la sala
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  sids.set(socketId, room, code);
  console.log(`Jugador ${socketId} creó la sala ${room} con código de acceso ${code}`);
  
  socketEmit(socketId, "Código de acceso", code);
  socketBroadcastToOthers(socketId, "Sala creada", room);
}

// Función para unirse a una sala existente por codigo de invitacion
function joinRoom(socketId, room, code) {
  if (rooms.has(room) && code === sids.get(socketId)) {
    rooms.get(room).add(socketId);
    sids.set(socketId, room, code);
    console.log(`Jugador ${socketId} se conectó a la sala ${room}`);
    socketEmit(socketId, "Acceso a sala", room);
    socketBroadcastToOthers(socketId, "Jugador conectado", room);
  } else {
    console.log(`Jugador ${socketId} no pudo unirse a la sala ${room}`);
    socketEmit(socketId, "Error de unión a la sala", room);
  }
}

// Función para salir de una sala
function leaveRoom(socketId) {
  const room = sids.get(socketId);
  if (room) {
    rooms.get(room).delete(socketId);
    sids.delete(socketId);
    console.log(`Jugador ${socketId} abandonó la sala ${room}`);
    socketEmit(socketId, "Salida de sala", room);
    socketBroadcastToOthers(socketId, "Jugador abandonó sala", room);
  }
}

// Envia mensaje a todos los sockets de la sala excepto al que lo envía
function socketBroadcastToOthers(socketId, event, room, data) {
  rooms.get(room).forEach(sid => {
    if (sid !== socketId) {
      socketEmit(sid, event, data);
    }
  });
}

// Envio de mensajes individuales
function socketEmit(socketId, event, data) {
  io.to(socketId).emit(event, data);
}

// Conexion de un socket
io.on("connection", socket => {
  // Crear sala
  socket.on("createRoom", room => createRoom(socket.id, room));
  
  // Unirse a sala
  socket.on("joinRoom", (room, code) => joinRoom(socket.id, room, code));
  
  // Salir de sala
  socket.on("leaveRoom", () => leaveRoom(socket.id));
  
  // Desconexion de un socket
  socket.on("disconnect", () => {
    console.log(`Jugador ${socket.id} desconectado`);
    leaveRoom(socket.id);
  });
}
);

module.exports = { createRoom, joinRoom, leaveRoom, rooms };

