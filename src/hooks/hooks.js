import {
    HOOK_MOUNT,
    HOOK_UPDATE,
    HOOK_CURRENT,
    HOOK_MOUNTED,
    HOOK_UPDATED,
    HOOK_UNMOUNT,
    useHook,
    useRender,
} from "./create-hooks.js";

import { isEqualArray, isFunction } from "../utils.js";

export * from "./custom-hooks/use-prop.js";
export * from "./custom-hooks/use-event.js";

export function useHost() {
    return useHook(0, { current: HOOK_CURRENT.ref.host });
}

export function useState(initialState) {
    let render = useRender();
    return useHook((state, type) => {
        if (HOOK_MOUNT == type) {
            state[0] = isFunction(initialState) ? initialState() : initialState;
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
        return state;
    }, []);
}

export function useEffect(callback, args) {
    // define whether the effect in the render cycle should be regenerated
    let executeEffect;
    useHook((state, type) => {
        if (executeEffect == null) {
            executeEffect =
                args && state[0] ? !isEqualArray(args, state[0]) : true;
            state[0] = args;
        }

        switch (type) {
            case HOOK_UPDATE:
            case HOOK_UNMOUNT:
                // save the current args, for comparison
                if ((executeEffect || type == HOOK_UNMOUNT) && state[1]) {
                    // compare the previous snapshot with the generated state
                    state[1]();
                    // clean the effect collector
                    state[1] = 0;
                }
                // delete the previous argument for a hook
                // run if the hook is inserted in a new node
                // Why? ... to perform again dom operations associated with the parent
                if (type == HOOK_UNMOUNT) {
                    state[0] = null;
                }
                break;
            case HOOK_MOUNTED:
            case HOOK_UPDATED:
                // save the current args, for comparison, repeats due to additional type HOOK_MOUNTED
                if (executeEffect || type == HOOK_MOUNTED) {
                    // save the effect collector
                    state[1] = callback();
                }
                // save the comparison argument
                break;
        }
        return state;
    }, []);
}

export function useRef(current) {
    return useHook(0, { current });
}

export function useMemo(callback, args) {
    let state = useHook(0, []);

    if (!state[0] || (state[0] && (!args || !isEqualArray(state[0], args)))) {
        state[1] = callback();
    }
    state[0] = args;
    return state[1];
}

export function useReducer(reducer, initialState) {
    let render = useRender();
    let hook = useHook((state, type) => {
        if (HOOK_MOUNT == type) {
            state[0] = initialState;
            state[1] = (action) => {
                let nextState = state[2](state[0], action);
                if (nextState != state[0]) {
                    state[0] = nextState;
                    render();
                }
            };
        }
        return state;
    }, []);
    // allows the reduce to always access the scope of the component
    hook[2] = reducer;

    return hook;
}
/**
 * @todo add test use callback
 */
export function useCallback(callback, args) {
    return useMemo(() => callback, args);
}
