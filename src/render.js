import { SymbolFor, flat, isArray, isFunction, isObject } from "./utils.js";

// Object used to know which properties are extracted directly
// from the node to verify 2 if they have changed
const VAL_FROM_PROPS = {
    checked: 1,
    value: 1,
    selected: 1
};
// Map of attributes that escape the property analysis
const PROPS_AS_ATTRS = {
    list: 1,
    type: 1,
    size: 1,
    form: 1,
    width: 1,
    height: 1,
    src: 1,
    href: 1,
    slot: 1
};
// escapes from renderProps compare process
const INTERNAL_PROPS = {
    shadowDom: 1,
    staticNode: 1,
    cloneNode: 1,
    children: 1,
    key: 1
};

// Immutable for comparison of empty properties
const EMPTY_PROPS = {};
// Immutable for empty children comparison
const EMPTY_CHILDREN = [];
// Fragment marker
export class Mark extends Text {}

// Default ID used to store the Vnode state
export const ID = SymbolFor("id");

export const TYPE_NODE = SymbolFor("ref");

export const Fragment = () => {};

/**
 * @type {import("vnode").H}
 */
export const createElement = (type, p, ...args) => {
    /**
     * @type {any}
     */
    const props = p || EMPTY_PROPS;

    let { children } = props;

    children =
        children != null ? children : args.length ? args : EMPTY_CHILDREN;

    if (type === Fragment) {
        //@ts-ignore
        return children;
    }

    //@ts-ignore
    if (!type.prototype && type instanceof Function) {
        return type(
            children != EMPTY_CHILDREN ? { children, ...props } : props
        );
    }

    /**
     * @todo look for a more elegant type, since you can't follow the type rules without capturing this
     * @type {any}
     */

    /**
     * @type {import("vnode").VNodeAny}
     */
    const vnode = {
        type,
        props,
        key: props.key
    };

    //@ts-ignore
    return vnode;
};

/**
 * Create or update a node
 * Node: The declaration of types through JSDOC does not allow to compress
 * the exploration of the parameters
 * @param {ReturnType<createElement>} newVnode
 * @param {Element} node
 * @param {import("vnode").RenderId} [id]
 * @param {boolean} [isSvg]
 * @param {any} [taskQueue]
 * @returns {ChildNode}
 */
export function render(newVnode, node, id = ID, isSvg, taskQueue) {
    let isNewNode;
    const isHost = !taskQueue;
    taskQueue = isHost ? [] : taskQueue;

    // If the node maintains the source vnode it escapes from the update tree
    if (node && node[id] && node[id].vnode == newVnode) return node;
    // The process only continues when you may need to create a node

    const { type: newType, props: newProps = EMPTY_PROPS } = newVnode;

    if (newVnode || !node) {
        isSvg = isSvg || newVnode.type == "svg";

        const originType =
            newType instanceof Node
                ? 1
                : newType["prototype"] instanceof HTMLElement
                ? 2
                : 0;

        // determines if the node should be regenerated
        isNewNode =
            newType != "host" &&
            (originType == 1
                ? (node && newProps.cloneNode ? node[TYPE_NODE] : node) !=
                  newType
                : originType == 2
                ? !(node instanceof newType)
                : node
                ? node[TYPE_NODE] || node.localName != newType
                : !node);

        if (isNewNode) {
            if (originType == 1 && newProps.cloneNode) {
                node = newType.cloneNode(true);
                node[TYPE_NODE] = newType;
            } else {
                node =
                    originType == 1
                        ? newType
                        : originType == 2
                        ? new newType()
                        : isSvg
                        ? document.createElementNS(
                              "http://www.w3.org/2000/svg",
                              newType
                          )
                        : document.createElement(
                              newType,
                              newProps.is ? { is: newProps.is } : undefined
                          );
            }
        }
    }

    const oldVNodeStore = node[id] ? node[id] : EMPTY_PROPS;

    /**
     * @type {import("vnode").VNodeStore}
     */
    const { vnode = EMPTY_PROPS, cycle = 0 } = oldVNodeStore;

    let { fragment, handlers } = oldVNodeStore;

    /**
     * @type {import("vnode").VNodeGeneric}
     */
    const { props = EMPTY_PROPS } = vnode;
    const { children = EMPTY_CHILDREN } = props;

    /**
     * @type {import("vnode").Handlers}
     */
    handlers = isNewNode ? {} : handlers || {};
    /**
     * Escape a second render if the vnode.type is equal
     */
    if (newProps.staticNode && !isNewNode) return node;

    if (newProps.shadowDom && !node.shadowRoot)
        node.attachShadow({ mode: "open", ...newProps.shadowDom });

    if (newProps != props)
        renderProps(node, props, newProps, handlers, isSvg, taskQueue);

    if (newProps.children !== children) {
        const nextParent = newProps.shadowDom ? node.shadowRoot : node;
        fragment = renderChildren(
            newProps.children,
            fragment,
            nextParent,
            id,
            // add support to foreignObject, children will escape from svg
            isSvg && newVnode.type == "foreignObject" ? false : isSvg,
            taskQueue
        );
    }

    node[id] = { vnode: newVnode, handlers, fragment, cycle: cycle + 1 };

    if (isHost) {
        let task;
        while ((task = taskQueue.shift())) task();
    }

    return node;
}
/**
 *
 * @param {Element|ShadowRoot} parent
 * @return {import("vnode").Fragment}
 */
