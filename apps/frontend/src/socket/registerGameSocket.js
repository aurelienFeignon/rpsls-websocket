import { SERVER_EVENTS } from '@wooclap/shared';
import { socket } from './socket.js';
import { useGameStore } from '../store/useGameStore.js';

export function registerGameSocket() {
    socket.on('connect', () => {
        // volontairement vide pour ce MVP
    });

    socket.on(SERVER_EVENTS.WAITING_FOR_OPPONENT, (payload) => {
        useGameStore.getState().setWaitingForOpponent(payload);
    });

    socket.on(SERVER_EVENTS.GAME_READY, () => {
        useGameStore.getState().setGameReady();
    });

    socket.on(SERVER_EVENTS.PLAYER_SELECTED, () => {
        // l’état local est déjà passé en waiting-for-other-player
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
        socket.off('connect');
        socket.off(SERVER_EVENTS.WAITING_FOR_OPPONENT);
        socket.off(SERVER_EVENTS.GAME_READY);
        socket.off(SERVER_EVENTS.PLAYER_SELECTED);
        socket.off(SERVER_EVENTS.ROUND_RESULT);
        socket.off(SERVER_EVENTS.ROUND_RESET);
        socket.off(SERVER_EVENTS.ERROR);
    };
}