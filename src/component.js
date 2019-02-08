import { isArray, isEqualArray } from "./utils";
import { options } from "./options";
import { update } from "./update";

import {
    COMPONENT_CREATE,
    COMPONENT_CREATED,
    COMPONENT_UPDATE,
    COMPONENT_UPDATED,
    COMPONENT_REMOVE,
    COMPONENT_CLEAR
} from "./constants";

let CURRENT_COMPONENT;
let CURRENT_KEY_HOOKS;

export function clearComponentEffects(components, isRemove) {
    let length = components.length;
    for (let i = 0; i < length; i++) {
        components[i].dispatch(isRemove ? COMPONENT_REMOVE : COMPONENT_CLEAR);
    }
}

export function useContext(nameSpace) {
    let context = CURRENT_COMPONENT.context;
    return context[nameSpace];
}

export function useUpdate() {
    let component = CURRENT_COMPONENT;
    return () => {
        if (!component.prevent) {
            component.prevent = true;
            setTimeout(() => {
                component.update();
                component.prevent = false;
            }, options.delay);
        }
    };
}

export function useHook(reducer) {
    if (!CURRENT_COMPONENT) {
        throw new Error(
            "the hooks can only be called from an existing functional component in the diff queue"
        );
    }
    let component = CURRENT_COMPONENT,
        index = CURRENT_KEY_HOOKS++,
        hook,
        isCreate;
    if (!component.hooks[index]) {
        isCreate = true;
        component.hooks[index] = {};
    }
    hook = component.hooks[index];
    hook.reducer = reducer;
    if (isCreate) dispatchHook(hook, { type: COMPONENT_CREATE });
    return [hook.state, action => dispatchHook(hook, action)];
}

export function useState(initialState) {
    let update = useUpdate(),
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
            update();
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
            case COMPONENT_CLEAR:
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

export function dispatchHook(hook, action) {
    hook.state = hook.reducer(hook.state, action);
}

export function createComponent(tag, isSvg, deep, components) {
    let isRemove,
        localBase,
        localProps,
        localContext,
        hooks = [],
        isCreate = true;

    function dispatch(type) {
        if (isRemove) return;
        if (type === COMPONENT_REMOVE) {
            isRemove = true;
        }
        let action = { type },
            length = hooks.length;
        for (let i = 0; i < length; i++) dispatchHook(hooks[i], action);
    }

    function localUpdate() {
        if (isRemove) return;

        CURRENT_KEY_HOOKS = 0;
        CURRENT_COMPONENT = this;

        dispatch(isCreate ? COMPONENT_CREATE : COMPONENT_UPDATE);

        let vnode = tag(localProps, localContext);

        CURRENT_KEY_HOOKS = 0;
        CURRENT_COMPONENT = false;

        let base = update(
            localBase,
            vnode,
            isSvg,
            localContext,
            deep + 1,
            components
        );

        if (base !== localBase) {
            for (let i = 0; i < deep; i++) {
                components[i].set(base);
            }
        }

        dispatch(isCreate ? COMPONENT_CREATED : COMPONENT_UPDATED);

        isCreate = false;

        return (localBase = base);
    }
    function set(base, props, context) {
        if (base) localBase = base;
        if (props) localProps = props;
        if (context) localContext = context;
    }
    return {
        tag,
        set,
        hooks,
        update: localUpdate,
        dispatch
    };
}
