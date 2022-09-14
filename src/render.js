import { isFunction, isObject, isArray, flat, isHydrate } from "./utils.js";
import { options } from "./options.js";
// Object used to know which properties are extracted directly
// from the node to verify 2 if they have changed
let VAL_FROM_PROPS = {
    checked: 1,
    value: 1,
    selected: 1,
};
// Map of attributes that escape the property analysis
let PROPS_AS_ATTRS = {
    list: 1,
    type: 1,
    size: 1,
    form: 1,
    width: 1,
    height: 1,
    src: 1,
    href: 1,
    slot: 1,
};
// escapes from diffProps compare process
let INTERNAL_PROPS = {
    shadowDom: 1,
    staticNode: 1,
    cloneNode: 1,
    children: 1,
    key: 1,
};
// Immutable for comparison of empty properties
let EMPTY_PROPS = {};
// Immutable for empty children comparison
let EMPTY_CHILDREN = [];
// Alias for document
export let $ = document;
// Fragment marker
export class Mark extends Text {}

let SymbolFor = Symbol.for;
// Default ID used to store the Vnode state
export let ID = SymbolFor("Atomico.ID");
// Internal marker to know if the Vnode comes from Atomico
export let $$ = SymbolFor("Atomico.$$");

export let REF = SymbolFor("Atomico.REF");

export const Fragment = SymbolFor("Atomico.Fragment");

/**
 * @todo use the vnode.render property as a replacement for vnode.$$
 * @param {Element} node
 * @param {import("vnode").RenderId} [id]
 * @param {boolean} [hydrate]
 * @return {ChildNode}
 */
export function RENDER(node, id, hydrate) {
    return diff(this, node, id, hydrate);
}
/**
 * @type {import("vnode").H}
 */
