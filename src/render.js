import { isFunction, isObject } from "./utils.js";
// Object used to know which properties are extracted directly
// from the node to verify 2 if they have changed
const FROM_PROP = {
    id: 1,
    className: 1,
    checked: 1,
    value: 1,
    selected: 1,
};
// Map of attributes that escape the property analysis
const WITH_ATTR = {
    list: 1,
    type: 1,
    size: 1,
    form: 1,
    width: 1,
    height: 1,
    src: 1,
    href: 1,
};
// Immutable for comparison of empty properties
const EMPTY_PROPS = {};
// Immutable for empty children comparison
const EMPTY_CHILDREN = [];
// Used to identify text type nodes when using Node.nodeType
const TYPE_TEXT = 3;
// Alias for document
const $ = document;
// Fragment marker
export class Mark extends Text {
    // Prevents internal manipulation in renderChildren
    get nodeType() {
        return -1;
    }
}
// Internal marker to know if the vdom comes from Atomico
export const vdom = Symbol();
// Default ID used to store the VDom state
export const ID = Symbol();
/**
 * @param {string|null|RawNode} type
 * @param {object} [p]
 * @param  {...any} children
 * @returns {Vdom}
 */
export function h(type, p, ...argsChildren) {
    let props = p || EMPTY_PROPS;

    let { children } = props;

    children =
        children != null
            ? children
            : argsChildren.length
            ? argsChildren
            : EMPTY_CHILDREN;

    const raw = type
        ? type instanceof Node
            ? 1
            : type.prototype instanceof HTMLElement && 2
        : false;

    return {
        vdom,
        type,
        props,
        children,
        key: props.key,
        shadow: props.shadowDom,
        //@ts-ignore
        raw,
    };
}

/**
 * Create or update a node
 * Node: The declaration of types through JSDOC does not allow to compress
 * the exploration of the parameters
 * @param {Vdom} vnode
 * @param {RawNode} node
 * @param {ID} [id]
 * @param {boolean} [isSvg]
 */

export function render(vnode, node, id = ID, isSvg) {
    let isNewNode;
    // If the node maintains the source vnode it escapes from the update tree
    if ((node && node[id] && node[id].vnode == vnode) || vnode.vdom != vdom)
        return node;
    // The process only continues when you may need to create a node
    if (vnode || !node) {
        isSvg = isSvg || vnode.type == "svg";
        isNewNode =
            vnode.type != "host" &&
            (vnode.raw == 1
                ? node != vnode.type
                : vnode.raw == 2
                ? !(node instanceof vnode.type)
                : node
                ? node.localName != vnode.type
                : !node);
        if (isNewNode) {
            if (vnode.ref) {
                return vnode.ref.cloneNode(true);
            } else if (vnode.type != null) {
                vnode.ref = node =
                    vnode.raw == 1
                        ? vnode.type
                        : vnode.raw == 2
                        ? new vnode.type()
                        : isSvg
                        ? $.createElementNS(
                              "http://www.w3.org/2000/svg",
                              vnode.type
                          )
                        : $.createElement(
                              vnode.type,
                              vnode.is ? { is: vnode.is } : undefined
                          );
            }
        }
    }
    /**
     * @type {Vdom}
     */
    let oldVNode = node[id] ? node[id].vnode : EMPTY_PROPS;
    /**
     * @type {Vdom["props"]}
     */
    let oldVnodeProps = oldVNode.props || EMPTY_PROPS;
    /**
     * @type {Vdom["children"]}
     */
    let oldVnodeChildren = oldVNode.children || EMPTY_CHILDREN;
    /**
     * @type {Handlers}
     */
    let handlers = isNewNode || !node[id] ? {} : node[id].handlers;

    let fragment = node[id] && node[id].fragment;

    if (vnode.shadow) {
        if (!node.shadowRoot) {
            node.attachShadow({ mode: "open" });
        }
    }

    if (vnode.props != oldVnodeProps) {
        diffProps(node, oldVnodeProps, vnode.props, handlers, isSvg);
    }

    if (vnode.children !== oldVnodeChildren) {
        let nextParent = vnode.shadow ? node.shadowRoot : node;
        fragment = renderChildren(
            vnode.children,
            /**
             * @todo for hydration use attribute and send childNodes
             */
            fragment,
            nextParent,
            id,
            // add support to foreignObject, children will escape from svg
            isSvg && vnode.type == "foreignObject" ? false : isSvg
        );
    }

    node[id] = { vnode, handlers, fragment };

    return node;
}
/**
 * This method should only be executed from render,
 * it allows rendering the children of the virtual-dom
 * @param {any} children
 * @param {Fragment} fragment
 * @param {RawNode|ShadowRoot} parent
 * @param {any} id
 * @param {boolean} [isSvg]
 */
