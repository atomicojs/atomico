import { setTask, assign } from "./utils";
import {
    STATE,
    COMPONENT_CREATE,
    COMPONENT_UPDATE,
    COMPONENT_CREATED,
    COMPONENT_UPDATED,
    COMPONENT_REMOVE,
    COMPONENT_CLEAR
} from "./constants";

import { diff } from "./diff";
import { toVnode } from "./vnode";

let CURRENT_SNAP, CURRENT_SNAP_KEY_HOOK;

export function getCurrentSnap() {
    if (!CURRENT_SNAP) {
        throw new Error(
            "the hooks can only be called from an existing functional component in the diff queue"
        );
    }
    return CURRENT_SNAP;
}

export function useHook(reducer, state) {
    let component = getCurrentSnap().component,
        index = CURRENT_SNAP_KEY_HOOK++,
        hook,
        isCreate;
    if (!component.hooks[index]) {
        isCreate = true;
        component.hooks[index] = { state };
    }
    hook = component.hooks[index];
    hook.reducer = reducer;
    if (isCreate) dispatchHook(hook, { type: COMPONENT_CREATE });
    return [hook.state, action => dispatchHook(hook, action)];
}

export function dispatchHook(hook, action) {
    if (hook.reducer) {
        hook.state = hook.reducer(hook.state, action);
    }
}

export function dispatchComponents(components, action) {
    let length = components.length;
    for (let i = 0; i < length; i++) {
        let component = components[i],
            hooks = component.hooks,
            hooksLength = hooks.length;
        if (action.type === COMPONENT_REMOVE) {
            component.remove = true;
        }
        for (let i = 0; i < hooksLength; i++) {
            dispatchHook(hooks[i], action);
        }
    }
}
/**
 * this function allows creating a block that analyzes the tag
 * defined as a function, in turn creates a global update scope for hook management.
 */
export function createComponent(ID, isSvg) {
    let prevent,
        components = [],
        host;
    /**
     * This function allows reducing the functional components based on
     * their return, in turn creates a unique state for each component
     * according to a depth index
     * @param {function} vnode
     * @param {object} context
     * @param {number} deep
     */
    function nextComponent(vnode, context, deep) {
        // if host does not exist as a node, the vnode is not reduced
        if (!host) return;
        vnode = toVnode(vnode);
        // if it is different from a functional node, it is sent to diff again
        if (typeof vnode.type != "function") {
            dispatchComponents(components.splice(deep), {
                type: COMPONENT_REMOVE
            });
            host = diff(ID, host, vnode, context, isSvg, updateComponent);
            // if the components no longer has a length, it is assumed that the updateComponent is no longer necessary
            if (components.length) host[ID].updateComponent = updateComponent;

            return;
        }
        // you get the current component
        let component = components[deep] || {},
            isCreate,
            withNext;
        // if the current component is dis- torted to the analyzed one,
        // the previous state is replaced with a new one and the elimination is dispatched.
        if (component.type != vnode.type) {
            isCreate = true;
            // the state of the component is defined
            components[deep] = assign({ hooks: [] }, vnode);
            // the elimination is sent to the successors of the previous component
            dispatchComponents(components.splice(deep + 1), {
                type: COMPONENT_REMOVE
            });
            withNext = true;
        }

        component = components[deep];

        let nextProps = vnode.props,
            prevProps = component.props;
        // then a series of simple processes are carried out capable of
        // identifying if the component requires an update

        if (!withNext) {
            let length = Object.keys(prevProps).length,
                nextLength = 0;
            // compare the lake of properties
            for (let key in nextProps) {
                nextLength++;
                if (nextProps[key] != prevProps[key]) {
                    withNext = true;
                    break;
                }
            }
        }

        if (
            nextProps.context != prevProps.context ||
            (isCreate && nextProps.context)
        ) {
            context = assign({}, context, nextProps.context);
        }

        withNext = component.context != context ? true : withNext;

        component.props = nextProps;
        // the current context is componentsd in the cache
        component.context = context;
        /**
         * this function is a snapshot of the current component,
         * allows to run the component and launch the next update
         */
        function next() {
            if (component.remove) return host;

            CURRENT_SNAP = {
                component,
                context,
                // allows access to the instantaneous, but it uses the microtareas
                // to prevent multiple synchronous updates
                next() {
                    if (!component.prevent) {
                        component.prevent = true;
                        setTask(() => {
                            component.prevent = false;
                            next();
                        });
                    }
                }
            };

            CURRENT_SNAP_KEY_HOOK = 0;

            dispatchComponents([component], { type: COMPONENT_UPDATE });

            let vnextnode = component.type(component.props, context);

            CURRENT_SNAP = false;
            CURRENT_SNAP_KEY_HOOK = 0;

            nextComponent(vnextnode, context, deep + 1);

            dispatchComponents([component], {
                type: isCreate ? COMPONENT_CREATED : COMPONENT_UPDATED
            });

            isCreate = false;
        }
        if (withNext && !component.prevent) next();
    }
    /**
     *
     * @param {string} type
     * @param {HTMLElement|SVGElement|Text} nextHost
     * @param {object} vnode
     * @param {object} context
     */
    function updateComponent(type, nextHost, vnode, context) {
        switch (type) {
            case COMPONENT_UPDATE:
                host = nextHost;
                nextComponent(vnode, context, 0);
                return host;
            case COMPONENT_CLEAR:
                dispatchComponents([].concat(components).reverse(), { type });
                break;
            case COMPONENT_REMOVE:
                host = false;
                dispatchComponents(components.reverse(), { type });
                components = [];
                break;
        }
    }

    return updateComponent;
}
