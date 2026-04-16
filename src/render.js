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

// Node origin type constants — describes how newType should be instantiated
const ORIGIN_STRING = 0; // newType is a tag name string ("div", "span", etc.)
const ORIGIN_NODE = 1; // newType is a Node instance (direct DOM reference)
const ORIGIN_CLASS = 2; // newType is an HTMLElement subclass constructor
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

    // Read node[id] once — Symbol hash lookup is non-trivial, avoid repeating it
    const store = node && node[id];
    // If the node maintains the source vnode it escapes from the update tree
    if (store && store.vnode == newVnode) return node;

    const { type: newType, props: newProps = EMPTY_PROPS } = newVnode;

    isSvg = isSvg || newVnode.type == "svg";

    const originType =
        newType instanceof Node
            ? ORIGIN_NODE
            : newType["prototype"] instanceof HTMLElement
              ? ORIGIN_CLASS
              : ORIGIN_STRING;

    // determines if the node should be regenerated
    isNewNode =
        newType != "host" &&
        (originType == ORIGIN_NODE
            ? (node && newProps.cloneNode ? node[TYPE_NODE] : node) != newType
            : originType == ORIGIN_CLASS
              ? !(node instanceof newType)
              : node
                ? node[TYPE_NODE] || node.localName != newType
                : !node);

    if (isNewNode) {
        if (originType == ORIGIN_NODE && newProps.cloneNode) {
            node = newType.cloneNode(true);
            node[TYPE_NODE] = newType;
        } else {
            node =
                originType == ORIGIN_NODE
                    ? newType
                    : originType == ORIGIN_CLASS
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

    const oldVNodeStore = store || EMPTY_PROPS;

    /**
     * @type {import("vnode").VNodeStore}
     */
    const { vnode = EMPTY_PROPS, cycle = 0 } = oldVNodeStore;

    let { fragment, handlers = {} } = isNewNode ? {} : oldVNodeStore;

    /**
     * @type {import("vnode").VNodeGeneric}
     */
    const { props = EMPTY_PROPS } = isNewNode ? EMPTY_PROPS : vnode;
    const { children = EMPTY_CHILDREN } = props;

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
        // for loop avoids the O(n) element-shift cost of Array.shift()
        for (let i = 0; i < taskQueue.length; i++) taskQueue[i]();
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
     * Detect moveBefore support once, outside the hot loop.
     * Avoids a string property lookup on parent for every keyed node.
     */
    const canMoveBefore = keyes && "moveBefore" in parent;

    /**
     * RULES: that you should never exceed "c"
     * @type {ChildNode}
     */
    let currentNode = markStart;

    children &&
        flat(children, (child) => {
            const childType = typeof child;
            const isSerialize = childType === "string"; //CHECK
            const isVnode =
                childType == "object" && "type" in child && "props" in child;

            if (!isVnode && !isSerialize) {
                return;
            }

            const key = child.key;
            // Cursor & existing-node resolution
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

            //  Produce the next DOM node
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
                    canMoveBefore && (nextChildNode || childNode).isConnected
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
        if (!(key in nextProps))
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
        const prevIsObject = prevValue && isObject(prevValue);
        const nextIsObject = nextValue && isObject(nextValue);

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

    // single shared handler that delegates to handlers[type] by event type
    if (!handlers.handleEvent) {
        handlers.handleEvent = function (event) {
            const h = handlers[event.type];
            if (isFunction(h)) return h.call(node, event);
        };
    }

    const had = !!handlers[type];

    if (nextHandler) {
        // only build options object when flags are set (capture/once/passive)
        const hasOptions =
            nextHandler.capture || nextHandler.once || nextHandler.passive;
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
    // CSS custom properties (--var) and vendor prefixes (-webkit-) start with "-".
    // Standard camelCase properties (borderTop, opacity) are set via direct assignment.
    if (key[0] === "-") {
        if (value == null) style.removeProperty(key);
        else style.setProperty(key, value);
        return;
    }
    style[key] = value;
}
