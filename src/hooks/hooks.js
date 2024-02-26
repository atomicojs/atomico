import { useHook, useUpdate } from "./create-hooks.js";

import { isEqualArray, isFunction } from "../utils.js";

export * from "./use-effect.js";
import { State } from "./state.js";

/**
 * Create a persistent local state
 * @type {import("core").UseState}
 */
export const useState = (initialState) => {
    // retrieve the render to request an update
    const update = useUpdate();
    return useHook(
        (
            state = new State(initialState, (nextState, state, mount) => {
                nextState = isFunction(nextState)
                    ? nextState(state[0])
                    : nextState;
                if (nextState !== state[0]) {
                    state[0] = nextState;
                    // Escape from the first execution
                    if (!mount) update();
                }
            })
        ) => state
    );
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
                const nextState = reducer(state[0], action);
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
