import { NODE_HOST, JOIN_CHILDREN, LIMIT_NODE } from "../constants";
import { diffProps } from "./diff-props";
import { META_KEYES, isVnodeValue, fillVnodeValue, vNodeFill } from "../vnode";
import { createNode, equalNode, createLimitNode, insertNode } from "./utils";
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
    let index = 0;
    // limit Atomico's reach only to the comment marker
    let limitNode = parent[LIMIT_NODE];

    for (; index < childNodesLength; index++) {
        let childNode = childNodes[index];
        if (childNode == limitNode || childNode instanceof Comment) {
            limitNode = childNode;
            break;
        }
        if (keyes) {
            let key = childNode.dataset.key;
            if (keyes.includes(key)) {
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
    if (!limitNode) limitNode = createLimitNode(parent);

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

        let nextChildNode = diff(id, childNode, child, isSvg);

        if (!childNode) {
            insertNode(
                parent,
                nextChildNode,
                i == index ? limitNode : childNodes[i]
            );
            // increase the limit position since a new node has been inserted
            index++;
        }
    }
}
