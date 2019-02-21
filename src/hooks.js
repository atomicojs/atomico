import { getCurrentSnap, useHook } from "./component";

import { isEqualArray } from "./utils";

import {
    COMPONENT_CREATE,
    COMPONENT_CREATED,
    COMPONENT_UPDATE,
    COMPONENT_UPDATED,
    COMPONENT_REMOVE,
    COMPONENT_CLEAR
} from "./constants";

export function useState(initialState) {
    let next = getCurrentSnap().next,
        type = "useState/update";
    let [state, dispatch] = useHook((state, action) => {
        switch (action.type) {
            case COMPONENT_CREATE:
                return typeof initialState === "function"
                    ? initialState()
                    : initialState;
            case type:
                let nextState = action.state;
                return typeof nextState === "function"
                    ? nextState(state)
                    : nextState;
        }
        return state;
    });
    return [
        state,
        state => {
            dispatch({ state, type });
            next();
        }
    ];
}

export function useEffect(callback, args) {
    useHook((state, action) => {
        switch (action.type) {
            case COMPONENT_CREATE:
                return { args };
            case COMPONENT_UPDATE:
            case COMPONENT_REMOVE:
                if (state.clear) {
                    let next =
                        action.type === COMPONENT_REMOVE ||
                        (args && state.args
                            ? !isEqualArray(args, state.args)
                            : true);
                    if (next) state.clear();
                }
                return { ...state, args };
            case COMPONENT_CREATED:
            case COMPONENT_UPDATED:
                let next =
                        action.type === COMPONENT_CREATED ||
                        (args && state.args
                            ? !isEqualArray(args, state.args)
                            : true),
                    clear = state.clear;
                if (next) {
                    clear = callback();
                }
                return { ...state, clear, args };
        }
        return state;
    });
}

export function useRef(current) {
    let [state] = useHook((state = {}, action) =>
        action.type === COMPONENT_CREATE ? { current } : state
    );
    return state;
}

export function useMemo(callback, args) {
    let [state] = useHook((state, action) => {
        switch (action.type) {
            case COMPONENT_CREATE:
            case COMPONENT_UPDATE:
                return {
                    args,
                    value:
                        action.type === COMPONENT_CREATE
                            ? callback()
                            : isEqualArray(args, state.args)
                            ? state.value
                            : callback()
                };
        }
        return state;
    });
    return state.value;
}

export function useReducer(reducer, initialState) {
    let next = getCurrentSnap().next,
        type = "useReducer/update";
    let [state, dispatch] = useHook((state, action) => {
        switch (action.type) {
            case COMPONENT_CREATE:
                return initialState;
            case type:
                return reducer(state, action.use);
        }
        return state;
    });
    return [
        state,
        use => {
            dispatch({ type, use });
            next();
        }
    ];
}
