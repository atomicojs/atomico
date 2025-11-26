import { useHook, useUpdate } from "./create-hooks.js";

import { isEqualArray } from "../utils.js";
import { createState } from "./state.js";

export {
    useEffect,
    useInsertionEffect,
    useLayoutEffect
} from "./use-effect.js";

/**
 * Create a persistent local state
 * @type {import("core").UseState}
 */
export const useState = (initialState) => {
    // retrieve the render to request an update
    const update = useUpdate();
    return useHook((state = createState(initialState, update)) => state);
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
 * Memorize a callback allowing it to remember the scope
 * variables regardless of the render
 * @type {import("core").UseCallback}
 */
export const useCallback = (callback, args) => useMemo(() => callback, args);
