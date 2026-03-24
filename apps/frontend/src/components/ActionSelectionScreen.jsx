import { ACTIONS, ACTION_LABELS } from '@wooclap/shared';
import {ActionButton} from "./ActionButton.jsx";

function ActionSelectionScreen({ onSelect }) {
    return (
        <section>
            <h1>Choose your action</h1>

            <div style={{ display: 'flex', gap: '1rem', width: '100%', justifyContent: 'center'}}>
                {ACTIONS.map((action) => (
                    <ActionButton
                        key={action}
                        label={ACTION_LABELS[action]}
                        onClick={() => onSelect(action)}
                    />
                ))}
            </div>
        </section>
    );
}

export default ActionSelectionScreen;