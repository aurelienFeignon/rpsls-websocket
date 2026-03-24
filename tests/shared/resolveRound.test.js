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
});