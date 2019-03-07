import { setTask, assign } from "./utils";
import {
    COMPONENT_CREATE,
    COMPONENT_UPDATE,
    COMPONENT_CREATED,
    COMPONENT_UPDATED,
    COMPONENT_REMOVE,
    COMPONENT_CLEAR
} from "./constants";

import { update as updateNode } from "./update";

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
export function createUpdateComponent(ID, isSvg) {
    let prevent,
        store = [],
        host;
    /**
     * This function allows reducing the functional components based on
     * their return, in turn creates a unique state for each component
     * according to a depth index
     * @param {function} vnode
     * @param {object} context
     * @param {number} deep
     */
    function reduce(vnode, context, deep) {
        // if host does not exist as a node, the vnode is not reduced
        if (!host) return;
        vnode = vnode || "";
        // if it is different from a functional node, it is sent to updateNode again
        if (typeof vnode.tag !== "function") {
            dispatchComponents(store.splice(deep), {
                type: COMPONENT_REMOVE
            });
            host = updateNode(ID, host, vnode, isSvg, context, updateComponent);
            // if the store no longer has a length, it is assumed that the updateComponent is no longer necessary
            if (store.length) host[ID].updateComponent = updateComponent;

            return;
        }
        // you get the current component
        let component = store[deep] || {},
            isCreate,
            useNext;
        // if the current component is dis- torted to the analyzed one,
        // the previous state is replaced with a new one and the elimination is dispatched.
        if (component.tag !== vnode.tag) {
            isCreate = true;
            // the state of the component is defined
            store[deep] = {
                size: 1,
                tag: vnode.tag,
                hooks: [],
                props: {},
                context: {}
            };
            // the elimination is sent to the successors of the previous component
            dispatchComponents(store.splice(deep + 1), {
                type: COMPONENT_REMOVE
            });
            useNext = true;
        }

        component = store[deep];
        // then a series of simple processes are carried out capable of
        // identifying if the component requires an update

        context = vnode.useContext
            ? assign({}, context, vnode.useContext)
            : context;

        if (component.context !== context) {
            // the current context is stored in the cache
            component.context = context;
            // create a new context

            useNext = true;
        }

        if (!useNext) {
            // compare the lake of properties
            if (vnode.size !== component.size) useNext = true;
            if (!useNext) {
                // buy property by property, so the properties to be used
                // in the areas must be immutable
                for (let key in vnode.props) {
                    if (vnode.props[key] !== component.props[key]) {
                        useNext = true;
                        break;
                    }
                }
            }
        }

        component.props = vnode.props;
        component.size = vnode.size;
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

            let vnextnode = component.tag(component.props, context);

            CURRENT_SNAP = false;
            CURRENT_SNAP_KEY_HOOK = 0;

            reduce(vnextnode, context, deep + 1);

            dispatchComponents([component], {
                type: isCreate ? COMPONENT_CREATED : COMPONENT_UPDATED
            });

            isCreate = false;
        }

        if (useNext && !component.prevent) next();
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
                reduce(vnode, context, 0);
                return host;
            case COMPONENT_CLEAR:
                dispatchComponents([].concat(store).reverse(), { type });
                break;
            case COMPONENT_REMOVE:
                host = false;
                dispatchComponents(store.reverse(), { type });
                store = [];
                break;
        }
    }

    return updateComponent;
}
