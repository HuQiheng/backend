// Game.js
const server = require('http').createServer();
const io = require('socket.io')(server);

// Genero los conjuntos
const sids = new Map();
const rooms = new Map();

// Creates a room and returns a unique code to join it
function createRoom(socketId, room) {
  if (rooms.has(room)) {
    return 'Error: La sala ya existe';
  }
  rooms.set(room, new Set());
  rooms.get(room).add(socketId);
  
  const code = 3;
  // Crear la partida en la BD y el código que devuelva que sea el de acceso
  sids.set(socketId, { room, code });
  console.log(`Jugador ${socketId} creó la sala ${room} con código de acceso ${code}`);

  socketEmit(socketId, 'Codigo de acceso', code);
  socketBroadcastToOthers(socketId, 'Sala creada', room, code);

  return 'Sala creada con éxito';
}

// Función para unirse a una sala existente por codigo de invitacion
function joinRoom(socketId, room, code) {
  // Verifica si la sala existe y si el código es correcto
  let realRoom = [...rooms.keys()].find((r) => r === room);
  //let c = sids.get(socketId);
  let p = rooms.get(room);
  const pl = Array.from(p);
  let c = sids.get(pl[0]);
  if (realRoom && c && c.code == code) {
    rooms.get(room).add(socketId);
    sids.set(socketId, { room, code });
    console.log(`Jugador ${socketId} se conectó a la sala ${room}`);
    socketEmit(socketId, 'Acceso a sala', room);
    socketBroadcastToOthers(socketId, 'Jugador conectado', room, code);
  } else {
    console.log(`Jugador ${socketId} no pudo unirse a la sala ${room}`);
    socketEmit(socketId, 'Error de unión a la sala', room);
  }
}

// Función para salir de una sala
function leaveRoom(socketId) {
  const room = sids.get(socketId);
  if (room.room) {
    rooms.get(room.room).delete(socketId);
    sids.delete(socketId);
    console.log(`Jugador ${socketId} abandonó la sala ${room.room}`);
    socketEmit(socketId, 'Salida de sala', room.room);
    socketBroadcastToOthers(socketId, 'Jugador abandonó sala', room.room, room.code);
  }
}

// Envia mensaje a todos los sockets de la sala excepto al que lo envía
function socketBroadcastToOthers(socketId, event, room, data) {
  rooms.get(room).forEach((sid) => {
    if (sid !== socketId) {
      socketEmit(sid, event, data);
    }
  });
}

// Envio de mensajes individuales
function socketEmit(socketId, event, data) {
  console.log(`Emitiendo evento ${event} con código ${data} a ${socketId}`);

  io.to(socketId).emit(event, data);
}

// Conexion de un socket
io.on('connection', (socket) => {
    // Comprueba si el cliente está autenticado
    if (checkAuthenticated(socket.handshake.session)) {
        // Guarda el socketId en la sesión
        socket.handshake.session.socketId = socket.id;
        socket.handshake.session.save();

        // Crear sala
        socket.on('createRoom', (room) => createRoom(socket.id, room));

        // Unirse a sala
        socket.on('joinRoom', (room, code) => joinRoom(socket.id, room, code));

        // Salir de sala
        socket.on('leaveRoom', () => leaveRoom(socket.id));

        // Desconexion de un socket
        socket.on('disconnect', () => {
            console.log(`Jugador ${socket.id} desconectado`);
            leaveRoom(socket.id);
        });
    } else {
        // Si el cliente no está autenticado, desconéctalo
        socket.disconnect();
    }
});

module.exports = { createRoom, joinRoom, leaveRoom, rooms, server, io };
