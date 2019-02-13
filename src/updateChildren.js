import { clearComponentEffects } from "./component";
import { defineVnode } from "./vnode";
import { createNode } from "./updateElement";
import { STATE, KEY, NODE_TEXT } from "./constants";
import { update } from "./update";

/**
 * Allows you to clean the effects associated with the node
 * @param {HTMLElement|SVGElement|Text} node
 * @param {boolean} isRemove
 */
export function clearElement(node, isRemove) {
    let { components } = node[STATE] || {},
        children = node.childNodes,
        length;
    if (!components) return;
    clearComponentEffects(components, isRemove);

    length = children.length;
    for (let i = 0; i < length; i++) {
        clearElement(children[i], true);
    }
}
/**
 * allows you to dispatch changes to children and update the nodeList
 * @param {HTMLElement|SVGAElement|Text} node
 * @param {array} nextChildren
 * @param {boolean} isSvg
 * @param {object} context
 * @param {object|undefined} withKeys
 */
export function updateChildren(node, nextChildren, isSvg, context, withKeys) {
    // get the current nodeList
    let prevChildren = node.childNodes,
        // check if the nextChildren of children is an associative list of keys
        mapKeys = withKeys ? {} : false,
        // if not a list of keys will clean the nodes from the length of nextChildren
        range = !mapKeys && nextChildren.length,
        length = prevChildren.length;
    for (let i = 0; i < length; i++) {
        let prevChild = prevChildren[i],
            isRemove;
        if (mapKeys && KEY in prevChild) {
            let key = prevChild[KEY];
            if (key in withKeys) {
                // add the children to the index of associative nodes per key
                mapKeys[key] = prevChild;
            } else {
                isRemove = true;
            }
        } else {
            if (i >= range) isRemove = true;
        }
        if (isRemove) {
            clearElement(prevChild, true);
            node.removeChild(prevChild);
            // backs an index to synchronize with the nodeList
            length--;
            i--;
        }
    }

    length = nextChildren.length;

    for (let i = 0; i < length; i++) {
        let vnode = defineVnode(nextChildren[i]),
            indexChild = prevChildren[i],
            prevChild = indexChild,
            nextSibling = prevChildren[i + 1];

        if (mapKeys) {
            prevChild = mapKeys[vnode.key];
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

        let nextChild = update(prevChild, vnode, isSvg, context);

        if (!prevChild) {
            if (nextSibling) {
                node.insertBefore(nextChild, nextSibling);
            } else {
                node.appendChild(nextChild);
            }
        }
    }
}
