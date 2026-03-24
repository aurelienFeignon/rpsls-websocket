import { RULES } from './rules.js';

export function resolveRound(playerAction, opponentAction) {
    if (playerAction === opponentAction) {
        return {
            outcome: 'draw',
            rule: null,
        };
    }

    if (RULES[playerAction]?.[opponentAction]) {
        return {
            outcome: 'win',
            rule: RULES[playerAction][opponentAction],
        };
    }

    return {
        outcome: 'lose',
        rule: RULES[opponentAction][playerAction],
    };
}