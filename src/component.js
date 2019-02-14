import { isArray, isEqualArray } from "./utils";
import { options } from "./options";
import { update } from "./update";
import { createTask } from "./task";

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

export function getCurrentComponent() {
    if (!CURRENT_COMPONENT) {
        throw new Error(
            "the hooks can only be called from an existing functional component in the diff queue"
        );
    }
    return CURRENT_COMPONENT;
}

export function useRender() {
    let component = getCurrentComponent();
    return () => {
        if (!component.prevent) {
            component.prevent = true;
            createTask(() => {
                component.render();
                component.prevent = false;
            });
        }
    };
}

export function useHook(reducer) {
    let component = getCurrentComponent(),
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

export function clearComponentEffects(components, isRemove) {
    let length = components.length;
    for (let i = 0; i < length; i++) {
        components[i].dispatch(isRemove ? COMPONENT_REMOVE : COMPONENT_CLEAR);
    }
}

export function dispatchHook(hook, action) {
    hook.state = hook.reducer(hook.state, action);
}

export function createComponent(tag, isHost, isSvg, deep, components) {
    let isRemove,
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

    function render() {
        if (isRemove) return;

        CURRENT_KEY_HOOKS = 0;
        CURRENT_COMPONENT = component;

        dispatch(isCreate ? COMPONENT_CREATE : COMPONENT_UPDATE);

        let vnode = tag(component.props, component.context);

        CURRENT_KEY_HOOKS = 0;
        CURRENT_COMPONENT = false;

        let base = update(
            component.base,
            vnode,
            isHost,
            isSvg,
            component.context,
            deep + 1,
            components
        );

        if (base !== component.base) {
            for (let i = 0; i < deep; i++) {
                components[i].base = base;
            }
        }

        dispatch(isCreate ? COMPONENT_CREATED : COMPONENT_UPDATED);

        isCreate = false;

        return (component.base = base);
    }

    let component = {
        tag,
        hooks,
        render,
        dispatch
    };
    return component;
}
