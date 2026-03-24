import { ACTIONS } from './actions.js';

export function isValidAction(value) {
    return ACTIONS.includes(value);
}