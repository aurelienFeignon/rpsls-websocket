import * as React from 'react';
import { ACTION_LABELS } from '@wooclap/shared';

export const RoundResultScreen = ({
                                      result,
                                      onNewRound
}) => {
    if (!result) {
        return null;
    }

    return (
        <section>
            <h1>{result.outcome.toUpperCase()}</h1>
            <p>Your move: {ACTION_LABELS[result.playerAction]}</p>
            <p>Opponent move: {ACTION_LABELS[result.opponentAction]}</p>
            <p>{result.rule ?? 'Draw'}</p>

            <button type="button" onClick={onNewRound}>
                New round
            </button>
        </section>
    );
};