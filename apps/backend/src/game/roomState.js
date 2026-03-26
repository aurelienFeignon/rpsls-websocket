import { generateRoomId } from './roomId.js';

export const rooms = new Map();

export function createRoom() {
    let roomId = generateRoomId();

    while (rooms.has(roomId)) {
        roomId = generateRoomId();
    }

    const room = {
        id: roomId,
        playerOrder: [],
        selectionsBySocketId: {},
    };

    rooms.set(roomId, room);

    return room;
}

export function getRoom(roomId) {
    return rooms.get(roomId) ?? null;
}

export function deleteRoom(roomId) {
    rooms.delete(roomId);
}

export function addPlayerToRoom(roomId, socketId) {
    const room = getRoom(roomId);

    if (!room) {
        return { ok: false, reason: 'Room not found' };
    }

    if (room.playerOrder.length >= 2) {
        return { ok: false, reason: 'Room is full' };
    }

    if (!room.playerOrder.includes(socketId)) {
        room.playerOrder.push(socketId);
    }

    return { ok: true, room };
}

export function removePlayerFromRoom(roomId, socketId) {
    const room = getRoom(roomId);

    if (!room) {
        return;
    }

    room.playerOrder = room.playerOrder.filter((id) => id !== socketId);
    delete room.selectionsBySocketId[socketId];

    if (room.playerOrder.length === 0) {
        deleteRoom(roomId);
    }
}

export function setRoomSelection(roomId, socketId, action) {
    const room = getRoom(roomId);

    if (!room) {
        return false;
    }

    room.selectionsBySocketId[socketId] = action;
    return true;
}

export function resetRoomSelections(roomId) {
    const room = getRoom(roomId);

    if (!room) {
        return;
    }

    room.selectionsBySocketId = {};
}

export function resetRooms() {
    rooms.clear();
}