export function renderChildren(children, fragment, parent, id, isSvg) {
    children =
        children == null
            ? null
            : Array.isArray(children)
            ? children
            : [children];
    /**
     * @type {Fragment}
     */
    let nextFragment = fragment || {
        s: parent.appendChild(new Mark("")),
        e: parent.appendChild(new Mark("")),
    };

    let { s, e, k } = nextFragment;
    /**
     * @type {Keyed}
     */
    let nk;
    /**
     * Eliminate intermediate nodes that are not used in the process in keyed
     * @type {Set<Element>}
     */
    let rk = k && new Set();
    /**
     * RULES: that you should never exceed "c"
     * @type {Node}
     */
    let c = s;
    /**
     * @todo analyze the need to clean up certain tags
     * local recursive instance, flatMap consumes the array, swapping positions
     * @param {any[]} children
     */
    const flatMap = (children) => {
        const { length } = children;
        for (let i = 0; i < length; i++) {
            const child = children[i];
            const type = typeof child;

            if (child == null || type == "boolean" || type == "function") {
                continue;
            } else if (Array.isArray(child)) {
                flatMap(child);
                continue;
            } else if (type == "object" && child.vdom != vdom) {
                continue;
            }

            const key = child.vdom && child.key;
            const childKey = k && key != null && k.get(key);
            // check if the displacement affected the index of the child with
            // assignment of key, if so the use of nextSibling is prevented
            if (c != e && c === childKey) {
                rk.delete(c);
            } else {
                c = c == e ? e : c.nextSibling;
            }

            const childNode = k ? childKey : c;

            let nextChildNode = childNode;
            // text node diff
            if (!child.vdom) {
                const text = child + "";
                if (nextChildNode.nodeType != TYPE_TEXT) {
                    nextChildNode = new Text(text);
                } else if (nextChildNode.data != text) {
                    nextChildNode.data = text;
                }
            } else {
                // node diff, either update or creation of the new node.
                nextChildNode = render(child, childNode, id, isSvg);
            }
            if (nextChildNode != c) {
                k && rk.delete(nextChildNode);
                if (!childNode || k) {
                    parent.insertBefore(nextChildNode, c);
                    if (k && c != e) rk.add(c);
                } else if (childNode == e) {
                    parent.insertBefore(nextChildNode, e);
                } else {
                    parent.replaceChild(nextChildNode, childNode);
                    c = nextChildNode;
                }
            }
            // if there is a key, a map of keys is created
            if (key != null) {
                nk = nk || new Map();
                nk.set(key, nextChildNode);
            }
        }
    };

    children && flatMap(children);

    c = c == e ? e : c.nextSibling;

    if (fragment && c != e) {
        // cleaning of remnants within the fragment
        while (c != e) {
            let r = c;
            c = c.nextSibling;
            r.remove();
        }
    }

    rk && rk.forEach((node) => node.remove());

    nextFragment.k = nk;

    return nextFragment;
}

/**
 *
 * @param {RawNode} node
 * @param {Object} props
 * @param {Object} nextProps
 * @param {boolean} isSvg
 * @param {Object} handlers
 **/
export function diffProps(node, props, nextProps, handlers, isSvg) {
    for (let key in props) {
        if (!(key in nextProps)) {
            setProperty(node, key, props[key], null, isSvg, handlers);
        }
    }
    for (let key in nextProps) {
        setProperty(node, key, props[key], nextProps[key], isSvg, handlers);
    }
}

/**
 *
 * @param {RawNode} node
 * @param {string} key
 * @param {any} prevValue
 * @param {any} nextValue
 * @param {boolean} isSvg
 * @param {Handlers} handlers
 */
