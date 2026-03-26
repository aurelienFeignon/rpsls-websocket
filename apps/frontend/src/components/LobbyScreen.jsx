export const LobbyScreen = ({ onCreateRoom, onJoinDetectedRoom, detectedRoomId }) => {
    return (
        <section>
            <h1>Rock Paper Scissors Lizard Spock</h1>

            {detectedRoomId ? (
                <button type="button" onClick={onJoinDetectedRoom}>
                    Join private room {detectedRoomId}
                </button>
            ) : (
                <button type="button" onClick={onCreateRoom}>
                    Create private room
                </button>
            )}
        </section>
    );
}