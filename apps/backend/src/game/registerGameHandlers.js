import {
    CLIENT_EVENTS,
    SERVER_EVENTS,
    isValidAction,
    resolveRound,
} from '@wooclap/shared';
import {
    createRoom,
    getRoom,
    addPlayerToRoom,
    removePlayerFromRoom,
    setRoomSelection,
    resetRoomSelections,
} from './roomState.js';

export function registerGameHandlers(io, socket) {
    socket.on(CLIENT_EVENTS.CREATE_PRIVATE_ROOM, () => {
        const room = createRoom();

        const joinResult = addPlayerToRoom(room.id, socket.id);

        if (!joinResult.ok) {
            socket.emit(SERVER_EVENTS.ERROR, { message: joinResult.reason });
            return;
        }

        socket.join(room.id);
        socket.data.roomId = room.id;

        socket.emit(SERVER_EVENTS.ROOM_CREATED, {
            roomId: room.id,
        });

        socket.emit(SERVER_EVENTS.WAITING_FOR_OPPONENT, {
            roomId: room.id,
            playerId: socket.id,
        });
    });

    socket.on(CLIENT_EVENTS.JOIN_PRIVATE_ROOM, ({ roomId }) => {
        if (!roomId) {
            socket.emit(SERVER_EVENTS.ERROR, { message: 'Missing room id' });
            return;
        }

        const joinResult = addPlayerToRoom(roomId, socket.id);

        if (!joinResult.ok) {
            socket.emit(SERVER_EVENTS.ERROR, { message: joinResult.reason });
            return;
        }

        socket.join(roomId);
        socket.data.roomId = roomId;

        socket.emit(SERVER_EVENTS.ROOM_JOINED, { roomId });

        const room = getRoom(roomId);

        if (room && room.playerOrder.length === 2) {
            io.to(roomId).emit(SERVER_EVENTS.GAME_READY, { roomId });
        }
    });

    socket.on(CLIENT_EVENTS.SELECT_ACTION, ({ action }) => {
        const roomId = socket.data.roomId;

        if (!roomId) {
            socket.emit(SERVER_EVENTS.ERROR, { message: 'No room joined' });
            return;
        }

        const room = getRoom(roomId);

        if (!room) {
            socket.emit(SERVER_EVENTS.ERROR, { message: 'Room not found' });
            return;
        }

        if (!room.playerOrder.includes(socket.id)) {
            socket.emit(SERVER_EVENTS.ERROR, { message: 'Unauthorized player' });
            return;
        }

        if (!isValidAction(action)) {
            socket.emit(SERVER_EVENTS.ERROR, { message: 'Invalid action' });
            return;
        }

        if (room.selectionsBySocketId[socket.id]) {
            socket.emit(SERVER_EVENTS.ERROR, {
                message: 'Action already selected for this round',
            });
            return;
        }

        setRoomSelection(roomId, socket.id, action);

        if (Object.keys(room.selectionsBySocketId).length < 2) {
            socket.emit(SERVER_EVENTS.PLAYER_SELECTED);
            return;
        }

        const [playerOneId, playerTwoId] = room.playerOrder;
        const playerOneAction = room.selectionsBySocketId[playerOneId];
        const playerTwoAction = room.selectionsBySocketId[playerTwoId];

        const playerOneResult = resolveRound(playerOneAction, playerTwoAction);
        const playerTwoResult = resolveRound(playerTwoAction, playerOneAction);

        io.to(playerOneId).emit(SERVER_EVENTS.ROUND_RESULT, {
            roomId,
            playerAction: playerOneAction,
            opponentAction: playerTwoAction,
            outcome: playerOneResult.outcome,
            rule: playerOneResult.rule,
        });

        io.to(playerTwoId).emit(SERVER_EVENTS.ROUND_RESULT, {
            roomId,
            playerAction: playerTwoAction,
            opponentAction: playerOneAction,
            outcome: playerTwoResult.outcome,
            rule: playerTwoResult.rule,
        });
    });

    socket.on(CLIENT_EVENTS.NEW_ROUND, () => {
        const roomId = socket.data.roomId;

        if (!roomId) {
            socket.emit(SERVER_EVENTS.ERROR, { message: 'No room joined' });
            return;
        }

        resetRoomSelections(roomId);
        io.to(roomId).emit(SERVER_EVENTS.ROUND_RESET, { roomId });
    });

    socket.on('disconnect', () => {
        const roomId = socket.data.roomId;

        if (roomId) {
            removePlayerFromRoom(roomId, socket.id);
        }
    });
}