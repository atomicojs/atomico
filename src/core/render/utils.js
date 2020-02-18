import { LIMIT_NODE } from "../constants";

export const isRawNode = node => node instanceof Node;

export const createLimitNode = parent =>
    (parent[LIMIT_NODE] = parent.appendChild(new Comment()));
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
        if (!nodeA.localName) {
            nodeA.localName = nodeA.nodeName.toLowerCase();
        }

        let localName = nodeA.localName;
        return (localName == "#text" ? null : localName) == nodeB;
    }
}

export function insertNode(parent, newNode, beforeNode, afterLimit) {
    let limitNode = parent[LIMIT_NODE];

    if (!limitNode) {
        let { childNodes } = parent;
        let length = childNodes.length;
        for (let i = 0; i < length; i++) {
            let child = childNodes[length];
            if (child instanceof Comment) {
                limitNode = child;
                break;
            }
        }
    }

    if (!limitNode) limitNode = createLimitNode(parent);

    parent[afterLimit ? "appendChild" : "insertBefore"](
        newNode,
        beforeNode || limitNode
    );
}
