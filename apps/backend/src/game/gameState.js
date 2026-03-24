export const gameState = {
    playerOrder: [],
    selectionsBySocketId: {},
};

export function addPlayer(socketId) {
    if (gameState.playerOrder.length >= 2) {
        return false;
    }

    gameState.playerOrder.push(socketId);
    return true;
}

export function removePlayer(socketId) {
    gameState.playerOrder = gameState.playerOrder.filter((id) => id !== socketId);
    delete gameState.selectionsBySocketId[socketId];
}

export function isPlayer(socketId) {
    return gameState.playerOrder.includes(socketId);
}

export function setSelection(socketId, action) {
    gameState.selectionsBySocketId[socketId] = action;
}

export function resetSelections() {
    gameState.selectionsBySocketId = {};
}

export function getPlayers() {
    return gameState.playerOrder;
}

export function getSelections() {
    return gameState.selectionsBySocketId;
}

export function resetGameState() {
    gameState.playerOrder = [];
    gameState.selectionsBySocketId = {};
}