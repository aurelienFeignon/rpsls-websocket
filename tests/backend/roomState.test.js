import { beforeEach, describe, expect, it } from 'vitest';
import {
    rooms,
    createRoom,
    getRoom,
    addPlayerToRoom,
    removePlayerFromRoom,
    setRoomSelection,
    resetRoomSelections,
    resetRooms,
} from '../../apps/backend/src/game/roomState.js';

describe('roomState', () => {
    beforeEach(() => {
        resetRooms();
    });

    it('creates a room with the expected initial state', () => {
        const room = createRoom();

        expect(room).toEqual({
            id: room.id,
            playerOrder: [],
            selectionsBySocketId: {},
        });

        expect(typeof room.id).toBe('string');
        expect(room.id).toHaveLength(6);
        expect(getRoom(room.id)).toEqual(room);
    });

    it('creates unique room ids', () => {
        const roomA = createRoom();
        const roomB = createRoom();

        expect(roomA.id).not.toBe(roomB.id);
        expect(rooms.size).toBe(2);
    });

    it('adds up to two players in a room only', () => {
        const room = createRoom();

        expect(addPlayerToRoom(room.id, 'socket-1')).toEqual({
            ok: true,
            room,
        });

        expect(addPlayerToRoom(room.id, 'socket-2')).toEqual({
            ok: true,
            room,
        });

        expect(addPlayerToRoom(room.id, 'socket-3')).toEqual({
            ok: false,
            reason: 'Room is full',
        });

        expect(getRoom(room.id).playerOrder).toEqual(['socket-1', 'socket-2']);
    });

    it('returns an error when adding a player to an unknown room', () => {
        expect(addPlayerToRoom('UNKNOWN', 'socket-1')).toEqual({
            ok: false,
            reason: 'Room not found',
        });
    });

    it('does not duplicate the same player in a room', () => {
        const room = createRoom();

        addPlayerToRoom(room.id, 'socket-1');
        addPlayerToRoom(room.id, 'socket-1');

        expect(getRoom(room.id).playerOrder).toEqual(['socket-1']);
    });

    it('stores selections by socket id inside a room', () => {
        const room = createRoom();
        addPlayerToRoom(room.id, 'socket-1');
        addPlayerToRoom(room.id, 'socket-2');

        const didSetSelection = setRoomSelection(room.id, 'socket-1', 'rock');

        expect(didSetSelection).toBe(true);
        expect(getRoom(room.id).selectionsBySocketId).toEqual({
            'socket-1': 'rock',
        });
    });

    it('returns false when setting a selection on an unknown room', () => {
        const didSetSelection = setRoomSelection('UNKNOWN', 'socket-1', 'rock');

        expect(didSetSelection).toBe(false);
    });

    it('resets selections without removing players from the room', () => {
        const room = createRoom();
        addPlayerToRoom(room.id, 'socket-1');
        addPlayerToRoom(room.id, 'socket-2');
        setRoomSelection(room.id, 'socket-1', 'rock');
        setRoomSelection(room.id, 'socket-2', 'paper');

        resetRoomSelections(room.id);

        expect(getRoom(room.id).selectionsBySocketId).toEqual({});
        expect(getRoom(room.id).playerOrder).toEqual(['socket-1', 'socket-2']);
    });

    it('removes a player and their selection from the room', () => {
        const room = createRoom();
        addPlayerToRoom(room.id, 'socket-1');
        addPlayerToRoom(room.id, 'socket-2');
        setRoomSelection(room.id, 'socket-1', 'rock');

        removePlayerFromRoom(room.id, 'socket-1');

        expect(getRoom(room.id).playerOrder).toEqual(['socket-2']);
        expect(getRoom(room.id).selectionsBySocketId).toEqual({});
    });

    it('deletes the room when the last player leaves', () => {
        const room = createRoom();
        addPlayerToRoom(room.id, 'socket-1');

        removePlayerFromRoom(room.id, 'socket-1');

        expect(getRoom(room.id)).toBeNull();
        expect(rooms.size).toBe(0);
    });

    it('does nothing when removing a player from an unknown room', () => {
        expect(() => removePlayerFromRoom('UNKNOWN', 'socket-1')).not.toThrow();
    });

    it('does nothing when resetting selections on an unknown room', () => {
        expect(() => resetRoomSelections('UNKNOWN')).not.toThrow();
    });
});