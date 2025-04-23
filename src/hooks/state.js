import { isFunction } from "../utils.js";

export function createState(initialState, update) {
    const state = [
        isFunction(initialState) ? initialState() : initialState,
        (nextState) => {
            const value = isFunction(nextState)
                ? nextState(state[0])
                : nextState;

            value !== state[0] && update((state[0] = value));
        }
    ];
    return state;
}
