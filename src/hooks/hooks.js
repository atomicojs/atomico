import { useHook, useRender } from "./create-hooks.js";

import { isEqualArray, isFunction } from "../utils.js";

export * from "./use-effect.js";
export * from "./custom-hooks/use-prop.js";
export * from "./custom-hooks/use-event.js";
/**
 * Create a persistent local state
 * @param {*} initialState
 */
export function useState(initialState) {
    // retrieve the render to request an update
    let render = useRender();
    return useHook((state = []) => {
        if (!state[1]) {
            // Initialize the initial state
            state[0] = isFunction(initialState) ? initialState() : initialState;
            // Associate an immutable setState to the state instance
            state[1] = (nextState) => {
                nextState = isFunction(nextState)
                    ? nextState(state[0])
                    : nextState;
                if (nextState != state[0]) {
                    state[0] = nextState;
                    render();
                }
            };
        }
        // The return is always the same reference
        return state;
    });
}
/**
 * Create a persistent reference
 * @template T
 * @param {T} [current]
 * @returns {{current:T}}
 */
export function useRef(current) {
    return useHook((state = { current }) => state);
}

/**
 * Memorize the return of a callback
 * @template T
 * @param {(args:any[])=>T} currentMemo
 * @param {any[]} [currentArgs]
 * @returns {T}
 */
export function useMemo(currentMemo, currentArgs) {
    let [state] = useHook(([state, args, cycle = 0] = []) => {
        if (!args || (args && !isEqualArray(args, currentArgs))) {
            state = currentMemo(currentArgs);
        }
        return [state, currentArgs, cycle];
    });
    return state;
}
/**
 * Apply the redux pattern as a hook
 * @param {(state:any,action:any)=>any} reducer
 * @param {any} initialState
 */
export function useReducer(reducer, initialState) {
    let render = useRender();
    return useHook((state = []) => {
        if (!state[1]) {
            state[0] = initialState;
            state[1] = (action) => {
                let nextState = reducer(state[0], action);
                if (nextState != state[0]) {
                    state[0] = nextState;
                    render();
                }
            };
        }
        return state;
    });
}
/**
 * Memorize a callback allowing it to remember the scope
 * variables regardless of the render
 * @template {()=>any} T;
 * @param {T} callback
 * @param {any[]} [args]
 * @returns {T}
 */
export function useCallback(callback, args) {
    return useMemo(() => callback, args);
}