function createFragment(parent) {
    const markStart = new Mark("");
    const markEnd = new Mark("");

    parent.append(markStart, markEnd);

    return {
        markStart,
        markEnd
    };
}

/**
 * This method should only be executed from render,
 * it allows rendering the children of the virtual-dom
 * @param {any} children
 * @param {import("vnode").Fragment} fragment
 * @param {Element|ShadowRoot} parent
 * @param {any} id
 * @param {boolean} [isSvg]
 * @param {any} [taskQueue]
 */
export function renderChildren(
    children,
    fragment,
    parent,
    id,
    isSvg,
    taskQueue
) {
    children =
        children == null ? null : isArray(children) ? children : [children];

    const nextFragment = fragment || createFragment(parent);

    const { markStart, markEnd, keyes } = nextFragment;
    /**
     * @type {import("vnode").Keyes}
     */
    let nextKeyes;
    /**
     * Eliminate intermediate nodes that are not used in the process in keyed
     * @type {Set<ChildNode>}
     */
    const removeNodes = keyes && new Set();

    /**
     * RULES: that you should never exceed "c"
     * @type {ChildNode}
     */
    let currentNode = markStart;
    children &&
        flat(children, (child) => {
            const childType = typeof child;
            const isVnode =
                childType == "object" && "type" in child && "props" in child;
            const isSerialize = childType == "string" || childType == "number";

            if (!isVnode && !isSerialize) {
                return;
            }

            const key = child.key;
            const childKey = keyes && key != null && keyes.get(key);
            // check if the displacement affected the index of the child with
            // assignment of key, if so the use of nextSibling is prevented
            if (currentNode != markEnd && currentNode === childKey) {
                removeNodes.delete(currentNode);
            } else {
                currentNode =
                    currentNode == markEnd ? markEnd : currentNode.nextSibling;
            }

            const childNode = keyes ? childKey : currentNode;

            let nextChildNode = childNode;

            // text node diff
            if (isSerialize) {
                const text = child + "";
                if (
                    !(nextChildNode instanceof Text) ||
                    nextChildNode instanceof Mark
                ) {
                    nextChildNode = new Text(text);
                }
                // Only one Text node falls in this block
                // @ts-ignore
                else if (nextChildNode.data != text) {
                    // @ts-ignore
                    nextChildNode.data = text;
                }
            } else {
                // diff only resive Elements
                nextChildNode = render(
                    child,
                    // @ts-ignore
                    childNode,
                    id,
                    isSvg,
                    taskQueue
                );
            }
            if (nextChildNode != currentNode) {
                keyes && removeNodes.delete(nextChildNode);
                // It will try to use moveBefore as long as the node is connected to the DOM and has a key
                const method =
                    keyes && (nextChildNode || childNode).isConnected
                        ? "moveBefore"
                        : "insertBefore";

                if (!childNode || keyes) {
                    parent[method](nextChildNode, currentNode);
                    keyes &&
                        currentNode != markEnd &&
                        removeNodes.add(currentNode);
                } else if (childNode == markEnd) {
                    parent[method](nextChildNode, markEnd);
                } else {
                    parent.replaceChild(nextChildNode, childNode);
                    currentNode = nextChildNode;
                }
            }
            // if there is a key, a map of keys is created
            if (key != null) {
                nextKeyes = nextKeyes || new Map();
                nextKeyes.set(key, nextChildNode);
            }
        });

    currentNode = currentNode == markEnd ? markEnd : currentNode.nextSibling;

    if (fragment && currentNode != markEnd) {
        // cleaning of remnants within the fragment
        while (currentNode != markEnd) {
            const nodeToRemove = currentNode;
            currentNode = currentNode.nextSibling;
            nodeToRemove.remove();
        }
    }

    removeNodes && removeNodes.forEach((node) => node.remove());

    nextFragment.keyes = nextKeyes;

    return nextFragment;
}

/**
 *
 * @param {Element} node
 * @param {Object} props
 * @param {Object} nextProps
 * @param {import("vnode").Handlers} handlers
 * @param {boolean} isSvg
 * @param {any} taskQueue
 **/
