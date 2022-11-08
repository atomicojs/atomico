import { useHook, useUpdate } from "./create-hooks.js";

import { isEqualArray, isFunction } from "../utils.js";

export * from "./use-effect.js";

/**
 * Create a persistent local state
 * @type {import("core").UseState}
 */
export const useState = (initialState) => {
    // retrieve the render to request an update
    const update = useUpdate();

    return useHook((state = []) => {
        if (!state[1]) {
            const load = (value) =>
                isFunction(value) ? value(state[0]) : value;
            // Initialize the initial state
            state[0] = load(initialState);
            // Associate an immutable setState to the state instance
            state[1] = (nextState) => {
                nextState = load(nextState);
                if (state[0] !== nextState) {
                    state[0] = nextState;
                    update();
                }
            };
        }
        // The return is always the same reference
        return state;
    });
};

/**
 * Memorize the return of a callback
 * @type {import("core").UseMemo}
 */
export const useMemo = (currentMemo, currentArgs) => {
    const [state] = useHook(([state, args, cycle = 0] = []) => {
        if (!args || (args && !isEqualArray(args, currentArgs))) {
            state = currentMemo();
        }
        return [state, currentArgs, cycle];
    });
    return state;
};

/**
 * Apply the redux pattern as a hook
 * @type {import("core").UseReducer}
 */
export const useReducer = (reducer, initialArg, init) => {
    const update = useUpdate();
    return useHook((state = []) => {
        if (!state[1]) {
            state[0] = init !== undefined ? init(initialArg) : initialArg;
            state[1] = (action) => {
                let nextState = reducer(state[0], action);
                if (nextState != state[0]) {
                    state[0] = nextState;
                    update();
                }
            };
        }
        return state;
    });
};

/**
 * Memorize a callback allowing it to remember the scope
 * variables regardless of the render
 * @type {import("core").UseCallback}
 */
export const useCallback = (callback, args) => useMemo(() => callback, args);
