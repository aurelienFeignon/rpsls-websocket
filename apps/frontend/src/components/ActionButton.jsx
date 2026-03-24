import * as React from 'react';

export const ActionButton = ({
                                 label,
                                 onClick
                             }) => {
    return (
        <button type="button" onClick={onClick}>
            {label}
        </button>
    );
};