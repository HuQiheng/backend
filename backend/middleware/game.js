// Game.js
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
  p = rooms.get(room);
  const pl = Array.from(p);
  c = sids.get(pl[0]);
  s = p.size;
  if (realRoom && c && c.code == code && s < 4) {
    rooms.get(room).add(socketId);
    sids.set(socketId, { room, code });
    p = rooms.get(room);
    const pl1 = Array.from(p);
    console.log(`Jugador ${socketId} se conectó a la sala ${room}`);
    socketEmit(socketId, 'Acceso a sala', room);
    socketBroadcastToOthers(socketId, 'Jugador conectado', room, code);
    //Notificar jugadores dentro de la sala
    socketBroadcast(socketId, 'Jugadores conectados', room, code, pl1);
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

// Envio de mensajes a todos los sockets de la sala
function socketBroadcast(socketId, event, room, data, players) {
  rooms.get(room).forEach((sid) => {
      emit(sid, event, room, data, players);
  });
}

function emit(socketId, event, room, data, players) {
  console.log(`Emitiendo evento ${event} a la sala ${room}: ${players} con código ${data} a ${socketId}`);
  io.to(socketId).emit(event, data, players);
}

// Funcion para iniciar partida en una sala
function startGame(socketId, room) {
  const p = rooms.get(room);
  const pl = Array.from(p);
  console.log(`Iniciando partida en la sala ${room}`);
  socketBroadcast(socketId, 'Iniciar partida', room, pl);
  return 'Partida iniciada';
}

module.exports = { createRoom, joinRoom, leaveRoom, startGame, rooms};
