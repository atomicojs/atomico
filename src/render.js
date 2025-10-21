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

export const TYPE = SymbolFor("type");

export const TYPE_NODE = SymbolFor("ref");

export const TYPE_VNODE = SymbolFor("vnode");

export const Fragment = () => {};

/**
 * @type {import("vnode").H}
 */
export const h = (type, p, ...args) => {
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

    const raw = type
        ? type instanceof Node
            ? 1
            : //@ts-ignore
              type.prototype instanceof HTMLElement && 2
        : 0;

    //@ts-ignore
    if (raw === false && type instanceof Function) {
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
        [TYPE]: TYPE_VNODE,
        type,
        props,
        children,
        key: props.key,
        // key for lists by keys
        // define if the node declares its shadowDom
        shadow: props.shadowDom,
        // allows renderings to run only once
        static: props.staticNode,
        // defines whether the type is a childNode `1` or a constructor `2`
        raw,
        // defines whether to use the second parameter for document.createElement
        is: props.is,
        // clone the node if it comes from a reference
        clone: props.cloneNode
    };

    //@ts-ignore
    return vnode;
};

/**
 * Create or update a node
 * Node: The declaration of types through JSDOC does not allow to compress
 * the exploration of the parameters
 * @param {ReturnType<h>} newVnode
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
    if (
        (node && node[id] && node[id].vnode == newVnode) ||
        newVnode[TYPE] != TYPE_VNODE
    )
        return node;
    // The process only continues when you may need to create a node
    if (newVnode || !node) {
        isSvg = isSvg || newVnode.type == "svg";
        // determines if the node should be regenerated
        isNewNode =
            newVnode.type != "host" &&
            (newVnode.raw == 1
                ? (node && newVnode.clone ? node[TYPE_NODE] : node) !=
                  newVnode.type
                : newVnode.raw == 2
                ? !(node instanceof newVnode.type)
                : node
                ? node[TYPE_NODE] || node.localName != newVnode.type
                : !node);

        if (isNewNode && newVnode.type != null) {
            if (newVnode.raw == 1 && newVnode.clone) {
                node = newVnode.type.cloneNode(true);
                node[TYPE_NODE] = newVnode.type;
            } else {
                node =
                    newVnode.raw == 1
                        ? newVnode.type
                        : newVnode.raw == 2
                        ? new newVnode.type()
                        : isSvg
                        ? document.createElementNS(
                              "http://www.w3.org/2000/svg",
                              newVnode.type
                          )
                        : document.createElement(
                              newVnode.type,
                              newVnode.is ? { is: newVnode.is } : undefined
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
    const { children = EMPTY_CHILDREN, props = EMPTY_PROPS } = vnode;

    /**
     * @type {import("vnode").Handlers}
     */
    handlers = isNewNode ? {} : handlers || {};
    /**
     * Escape a second render if the vnode.type is equal
     */
    if (newVnode.static && !isNewNode) return node;

    newVnode.shadow &&
        !node.shadowRoot &&
        // @ts-ignore
        node.attachShadow({ mode: "open", ...newVnode.shadow });

    newVnode.props != props &&
        renderProps(node, props, newVnode.props, handlers, isSvg, taskQueue);

    if (newVnode.children !== children) {
        const nextParent = newVnode.shadow ? node.shadowRoot : node;

        fragment = renderChildren(
            newVnode.children,
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
            if (typeof child == "object" && !child[TYPE]) {
                return;
            }

            const key = child[TYPE] && child.key;
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
            if (!child[TYPE]) {
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
                if (!childNode || keyes) {
                    parent.insertBefore(nextChildNode, currentNode);

                    keyes &&
                        currentNode != markEnd &&
                        removeNodes.add(currentNode);
                } else if (childNode == markEnd) {
                    parent.insertBefore(nextChildNode, markEnd);
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
    /**
     * @type {any}
     */
    const currentHandlers = handlers;
    // add handleEvent to handlers
    if (!currentHandlers.handleEvent) {
        /**
         * {@link https://developer.mozilla.org/es/docs/Web/API/EventTarget/addEventListener#The_value_of_this_within_the_handler}
         **/
        currentHandlers.handleEvent = (event) =>
            handlers[event.type].call(node, event);
    }
    if (nextHandler) {
        // create the subscriber if it does not exist
        if (!handlers[type]) {
            //the event configuration is only subscribed at the time of association
            const options =
                nextHandler.capture || nextHandler.once || nextHandler.passive
                    ? Object.assign({}, nextHandler)
                    : null;
            node.addEventListener(type, currentHandlers, options);
        }
        // update the associated event
        handlers[type] = nextHandler;
    } else {
        // 	delete the associated event
        if (handlers[type]) {
            node.removeEventListener(type, currentHandlers);
            delete handlers[type];
        }
    }
}
/**
 *
 * @param {*} style
 * @param {string} key
 * @param {string} value
 */
export function setPropertyStyle(style, key, value) {
    let method = "setProperty";
    if (value == null) {
        method = "removeProperty";
        value = null;
    }
    if (~key.indexOf("-")) {
        style[method](key, value);
    } else {
        style[key] = value;
    }
}