export function renderProps(
    node,
    props,
    nextProps,
    handlers,
    isSvg,
    taskQueue
) {
    for (const key in props) {
        !(key in nextProps) &&
            setProperty(
                node,
                key,
                props[key],
                null,
                handlers,
                isSvg,
                taskQueue
            );
    }
    for (const key in nextProps) {
        setProperty(
            node,
            key,
            props[key],
            nextProps[key],
            handlers,
            isSvg,
            taskQueue
        );
    }
}

/**
 *
 * @param {Element|HTMLSlotElement} node
 * @param {string} key
 * @param {any} prevValue
 * @param {any} nextValue
 * @param {import("vnode").Handlers} handlers
 * @param {boolean} isSvg
 * @param {any} taskQueue
 */
export function setProperty(
    node,
    key,
    prevValue,
    nextValue,
    handlers,
    isSvg,
    taskQueue
) {
    key = key == "class" && !isSvg ? "className" : key;
    // define empty value
    prevValue = prevValue == null ? null : prevValue;
    nextValue = nextValue == null ? null : nextValue;

    if (key in node && VAL_FROM_PROPS[key]) {
        prevValue = node[key];
    }

    if (nextValue === prevValue || INTERNAL_PROPS[key] || key[0] == "_") return;

    // slot assignNode
    if (node.localName === "slot" && key === "assignNode" && "assign" in node) {
        taskQueue.push(() => node.assign(nextValue));
        return;
    }

    const isFnPrev = isFunction(prevValue);
    const isFnNext = isFunction(nextValue);

    // events
    if (key.startsWith("on") && (isFnNext || isFnPrev)) {
        setEvent(node, key.slice(2), nextValue, handlers);
        return;
    }

    // ref
    if (key === "ref") {
        if (nextValue) {
            if (isFnNext) taskQueue.push(() => nextValue(node));
            else nextValue.current = node;
        }
        return;
    }

    // style
    if (key === "style" && "style" in node) {
        const { style } = node;
        const prevIsObject = isObject(prevValue);
        const nextIsObject = isObject(nextValue);

        if (prevIsObject && nextIsObject) {
            for (const k in prevValue)
                if (!(k in nextValue)) setPropertyStyle(style, k, null);
            for (const k in nextValue)
                if (prevValue[k] !== nextValue[k])
                    setPropertyStyle(style, k, nextValue[k]);
        } else if (nextIsObject) {
            for (const k in nextValue) setPropertyStyle(style, k, nextValue[k]);
        } else {
            style.cssText = nextValue || "";
        }
        return;
    }

    // attributes / properties
    const attr = key.startsWith("$") ? key.slice(1) : key;
    const treatAsProp =
        attr === key &&
        ((!isSvg && !PROPS_AS_ATTRS[key] && key in node) ||
            isFnNext ||
            isFnPrev);

    if (treatAsProp) {
        node[key] = nextValue == null ? "" : nextValue;
    } else if (nextValue == null) {
        node.removeAttribute(attr);
    } else {
        node.setAttribute(
            attr,
            isObject(nextValue) ? JSON.stringify(nextValue) : nextValue
        );
    }
}

/**
 *
 * @param {Node} node
 * @param {string} type
 * @param {import("vnode").VNodeListener} [nextHandler]
 * @param {import("vnode").Handlers} [handlers]
 */
export function setEvent(node, type, nextHandler, handlers) {
    if (!handlers) return;

    // crea una única función manejadora que delega en handlers[type]
    if (!handlers.handleEvent) {
        handlers.handleEvent = function (event) {
            const h = handlers[event.type];
            if (typeof h === "function") return h.call(node, event);
        };
    }

    const had = !!handlers[type];

    if (nextHandler) {
        // solo construir opciones si hay flags (capture/once/passive)
        const hasOptions =
            nextHandler &&
            (nextHandler.capture || nextHandler.once || nextHandler.passive);
        const options = hasOptions
            ? {
                  capture: !!nextHandler.capture,
                  once: !!nextHandler.once,
                  passive: !!nextHandler.passive
              }
            : undefined;

        if (!had) node.addEventListener(type, handlers.handleEvent, options);
        handlers[type] = nextHandler;
    } else if (had) {
        node.removeEventListener(type, handlers.handleEvent);
        delete handlers[type];
    }
}
/**
 *
 * @param {*} style
 * @param {string} key
 * @param {string} value
 */
export function setPropertyStyle(style, key, value) {
    // Use removeProperty/setProperty for kebab-case keys,
    // keep direct assignment for camelCase for minimal overhead.
    if (key.indexOf("-") !== -1) {
        if (value == null) style.removeProperty(key);
        else style.setProperty(key, value);
        return;
    }
    style[key] = value;
}
