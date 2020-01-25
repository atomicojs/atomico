import {
    KEY,
    META_KEYES,
    NODE_TYPE,
    NODE_HOST,
    JOIN_CHILDREN
} from "../constants";
import { diffProps } from "./diff-props";
import { isVnodeValue, fillVnodeValue, vNodeFill } from "../vnode";
import { isRawNode } from "../utils";
/**
 *
 * @param {import("./render").ConfigRender} config
 * @param {import("./render").HTMLNode} node
 * @param {import("./vnode").Vnode} nextVnode
 * @param {boolean} isSvg
 * @param {Function} currentUpdateComponent
 * @return {import("./render").HTMLNode}
 **/
export function diff(id, node, nextVnode, isSvg) {
    let { vnode, handlers = {} } = (node && node[id]) || {};

    if (vnode == nextVnode && vnode != null) return node;

    nextVnode = isVnodeValue(nextVnode) ? fillVnodeValue(nextVnode) : nextVnode;

    let { nodeType, shadowDom, children, is, ...props } = vnode || vNodeFill;

    let {
        nodeType: nextNodeType,
        shadowDom: nextShadowDom,
        children: nextChildren,
        is: nextIs,
        ...nextProps
    } = nextVnode;

    isSvg = isSvg || nextNodeType == "svg";

    if (
        nextNodeType != NODE_HOST &&
        (!equalNode(node, nextNodeType) || is != nextIs)
    ) {
        let nextNode = createNode(nextNodeType, isSvg, nextIs);
        let parent = node && node.parentNode;
        if (parent) {
            parent.replaceChild(nextNode, node);
        }

        node = nextNode;
        handlers = {};
    }

    if (JOIN_CHILDREN[nextNodeType]) {
        nextNodeType = null;
        nextChildren = nextChildren.join("");
    }
    if (nextNodeType == null) {
        if (node.textContent != nextChildren) {
            node.textContent = nextChildren;
        }
    } else {
        if (shadowDom != nextShadowDom) {
            let { shadowRoot } = node;
            let mode =
                nextShadowDom && !shadowRoot
                    ? "open"
                    : !nextShadowDom && shadowRoot
                    ? "closed"
                    : 0;
            if (mode) node.attachShadow({ mode });
        }

        let ignoreChildren = diffProps(
            node,
            props,
            nextProps,
            isSvg,
            handlers,
            id
        );

        if (!ignoreChildren && children != nextChildren) {
            diffChildren(
                id,
                nextShadowDom ? node.shadowRoot : node,
                nextChildren,
                nextProps[META_KEYES],
                isSvg
            );
        }
    }
    node[id] = { vnode: nextVnode, handlers };
    return node;
}
/**
 *
 * @param {import("./render").ConfigRender} config
 * @param {import("./render").HTMLNode} parent
 * @param {import("./vnode").Vnode[]} [nextChildren]
 * @param {boolean} isSvg
 */
export function diffChildren(id, parent, children, keyes, isSvg) {
    let childrenLenght = children.length;
    let { childNodes } = parent;
    let childNodesKeyes = {};
    let childNodesLength = childNodes.length;
    let index = keyes
        ? 0
        : childNodesLength > childrenLenght
        ? childrenLenght
        : childNodesLength;

    for (; index < childNodesLength; index++) {
        let childNode = childNodes[index];
        let key = index;
        if (keyes) {
            key = childNode[KEY];
            if (keyes.includes(key)) {
                childNodesKeyes[key] = childNode;
                continue;
            }
        }
        index--;
        childNodesLength--;
        parent.removeChild(childNode);
    }
    for (let i = 0; i < childrenLenght; i++) {
        let child = children[i];
        let indexChildNode = childNodes[i];
        let key = keyes ? child.key : i;
        let childNode = keyes ? childNodesKeyes[key] : indexChildNode;

        if (keyes && childNode) {
            if (childNode != indexChildNode) {
                parent.insertBefore(childNode, indexChildNode);
            }
        }

        let nextChildNode = diff(id, childNode, child, isSvg);

        if (!childNode) {
            if (childNodes[i]) {
                parent.insertBefore(nextChildNode, childNodes[i]);
            } else {
                parent.appendChild(nextChildNode);
            }
        }
    }
}

/**
 *
 * @param {string} type
 * @param {boolean} isSvg
 * @returns {import("./render").HTMLNode}
 */
export function createNode(type, isSvg, is) {
    let doc = document;
    let nextNode;
    if (type != null) {
        if (isRawNode(type)) {
            return type;
        }
        nextNode = isSvg
            ? doc.createElementNS("http://www.w3.org/2000/svg", type)
            : doc.createElement(type, is ? { is } : null);
    } else {
        nextNode = doc.createTextNode("");
    }
    return nextNode;
}
/**
 * compare 2 nodes, to define if these are equal
 * @param {string|null|HTMLElement|SVGElement} nodeA
 * @param {string|null|HTMLElement|SVGElement} nodeB
 */
export function equalNode(nodeA, nodeB) {
    let isRawA = nodeA && isRawNode(nodeA);
    let isRawB = nodeB && isRawNode(nodeB);
    if (isRawB && isRawA) {
        return isRawB == isRawB;
    }
    if (nodeA) {
        if (!nodeA[NODE_TYPE]) {
            nodeA[NODE_TYPE] = nodeA.nodeName.toLowerCase();
        }

        let localName = nodeA[NODE_TYPE];
        return (localName == "#text" ? null : localName) == nodeB;
    }
}
