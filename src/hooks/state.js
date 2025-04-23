import { isFunction } from "../utils.js";
/**
 *
 * @param {any} initialState
 * @param {(state: any)=>any} update
 */
export function createState(initialState, update) {
    /**  @type {[any, (state:any)=>any]} */
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
