import { create } from 'zustand';
import { GAME_PHASES } from '@wooclap/shared';

export const useGameStore = create((set) => ({
    phase: GAME_PHASES.CONNECTING,
    roomId: null,
    invitationLink: null,
    playerId: null,
    selectedAction: null,
    roundResult: null,
    errorMessage: null,

    setRoomCreated: (roomId) =>
        set(() => ({
            roomId,
            invitationLink: `${window.location.origin}/?room=${roomId}`,
            errorMessage: null,
        })),

    setRoomJoined: (roomId) =>
        set(() => ({
            roomId,
            invitationLink: `${window.location.origin}/?room=${roomId}`,
            errorMessage: null,
        })),

    setWaitingForOpponent: ({ playerId } = {}) =>
        set((state) => ({
            phase: GAME_PHASES.WAITING_FOR_OPPONENT,
            playerId: playerId ?? state.playerId,
            selectedAction: null,
            roundResult: null,
            errorMessage: null,
        })),

    setGameReady: () =>
        set(() => ({
            phase: GAME_PHASES.CHOOSING,
            selectedAction: null,
            roundResult: null,
            errorMessage: null,
        })),

    setSelectedAction: (action) =>
        set(() => ({
            selectedAction: action,
            phase: GAME_PHASES.WAITING_FOR_OTHER_PLAYER,
            errorMessage: null,
        })),

    setRoundResult: (result) =>
        set(() => ({
            phase: GAME_PHASES.ROUND_RESULT,
            roundResult: result,
            errorMessage: null,
        })),

    resetRound: () =>
        set(() => ({
            phase: GAME_PHASES.CHOOSING,
            selectedAction: null,
            roundResult: null,
            errorMessage: null,
        })),

    setError: (message) =>
        set(() => ({
            errorMessage: message,
        })),
}));