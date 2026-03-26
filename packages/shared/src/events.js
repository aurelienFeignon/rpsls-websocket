export const CLIENT_EVENTS = {
    CREATE_PRIVATE_ROOM: 'game:create-private-room',
    JOIN_PRIVATE_ROOM: 'game:join-private-room',
    SELECT_ACTION: 'game:select-action',
    NEW_ROUND: 'game:new-round',
};

export const SERVER_EVENTS = {
    ROOM_CREATED: 'game:room-created',
    ROOM_JOINED: 'game:room-joined',
    WAITING_FOR_OPPONENT: 'game:waiting-for-opponent',
    GAME_READY: 'game:ready',
    PLAYER_SELECTED: 'game:player-selected',
    ROUND_RESULT: 'game:round-result',
    ROUND_RESET: 'game:round-reset',
    ERROR: 'game:error',
};