export let h = (type, p, ...args) => {
    /**
     * @type {any}
     */
    let props = p || EMPTY_PROPS;

    let { children } = props;

    children =
        children != null ? children : args.length ? args : EMPTY_CHILDREN;

    if (type === Fragment) {
        //@ts-ignore
        return children;
    }

    let raw = type
        ? type instanceof Node
            ? 1
            : //@ts-ignore
              type.prototype instanceof HTMLElement && 2
        : 0;

    /**
     * @todo look for a more elegant type, since you can't follow the type rules without capturing this
     * @type {any}
     */
    let render = options.render || RENDER;

    /**
     * @type {import("vnode").VNodeAny}
     */
    let vnode = {
        $$,
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
        clone: props.cloneNode,
        render,
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
 * @param {boolean} [hydrate]
 * @param {boolean} [isSvg]
 * @returns {ChildNode}
 */
function diff(newVnode, node, id = ID, hydrate, isSvg) {
    let isNewNode;
    // If the node maintains the source vnode it escapes from the update tree
    if ((node && node[id] && node[id].vnode == newVnode) || newVnode.$$ != $$)
        return node;
    // The process only continues when you may need to create a node
    if (newVnode || !node) {
        isSvg = isSvg || newVnode.type == "svg";
        // determines if the node should be regenerated
        isNewNode =
            newVnode.type != "host" &&
            (newVnode.raw == 1
                ? (node && newVnode.clone ? node[REF] : node) != newVnode.type
                : newVnode.raw == 2
                ? !(node instanceof newVnode.type)
                : node
                ? node[REF] || node.localName != newVnode.type
                : !node);

        if (isNewNode && newVnode.type != null) {
            if (newVnode.raw == 1 && newVnode.clone) {
                hydrate = true;
                node = newVnode.type.cloneNode(true);
                node[REF] = newVnode.type;
            } else {
                node =
                    newVnode.raw == 1
                        ? newVnode.type
                        : newVnode.raw == 2
                        ? new newVnode.type()
                        : isSvg
                        ? $.createElementNS(
                              "http://www.w3.org/2000/svg",
                              newVnode.type
                          )
                        : $.createElement(
                              newVnode.type,
                              newVnode.is ? { is: newVnode.is } : undefined
                          );
            }
        }
    }

    /**
     * @type {import("vnode").VNodeStore}
     */
    let {
        vnode = EMPTY_PROPS,
        cycle = 0,
        fragment,
        handlers,
    } = node[id] ? node[id] : EMPTY_PROPS;

    /**
     * @type {import("vnode").VNodeGeneric}
     */
    let { children = EMPTY_CHILDREN, props = EMPTY_PROPS } = vnode;

    /**
     * @type {import("vnode").Handlers}
     */
    handlers = isNewNode ? {} : handlers || {};
    /**
     * Escape a second render if the vnode.type is equal
     */
    if (newVnode.static && !isNewNode) return node;

    newVnode.shadow && !node.shadowRoot && node.attachShadow({ mode: "open" });

    newVnode.props != props &&
        diffProps(node, props, newVnode.props, handlers, isSvg);

    if (newVnode.children !== children) {
        let nextParent = newVnode.shadow ? node.shadowRoot : node;
        fragment = renderChildren(
            newVnode.children,
            /**
             * @todo for hydration use attribute and send childNodes
             */
            fragment,
            nextParent,
            id,
            // add support to foreignObject, children will escape from svg
            !cycle && hydrate,
            isSvg && newVnode.type == "foreignObject" ? false : isSvg
        );
    }

    cycle++;

    node[id] = { vnode: newVnode, handlers, fragment, cycle };

    return node;
}
/**
 *
 * @param {Element|ShadowRoot} parent
 * @param {boolean} [hydrate]
 * @return {import("vnode").Fragment}
 */
function createFragment(parent, hydrate) {
    let markStart = new Mark("");
    let markEnd = new Mark("");
    let node;

    parent[hydrate ? "prepend" : "append"](markStart);

    if (hydrate) {
        let { firstElementChild } = parent;
        while (firstElementChild) {
            if (isHydrate(firstElementChild)) {
                node = firstElementChild;
                break;
            }
            firstElementChild = firstElementChild.nextElementSibling;
        }
    }

    if (node) {
        parent.insertBefore(markEnd, node);
    } else {
        parent.append(markEnd);
    }

    return {
        markStart,
        markEnd,
    };
}

/**
 * This method should only be executed from render,
 * it allows rendering the children of the virtual-dom
 * @param {any} children
 * @param {import("vnode").Fragment} fragment
 * @param {Element|ShadowRoot} parent
 * @param {any} id
 * @param {boolean} [hydrate]
 * @param {boolean} [isSvg]
 */
export function renderChildren(children, fragment, parent, id, hydrate, isSvg) {
    children =
        children == null ? null : isArray(children) ? children : [children];

    let nextFragment = fragment || createFragment(parent, hydrate);

    let { markStart, markEnd, keyes } = nextFragment;
    /**
     * @type {import("vnode").Keyes}
     */
    let nextKeyes;
    /**
     * Eliminate intermediate nodes that are not used in the process in keyed
     * @type {Set<ChildNode>}
     */
    let removeNodes = keyes && new Set();
    /**
     * RULES: that you should never exceed "c"
     * @type {ChildNode}
     */
    let currentNode = markStart;

    children &&
        flat(children, (child) => {
            let type = typeof child;

            if (type == "object" && child.$$ != $$) {
                return;
            }

            let key = child.$$ && child.key;
            let childKey = keyes && key != null && keyes.get(key);
            // check if the displacement affected the index of the child with
            // assignment of key, if so the use of nextSibling is prevented
            if (currentNode != markEnd && currentNode === childKey) {
                removeNodes.delete(currentNode);
            } else {
                currentNode =
                    currentNode == markEnd ? markEnd : currentNode.nextSibling;
            }

            let childNode = keyes ? childKey : currentNode;

            let nextChildNode = childNode;
            // text node diff
            if (!child.$$) {
                let text = child + "";
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
                // @ts-ignore
                nextChildNode = diff(child, childNode, id, hydrate, isSvg);
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
            let r = currentNode;
            currentNode = currentNode.nextSibling;
            r.remove();
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
 * @param {boolean} isSvg
 * @param {import("vnode").Handlers} handlers
 **/
export function diffProps(node, props, nextProps, handlers, isSvg) {
    for (let key in props) {
        !(key in nextProps) &&
            setProperty(node, key, props[key], null, isSvg, handlers);
    }
    for (let key in nextProps) {
        setProperty(node, key, props[key], nextProps[key], isSvg, handlers);
    }
}

/**
 *
 * @param {Element} node
 * @param {string} key
 * @param {any} prevValue
 * @param {any} nextValue
 * @param {boolean} isSvg
 * @param {import("vnode").Handlers} handlers
 */
export function setProperty(node, key, prevValue, nextValue, isSvg, handlers) {
    key = key == "class" && !isSvg ? "className" : key;
    // define empty value
    prevValue = prevValue == null ? null : prevValue;
    nextValue = nextValue == null ? null : nextValue;

    if (key in node && VAL_FROM_PROPS[key]) {
        prevValue = node[key];
    }

    if (nextValue === prevValue || INTERNAL_PROPS[key] || key[0] == "_") return;

    if (
        key[0] == "o" &&
        key[1] == "n" &&
        (isFunction(nextValue) || isFunction(prevValue))
    ) {
        setEvent(node, key.slice(2), nextValue, handlers);
    } else if (key == "ref") {
        if (nextValue) {
            if (isFunction(nextValue)) {
                nextValue(node);
            } else {
                nextValue.current = node;
            }
        }
    } else if (key == "style") {
        /**
         * @todo Find out why Element defines style at the type level
         * @type {any}
         */
        let { style } = node;

        prevValue = prevValue || "";
        nextValue = nextValue || "";

        let prevIsObject = isObject(prevValue);
        let nextIsObject = isObject(nextValue);

        if (prevIsObject) {
            for (let key in prevValue) {
                if (nextIsObject) {
                    !(key in nextValue) && setPropertyStyle(style, key, null);
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
        let attr = key[0] == "$" ? key.slice(1) : key;
        if (
            attr === key &&
            ((!isSvg && !PROPS_AS_ATTRS[key] && key in node) ||
                isFunction(nextValue) ||
                isFunction(prevValue))
        ) {
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
}

/**
 *
 * @param {Node} node
 * @param {string} type
 * @param {import("vnode").VNodeListener} [nextHandler]
 * @param {import("vnode").Handlers} [handlers]
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
            //the event configuration is only subscribed at the time of association
            let options =
                nextHandler.capture || nextHandler.once || nextHandler.passive
                    ? Object.assign({}, nextHandler)
                    : null;
            node.addEventListener(type, handlers, options);
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

export { diff as render };