export function setProperty(node, key, prevValue, nextValue, isSvg, handlers) {
    key = key == "class" && !isSvg ? "className" : key;
    // define empty value
    prevValue = prevValue == null ? null : prevValue;
    nextValue = nextValue == null ? null : nextValue;

    if (key in node && FROM_PROP[key]) {
        prevValue = node[key];
    }

    if (
        nextValue === prevValue ||
        key == "shadowDom" ||
        key == "children" ||
        key == "key" ||
        key[0] == "_"
    )
        return;

    if (
        key[0] == "o" &&
        key[1] == "n" &&
        (isFunction(nextValue) || isFunction(prevValue))
    ) {
        setEvent(node, key.slice(2), nextValue, handlers);
    } else if (key == "ref") {
        if (nextValue) nextValue.current = node;
    } else if (key == "style") {
        let style = node.style;

        prevValue = prevValue || "";
        nextValue = nextValue || "";

        let prevIsObject = isObject(prevValue);
        let nextIsObject = isObject(nextValue);

        if (prevIsObject) {
            for (let key in prevValue) {
                if (nextIsObject) {
                    if (!(key in nextValue)) setPropertyStyle(style, key, null);
                } else {
                    break;
                }
            }
        }

        if (nextIsObject) {
            for (let key in nextValue) {
                let value = nextValue[key];
                if (prevIsObject && prevValue[key] === value) continue;
                setPropertyStyle(style, key, value);
            }
        } else {
            style.cssText = nextValue;
        }
    } else {
        if (
            (!isSvg && !WITH_ATTR[key] && key in node) ||
            isFunction(nextValue) ||
            isFunction(prevValue)
        ) {
            node[key] = nextValue == null ? "" : nextValue;
        } else if (nextValue == null) {
            node.removeAttribute(key);
        } else {
            node.setAttribute(
                key,
                isObject(nextValue) ? JSON.stringify(nextValue) : nextValue
            );
        }
    }
}

/**
 *
 * @param {RawNode} node
 * @param {string} type
 * @param {Listener} [nextHandler]
 * @param {Handlers} [handlers]
 */
export function setEvent(node, type, nextHandler, handlers) {
    // add handleEvent to handlers
    if (!handlers.handleEvent) {
        /**
         * {@link https://developer.mozilla.org/es/docs/Web/API/EventTarget/addEventListener#The_value_of_this_within_the_handler}
         **/
        handlers.handleEvent = (event) =>
            handlers[event.type].call(node, event);
    }
    if (nextHandler) {
        // create the subscriber if it does not exist
        if (!handlers[type]) {
            node.addEventListener(type, handlers);
        }
        // update the associated event
        handlers[type] = nextHandler;
    } else {
        // 	delete the associated event
        if (handlers[type]) {
            node.removeEventListener(type, handlers);
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

/**
 * @typedef {Map<any,Element>} Keyed
 */

/**
 * @typedef {Object} Fragment
 * @property {Comment} s
 * @property {Comment} e
 * @property {Keyed} [k]
 */

/**
 * @typedef {Object} Vdom
 * @property {any} type
 * @property {symbol} vdom
 * @property {Object<string,any>} props
 * @property {FlatParamMap} [children]
 * @property {any} [key]
 * @property {Element} [ref]
 * @property {boolean} [raw]
 * @property {boolean} [shadow]
 */

/**
 *
 * @typedef {Object} HandleEvent
 * @property {(event:Event|CustomEvent)=>any} handleEvent
 */

/**
 *
 * @typedef {(event:Event|CustomEvent)=>any} Listener
 */

/**
 * @typedef {Object<string,Listener> & HandleEvent } Handlers
 */

/**
 * @typedef {Object<string,any>} StyleFill
 */

/**
 * @typedef {Object} Style
 * @property {string} cssText
 */

/**
 * @typedef { any } RawNode
 */

/**
 * @typedef {symbol|string} ID
 */

/**
 * @typedef {Array<any> & {_?:Map<any,any>}} FlatParamMap
 */

/**
 * @typedef {ChildNode[] & {splice?:any}} Nodes
 */
