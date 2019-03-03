import { update, createNode } from "./update";
import { defineVnode } from "./vnode";
import { NODE_TEXT, COMPONENT_REMOVE, COMPONENT_CLEAR } from "./constants";
/**
 * issue elimination to the entire tree of nodes
 * @param {string} ID
 * @param {HTMLElement|SVGElement|Text} node
 */
export function clearNode(ID, node, clear, currentUpdateComponent) {
    let { updateComponent } = node[ID] || {},
        nodeList = node.childNodes,
        length = nodeList.length;
    if (updateComponent && updateComponent !== currentUpdateComponent) {
        updateComponent(clear ? COMPONENT_CLEAR : COMPONENT_REMOVE);
    }
    for (let i = 0; i < length; i++) {
        clearNode(ID, nodeList[i]);
    }
}
/**
 *
 * @param {string} ID
 * @param {HTMLElement|SVGElement|Text} node - node to extract current children
 * @param {object} vnextChildren  - list of children to update
 * @param {object|undefined} useKeys - index of keys to keep in the next update
 * @param {boolean} isSvg - define if it is a svg tree
 * @param {object} context - current context to share
 * @return {HTMLElement|SVGElement|Text}
 */
export function updateChildren(
    ID,
    node,
    vnextChildren,
    useKeys,
    isSvg,
    context
) {
    let nodeKeys = {},
        nodeList = node.childNodes,
        nodeListLength = nodeList.length,
        vnodeListLength = vnextChildren.length,
        /**
         * modifies the start of the iteration based on the type whether it is using keys or indexes
         * this is done for a deletion without iterate completely nodeList
         */
        nodeListIndexStart = useKeys
            ? 0
            : nodeListLength > vnodeListLength
            ? vnodeListLength
            : nodeListLength;
    for (; nodeListIndexStart < nodeListLength; nodeListIndexStart++) {
        let nodeChild = nodeList[nodeListIndexStart],
            isRemove,
            key = nodeListIndexStart;
        // if the iteration uses keys, the node is stored in the index corresponding to its key
        if (useKeys) {
            key = nodeChild.dataset.key;
            if (key in useKeys) {
                nodeKeys[key] = nodeChild;
            } else {
                isRemove = true;
            }
        } else {
            isRemove = true;
        }
        if (nodeChild && isRemove) {
            clearNode(ID, nodeChild);
            nodeListLength--;
            nodeListIndexStart--;
            node.removeChild(nodeChild);
        }
    }
    for (let i = 0; i < vnodeListLength; i++) {
        let vnode = defineVnode(vnextChildren[i]),
            nextSibling = nodeList[i + 1],
            useKey = useKeys ? vnode.key : i,
            indexChild = nodeList[i],
            prevChild = useKeys ? nodeKeys[vnode.key] : indexChild;

        if (useKeys) {
            if (prevChild !== indexChild) {
                node.insertBefore(prevChild, indexChild);
            }
        }

        // if it is a component and it does not have an associative node, it will create one to work within update
        if (typeof vnode.tag === "function") {
            if (!prevChild) {
                prevChild = createNode(NODE_TEXT);
                if (nextSibling) {
                    node.insertBefore(prevChild, nextSibling);
                } else {
                    node.appendChild(prevChild);
                }
            }
        }

        let nextNode = update(ID, prevChild, vnode, isSvg, context);

        if (!prevChild) {
            if (nextSibling) {
                node.insertBefore(nextNode, nextSibling);
            } else {
                node.appendChild(nextNode);
            }
        }
    }
}
