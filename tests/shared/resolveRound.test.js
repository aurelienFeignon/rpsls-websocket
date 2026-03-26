import { describe, expect, it } from 'vitest';
import { resolveRound } from '../../packages/shared';

describe('resolveRound', () => {
    it('returns win when rock beats scissors', () => {
        const result = resolveRound('rock', 'scissors');

        expect(result).toEqual({
            outcome: 'win',
            rule: 'Rock crushes Scissors',
        });
    });

    it('returns lose when rock loses to paper', () => {
        const result = resolveRound('rock', 'paper');

        expect(result).toEqual({
            outcome: 'lose',
            rule: 'Paper covers Rock',
        });
    });

    it('returns draw when both players choose the same action', () => {
        const result = resolveRound('spock', 'spock');

        expect(result).toEqual({
            outcome: 'draw',
            rule: null,
        });
    });

    it('returns win with the correct rule for lizard vs spock', () => {
        const result = resolveRound('lizard', 'spock');

        expect(result).toEqual({
            outcome: 'win',
            rule: 'Lizard poisons Spock',
        });
    });

    it('returns lose with the correct rule for scissors vs spock', () => {
        const result = resolveRound('scissors', 'spock');

        expect(result).toEqual({
            outcome: 'lose',
            rule: 'Spock smashes Scissors',
        });
    });

    it('returns opposite outcomes for inverse actions', () => {
        const firstResult = resolveRound('paper', 'rock');
        const secondResult = resolveRound('rock', 'paper');

        expect(firstResult).toEqual({
            outcome: 'win',
            rule: 'Paper covers Rock',
        });

        expect(secondResult).toEqual({
            outcome: 'lose',
            rule: 'Paper covers Rock',
        });
    });

    it('returns null rule for every draw case', () => {
        const actions = ['rock', 'paper', 'scissors', 'lizard', 'spock'];

        actions.forEach((action) => {
            expect(resolveRound(action, action)).toEqual({
                outcome: 'draw',
                rule: null,
            });
        });
    });

    it('handles another valid matchup correctly', () => {
        expect(resolveRound('paper', 'spock')).toEqual({
            outcome: 'win',
            rule: 'Paper disproves Spock',
        });

        expect(resolveRound('spock', 'paper')).toEqual({
            outcome: 'lose',
            rule: 'Paper disproves Spock',
        });
    });
});