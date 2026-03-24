import {
    CLIENT_EVENTS,
    SERVER_EVENTS,
    isValidAction,
    resolveRound,
} from '@wooclap/shared';
import {
    addPlayer,
    removePlayer,
    isPlayer,
    setSelection,
    resetSelections,
    getPlayers,
    getSelections,
} from './gameState.js';

export function registerGameHandlers(io, socket) {
    const added = addPlayer(socket.id);

    if (!added) {
        socket.emit(SERVER_EVENTS.ERROR, { message: 'Game is full' });
        socket.disconnect();
        return;
    }

    const players = getPlayers();

    if (players.length === 1) {
        socket.emit(SERVER_EVENTS.WAITING_FOR_OPPONENT, {
            playerId: socket.id,
        });
    }

    if (players.length === 2) {
        io.emit(SERVER_EVENTS.GAME_READY);
    }

    socket.on(CLIENT_EVENTS.SELECT_ACTION, ({ action }) => {
        if (!isPlayer(socket.id)) {
            socket.emit(SERVER_EVENTS.ERROR, { message: 'Unauthorized player' });
            return;
        }

        if (!isValidAction(action)) {
            socket.emit(SERVER_EVENTS.ERROR, { message: 'Invalid action' });
            return;
        }

        const selections = getSelections();

        if (selections[socket.id]) {
            socket.emit(SERVER_EVENTS.ERROR, { message: 'Action already selected for this round' });
            return;
        }

        setSelection(socket.id, action);

        const updatedSelections = getSelections();
        const currentPlayers = getPlayers();

        if (Object.keys(updatedSelections).length < 2) {
            socket.emit(SERVER_EVENTS.PLAYER_SELECTED);
            return;
        }

        const [playerOneId, playerTwoId] = currentPlayers;
        const playerOneAction = updatedSelections[playerOneId];
        const playerTwoAction = updatedSelections[playerTwoId];

        const playerOneResult = resolveRound(playerOneAction, playerTwoAction);
        const playerTwoResult = resolveRound(playerTwoAction, playerOneAction);

        io.to(playerOneId).emit(SERVER_EVENTS.ROUND_RESULT, {
            playerAction: playerOneAction,
            opponentAction: playerTwoAction,
            outcome: playerOneResult.outcome,
            rule: playerOneResult.rule,
        });

        io.to(playerTwoId).emit(SERVER_EVENTS.ROUND_RESULT, {
            playerAction: playerTwoAction,
            opponentAction: playerOneAction,
            outcome: playerTwoResult.outcome,
            rule: playerTwoResult.rule,
        });
    });

    socket.on(CLIENT_EVENTS.NEW_ROUND, () => {
        resetSelections();
        io.emit(SERVER_EVENTS.ROUND_RESET);
    });

    socket.on('disconnect', () => {
        removePlayer(socket.id);
    });
}