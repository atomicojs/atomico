import { isFunction } from "../utils.js";
/**
 *
 * @param {any} initialState
 * @param {(state: any)=>any} update
 * @param {(state: any, nextState: any)=>any} [map]
 */
export function createState(initialState, update, map) {
    /**  @type {[any, (state:any)=>any]} */
    const state = [
        isFunction(initialState) ? initialState() : initialState,
        (nextState) => {
            const value = isFunction(nextState)
                ? nextState(state[0])
                : nextState;

            const nextValue = map ? map(state[0], value) : value;

            nextValue !== state[0] && update((state[0] = nextValue));
        }
    ];
    return state;
}
