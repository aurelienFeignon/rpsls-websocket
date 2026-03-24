import {useEffect} from 'react';
import {CLIENT_EVENTS, GAME_PHASES} from '@wooclap/shared';
import {useGameStore} from "./store/useGameStore.js";
import {WaitingScreen} from "./components/WaitingScreen.jsx";
import ActionSelectionScreen from "./components/ActionSelectionScreen.jsx";
import {RoundResultScreen} from "./components/RoundResultScreen.jsx";
import {registerGameSocket} from "./socket/registerGameSocket.js";
import {socket} from "./socket/socket.js";
import './App.css';

function App() {
  const phase = useGameStore((state) => state.phase);
  const roundResult = useGameStore((state) => state.roundResult);
  const errorMessage = useGameStore((state) => state.errorMessage);
  const setSelectedAction = useGameStore((state) => state.setSelectedAction);

  useEffect(() => {
    return registerGameSocket();
  }, []);

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

        {phase === GAME_PHASES.CONNECTING && (
            <WaitingScreen message="Connecting..." />
        )}

        {phase === GAME_PHASES.WAITING_FOR_OPPONENT && (
            <WaitingScreen message="Waiting for second player..." />
        )}

        {phase === GAME_PHASES.CHOOSING && (
            <ActionSelectionScreen onSelect={handleSelectAction} />
        )}

        {phase === GAME_PHASES.WAITING_FOR_OTHER_PLAYER && (
            <WaitingScreen message="Waiting for the other player..." />
        )}

        {phase === GAME_PHASES.ROUND_RESULT ? (
            <RoundResultScreen result={roundResult} onNewRound={handleNewRound} />
        ) : null}
      </main>
  );
}

export default App;