import { SERVER_EVENTS } from '@wooclap/shared';
import { socket } from './socket.js';
import { useGameStore } from '../store/useGameStore.js';

export function registerGameSocket() {
    socket.on(SERVER_EVENTS.ROOM_CREATED, ({ roomId }) => {
        useGameStore.getState().setRoomCreated(roomId);
        window.history.replaceState({}, '', `/?room=${roomId}`);
    });

    socket.on(SERVER_EVENTS.ROOM_JOINED, ({ roomId }) => {
        useGameStore.getState().setRoomJoined(roomId);
    });

    socket.on(SERVER_EVENTS.WAITING_FOR_OPPONENT, (payload) => {
        useGameStore.getState().setWaitingForOpponent(payload);
    });

    socket.on(SERVER_EVENTS.GAME_READY, () => {
        useGameStore.getState().setGameReady();
    });

    socket.on(SERVER_EVENTS.PLAYER_SELECTED, () => {
        // optionnel : rien à faire ici pour ce MVP
    });

    socket.on(SERVER_EVENTS.ROUND_RESULT, (payload) => {
        useGameStore.getState().setRoundResult(payload);
    });

    socket.on(SERVER_EVENTS.ROUND_RESET, () => {
        useGameStore.getState().resetRound();
    });

    socket.on(SERVER_EVENTS.ERROR, ({ message }) => {
        useGameStore.getState().setError(message);
    });

    return () => {
        socket.off(SERVER_EVENTS.ROOM_CREATED);
        socket.off(SERVER_EVENTS.ROOM_JOINED);
        socket.off(SERVER_EVENTS.WAITING_FOR_OPPONENT);
        socket.off(SERVER_EVENTS.GAME_READY);
        socket.off(SERVER_EVENTS.PLAYER_SELECTED);
        socket.off(SERVER_EVENTS.ROUND_RESULT);
        socket.off(SERVER_EVENTS.ROUND_RESET);
        socket.off(SERVER_EVENTS.ERROR);
    };
}