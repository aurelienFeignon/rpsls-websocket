import { useEffect } from 'react';
import { CLIENT_EVENTS, GAME_PHASES } from '@wooclap/shared';
import {useGameStore} from "./store/useGameStore.js";
import {LobbyScreen} from "./components/LobbyScreen.jsx";
import {WaitingScreen} from "./components/WaitingScreen.jsx";
import ActionSelectionScreen from "./components/ActionSelectionScreen.jsx";
import {RoundResultScreen} from "./components/RoundResultScreen.jsx";
import {registerGameSocket} from "./socket/registerGameSocket.js";
import {getRoomIdFromUrl} from "./utils/getRoomIdFromUrl.js";
import {socket} from "./socket/socket.js";

function App() {
  const phase = useGameStore((state) => state.phase);
  const roomId = useGameStore((state) => state.roomId);
  const invitationLink = useGameStore((state) => state.invitationLink);
  const roundResult = useGameStore((state) => state.roundResult);
  const errorMessage = useGameStore((state) => state.errorMessage);
  const setSelectedAction = useGameStore((state) => state.setSelectedAction);

  useEffect(() => {
    const cleanup = registerGameSocket();
    return cleanup;
  }, []);

  const detectedRoomId = getRoomIdFromUrl();

  function handleCreateRoom() {
    socket.emit(CLIENT_EVENTS.CREATE_PRIVATE_ROOM);
  }

  function handleJoinDetectedRoom() {
    socket.emit(CLIENT_EVENTS.JOIN_PRIVATE_ROOM, {
      roomId: detectedRoomId,
    });
  }

  function handleSelectAction(action) {
    setSelectedAction(action);
    socket.emit(CLIENT_EVENTS.SELECT_ACTION, { action });
  }

  function handleNewRound() {
    socket.emit(CLIENT_EVENTS.NEW_ROUND);
  }

  return (
      <main>
        {errorMessage ? <p>{errorMessage}</p> : null}

        {!roomId && (
            <LobbyScreen
                onCreateRoom={handleCreateRoom}
                onJoinDetectedRoom={handleJoinDetectedRoom}
                detectedRoomId={detectedRoomId}
            />
        )}

        {roomId && phase === GAME_PHASES.CONNECTING && (
            <WaitingScreen message="Connecting..." />
        )}

        {roomId && phase === GAME_PHASES.WAITING_FOR_OPPONENT && (
            <WaitingScreen
                message="Waiting for second player..."
                invitationLink={invitationLink}
            />
        )}

        {roomId && phase === GAME_PHASES.CHOOSING && (
            <ActionSelectionScreen onSelect={handleSelectAction} />
        )}

        {roomId && phase === GAME_PHASES.WAITING_FOR_OTHER_PLAYER && (
            <WaitingScreen message="Waiting for the other player..." />
        )}

        {roomId && phase === GAME_PHASES.ROUND_RESULT && (
            <RoundResultScreen result={roundResult} onNewRound={handleNewRound} />
        )}
      </main>
  );
}

export default App;