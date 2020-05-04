import { isFunction } from "./utils";

const KEY = Symbol();
const GLOBAL_ID = Symbol("");
const LIMIT_NODE = Symbol("");
const HYDRATE_PROPS = {
    id: 1,
    className: 1,
    checked: 1,
    value: 1,
    selected: 1,
};
const EMPTY_PROPS = {};
const EMPTY_CHILDREN = [];
const TYPE_TEXT = 3;
const TYPE_ELEMENT = 1;
const TYPE_COMMENT = 8;

export function h(type, props, ...children) {
    props = props || EMPTY_PROPS;

    children = flat(props.children || children);

    if (!children.length) {
        children = EMPTY_CHILDREN;
    }

    return {
        type,
        props,
        children,
        key: props.key,
        shadow: props.shadowDom,
        raw: type.nodeType == TYPE_ELEMENT,
    };
}

export function render(vnode, node, id = GLOBAL_ID, $ = document) {
    diff(id, node, vnode, false, $);
}

function diff(id, node, vnode, isSvg, $) {
    isSvg = isSvg || vnode.type == "svg";
    let isNewNode = vnode.raw
        ? node != vnode.type
        : node
        ? node.localName != vnode.type
        : !node;

    if (vnode.type != "host" && isNewNode) {
        let nextNode;
        if (vnode.type != null) {
            if (vnode.type.nodeType) {
                return vnode.type;
            }
            nextNode = isSvg
                ? $.createElementNS("http://www.w3.org/2000/svg", vnode.type)
                : vnode.is
                ? $.createElement(vnode.type, { is: vnode.is })
                : $.createElement(vnode.type);
        } else {
            return $.createTextNode(vnode || "");
        }

        node = nextNode;
    }

    if (node.nodeType == TYPE_TEXT) {
        if (node.data != vnode) {
            node.data = vnode || "";
        }
        return node;
    }

    let oldVNode = node[id] || EMPTY_PROPS;
    let oldVnodeProps = oldVNode.props || EMPTY_PROPS;
    let oldVnodeChildren = oldVNode.children || EMPTY_CHILDREN;
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
        diffChildren(id, nextParent, vnode.children, isSvg, $);
    }

    node[id] = { vnode, handlers };

    return node;
}

function diffChildren(id, parent, children, isSvg, $) {
    let keyes = children._;
    let childrenLenght = children.length;
    let childNodes = parent.childNodes;
    let childNodesKeyes = {};
    let childNodesLength = childNodes.length;
    let index = 0;
    // limit Atomico's reach only to the comment marker
    let limitNode = parent[LIMIT_NODE];
    for (; index < childNodesLength; index++) {
        let childNode = childNodes[index];
        if (childNode == limitNode || childNode.nodeType == TYPE_COMMENT) {
            limitNode = childNode;
            break;
        }
        if (keyes) {
            let key = childNode[KEY];
            if (keyes[key]) {
                childNodesKeyes[key] = childNode;
                continue;
            }
        }

        if (keyes || index >= childrenLenght) {
            index--;
            childNodesLength--;
            childNode.remove();
        }
    }
    // If you don't find a bookmark in the list, you create it.
    if (!limitNode) {
        limitNode = parent.appendChild($.createComment(""));
    }

    parent[LIMIT_NODE] = limitNode;

    for (let i = 0; i < childrenLenght; i++) {
        let child = children[i];
        let indexChildNode = i == index ? null : childNodes[i];
        let key = keyes ? child.key : i;
        let childNode = keyes ? childNodesKeyes[key] : indexChildNode;

        if (keyes && childNode) {
            if (childNode != indexChildNode) {
                parent.insertBefore(childNode, indexChildNode);
            }
        }

        let nextChildNode;
        let replaceChild;
        if (child) {
            nextChildNode = diff(id, childNode, child, isSvg, $);
            replaceChild = childNode && nextChildNode != childNode;
        } else {
            if ((childNode && childNode.nodeType != TYPE_TEXT) || !childNode) {
                nextChildNode = $.createTextNode("");
                replaceChild = true;
            }
        }

        if (!childNode) {
            parent.insertBefore(
                nextChildNode,
                i == index ? limitNode : childNodes[i]
            );
            index++;
        } else {
            replaceChild && parent.replaceChild(nextChildNode, childNode);
        }
    }
}

/**
 *
 * @param {import("./render").HTMLNode} node
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

function setProperty(node, key, prevValue, nextValue, isSvg, handlers) {
    key = key == "class" && !isSvg ? "className" : key;
    // define empty value
    prevValue = prevValue == null ? null : prevValue;
    nextValue = nextValue == null ? null : nextValue;

    if (key in node && HYDRATE_PROPS[key]) {
        prevValue = node[key];
    }

    if (nextValue === prevValue) return;

    if (
        key[0] == "o" &&
        key[1] == "n" &&
        (isFunction(nextValue) || isFunction(prevValue))
    ) {
        setEvent(node, key, nextValue, handlers);
        return;
    }

    switch (key) {
        case "key":
            node[KEY] = nextValue;
            break;
        case "ref":
            if (nextValue) nextValue.current = node;
            break;
        case "style":
            let style = node.style;
            let prevIsObject;

            prevValue = prevValue || "";

            if (typeof prevValue == "object") {
                prevIsObject = true;
                for (let key in prevValue) {
                    if (!(key in nextValue)) setPropertyStyle(style, key, null);
                }
            }
            if (typeof nextValue == "object") {
                for (let key in nextValue) {
                    let value = nextValue[key];
                    if (prevIsObject && prevValue[key] === value) continue;
                    setPropertyStyle(style, key, value);
                }
            } else {
                style.cssText = nextValue || "";
            }

            break;
        default:
            if (!isSvg && key != "list" && key in node) {
                node[key] = nextValue == null ? "" : nextValue;
            } else if (nextValue == null) {
                node.removeAttribute(key);
            } else {
                node.setAttribute(
                    key,
                    typeof nextValue == "object"
                        ? JSON.stringify(nextValue)
                        : nextValue
                );
            }
    }
}

/**
 *
 * @param {import("./render").HTMLNode} node
 * @param {string} type
 * @param {function} [nextHandler]
 * @param {object} handlers
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

function setPropertyStyle(style, key, value) {
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

function flat(children, map = []) {
    for (let i = 0; i < children.length; i++) {
        let child = children[i];
        if (child) {
            if (Array.isArray(child)) {
                flat(child, map);
                continue;
            }
            if (child.key != null) {
                if (!map.keyes) map._ = {};
                map._[child.key] = 1;
            }
        }
        let type = typeof child;
        child = type == "boolean" || type == "function" ? "" : child;
        map.push(child);
    }
    return map;
}
