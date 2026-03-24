import { beforeEach, describe, expect, it } from 'vitest';
import {
    addPlayer,
    getPlayers,
    getSelections,
    resetGameState,
    resetSelections,
    setSelection,
    removePlayer,
} from '../../apps/backend/src/game/gameState.js';

describe('gameState', () => {
    beforeEach(() => {
        resetGameState();
    });

    it('adds up to two players only', () => {
        expect(addPlayer('socket-1')).toBe(true);
        expect(addPlayer('socket-2')).toBe(true);
        expect(addPlayer('socket-3')).toBe(false);

        expect(getPlayers()).toEqual(['socket-1', 'socket-2']);
    });

    it('stores player selections', () => {
        addPlayer('socket-1');
        setSelection('socket-1', 'rock');

        expect(getSelections()).toEqual({
            'socket-1': 'rock',
        });
    });

    it('resets selections without removing players', () => {
        addPlayer('socket-1');
        addPlayer('socket-2');
        setSelection('socket-1', 'rock');
        setSelection('socket-2', 'paper');

        resetSelections();

        expect(getSelections()).toEqual({});
        expect(getPlayers()).toEqual(['socket-1', 'socket-2']);
    });

    it('removes a player and their selection on disconnect', () => {
        addPlayer('socket-1');
        addPlayer('socket-2');
        setSelection('socket-1', 'rock');

        removePlayer('socket-1');

        expect(getPlayers()).toEqual(['socket-2']);
        expect(getSelections()).toEqual({});
    });
});