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
};
// Immutable for comparison of empty properties
const EMPTY_PROPS = {};
// Immutable for empty children comparison
const EMPTY_CHILDREN = [];
// Used to identify text type nodes when using Node.nodeType
const TYPE_TEXT = 3;
// Used to identify tag type nodes when using Node.nodeType
const TYPE_ELEMENT = 1;
// Internal marker to know if the vdom comes from Atomico
export const vdom = Symbol();
// Symbol used to retrieve the key that associates the node to the keyes
export const KEY = Symbol();
// Default ID used to store the VDom state
export const ID = Symbol();
/**
 * @param {string|null|RawNode} type
 * @param {object} [p]
 * @param  {...any} children
 * @returns {Vdom}
 */
export function h(type, p, ...children) {
    let props = p || EMPTY_PROPS;

    children = flat(props.children || children, type == "style");

    if (!children.length) {
        children = EMPTY_CHILDREN;
    }

    return {
        vdom,
        type,
        props,
        children,
        key: props.key,
        shadow: props.shadowDom,
        //@ts-ignore
        raw: type.nodeType == TYPE_ELEMENT,
    };
}

/**
 * Create or update a node
 * Node: The declaration of types through JSDOC does not allow to compress
 * the exploration of the parameters
 * @param {any} vnode
 * @param {RawNode} node
 * @param {ID} [id]
 * @param {boolean} [isSvg]
 * @param {Document} [$]
 */

export function render(vnode, node, id = ID, isSvg, $ = document) {
    let isNewNode;
    // If the node maintains the source vnode it escapes from the update tree
    if (node && node[id] && node[id].vnode == vnode) return node;
    // Injecting object out of Atomico context
    if (vnode && vnode.type && vnode.vdom != vdom) return node;

    // The process only continues when you may need to create a node
    if (vnode != null || !node) {
        isSvg = isSvg || vnode.type == "svg";
        isNewNode =
            vnode.type != "host" &&
            (vnode.raw
                ? node != vnode.type
                : node
                ? node.localName != vnode.type
                : !node);

        if (isNewNode) {
            let nextNode;
            if (vnode.type != null) {
                nextNode = vnode.raw
                    ? vnode.type
                    : isSvg
                    ? $.createElementNS(
                          "http://www.w3.org/2000/svg",
                          vnode.type
                      )
                    : $.createElement(
                          vnode.type,
                          vnode.is ? { is: vnode.is } : null
                      );
            } else {
                return $.createTextNode(vnode + "");
            }

            node = nextNode;
        }
    }
    if (node.nodeType == TYPE_TEXT) {
        vnode += "";
        if (node.data != vnode) {
            node.data = vnode || "";
        }
        return node;
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

    if (vnode.shadow) {
        if (!node.shadowRoot) {
            node.attachShadow({ mode: "open" });
        }
    }

    if (vnode.props != oldVnodeProps) {
        diffProps(node, oldVnodeProps, vnode.props, handlers, isSvg);
    }

    if (vnode.children != oldVnodeChildren) {
        let nextParent = vnode.shadow ? node.shadowRoot : node;
        renderChildren(vnode.children, nextParent, id, isSvg, $);
    }

    node[id] = { vnode, handlers };

    return node;
}
/**
 * This method should only be executed from render,
 * it allows rendering the children of the virtual-dom
 * @param {FlatParamMap} children
 * @param {RawNode|ShadowRoot} parent
 * @param {any} id
 * @param {boolean} isSvg
 * @param {Document} $
 */
export function renderChildren(children, parent, id, isSvg, $) {
    let keyes = children._;
    let childrenLenght = children.length;
    let childNodes = parent.childNodes;
    let childNodesLength = childNodes.length;
    let index = keyes
        ? 0
        : childNodesLength > childrenLenght
        ? childrenLenght
        : childNodesLength;

    for (; index < childNodesLength; index++) {
        let childNode = childNodes[index];

        if (keyes) {
            let key = childNode[KEY];
            if (keyes.has(key)) {
                keyes.set(key, childNode);
                continue;
            }
        }

        index--;
        childNodesLength--;
        childNode.remove();
    }
    for (let i = 0; i < childrenLenght; i++) {
        let child = children[i];
        let indexChildNode = childNodes[i];
        let key = keyes ? child.key : i;
        let childNode = keyes ? keyes.get(key) : indexChildNode;

        if (keyes && childNode) {
            if (childNode != indexChildNode) {
                parent.insertBefore(childNode, indexChildNode);
            }
        }

        if (keyes && child.key == null) continue;

        let nextChildNode = render(child, childNode, id, isSvg, $);

        if (!childNode) {
            if (childNodes[i]) {
                parent.insertBefore(nextChildNode, childNodes[i]);
            } else {
                parent.appendChild(nextChildNode);
            }
        } else if (nextChildNode != childNode) {
            parent.replaceChild(nextChildNode, childNode);
        }
    }
}

/**
 *
 * @param {RawNode} node
 * @param {Object} props
 * @param {Object} nextProps
 * @param {boolean} isSvg
 * @param {Object} handlers
 **/
function diffProps(node, props, nextProps, handlers, isSvg) {
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
function setProperty(node, key, prevValue, nextValue, isSvg, handlers) {
    key = key == "class" && !isSvg ? "className" : key;
    // define empty value
    prevValue = prevValue == null ? null : prevValue;
    nextValue = nextValue == null ? null : nextValue;

    if (key in node && FROM_PROP[key]) {
        prevValue = node[key];
    }

    if (nextValue === prevValue || key == "shadowDom") return;

    if (
        key[0] == "o" &&
        key[1] == "n" &&
        (isFunction(nextValue) || isFunction(prevValue))
    ) {
        setEvent(node, key, nextValue, handlers);
    } else if (key == "key") {
        node[KEY] = nextValue;
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
    // get the name of the event to use
    type = type.slice(type[2] == "-" ? 3 : 2);
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
 * @param {Array<any>} children
 * @param {boolean} [saniate] - If true, children only accept text strings
 * @param {FlatParamMap} map
 * @returns {FlatParamMap}
 */
export function flat(children, saniate, map = []) {
    for (let i = 0; i < children.length; i++) {
        let child = children[i];
        if (child) {
            if (Array.isArray(child)) {
                flat(child, saniate, map);
                continue;
            }
            if (child.key != null) {
                if (!map._) map._ = new Map();

                map._.set(child.key, 0);
            }
        }
        let type = typeof child;
        child =
            child == null ||
            type == "boolean" ||
            type == "function" ||
            (type == "object" && (child.vdom != vdom || saniate))
                ? ""
                : child;
        if (saniate) {
            map[0] = (map[0] || "") + child;
        } else {
            map.push(child);
        }
    }
    return map;
}

/**
 * @typedef {object} Vdom
 * @property {any} type
 * @property {symbol} vdom
 * @property {Object<string,any>} props
 * @property {FlatParamMap} [children]
 * @property {any} [key]
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
