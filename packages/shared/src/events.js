export const CLIENT_EVENTS = {
    SELECT_ACTION: 'game:select-action',
    NEW_ROUND: 'game:new-round',
};

export const SERVER_EVENTS = {
    WAITING_FOR_OPPONENT: 'game:waiting-for-opponent',
    GAME_READY: 'game:ready',
    PLAYER_SELECTED: 'game:player-selected',
    ROUND_RESULT: 'game:round-result',
    ROUND_RESET: 'game:round-reset',
    ERROR: 'game:error',
};