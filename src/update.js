import { NODE_TEXT, NODE_HOST, TAG_VALUE, COMPONENT_UPDATE } from "./constants";
import { options } from "./options";
import { defineVnode } from "./vnode";
import { updateChildren } from "./updateChildren";
import { updateProperties } from "./updateProperties";
import { createUpdateComponent } from "./component";
import { setTask } from "./task";
import { createVnode } from "./vnode";
/**
 * @param {object} vnode
 * @param {HTMLElement|SVGElement} node
 * @param {string} [customID]
 * @param {boolean} disableHost
 */
export function render(vnode, node, disableHost, customID = "vstate") {
    if (!disableHost) {
        vnode = defineVnode(vnode);
        if (vnode.tag !== NODE_HOST) {
            vnode = createVnode(NODE_HOST, {}, [vnode]);
        }
    }
    update(customID, node, vnode);
}

export function createNode(tag, isSvg) {
    let doc = options.document || document,
        nextNode;
    if (tag !== NODE_TEXT) {
        nextNode = isSvg
            ? doc.createElementNS("http://www.w3.org/2000/svg", tag)
            : doc.createElement(tag);
    } else {
        nextNode = doc.createTextNode("");
    }
    nextNode[TAG_VALUE] = tag;
    return nextNode;
}

export function getNodeName(node) {
    if (!node) return;
    // store the process locally in the node to avoid transformation
    if (!node[TAG_VALUE]) {
        node[TAG_VALUE] = node.nodeName.toLowerCase();
    }
    return node[TAG_VALUE];
}
/**
 *
 * @param {string} ID - store the process locally in the node to avoid transformation
 * @param {HTMLElement|SVGElement|Text|undefined} prevNode - if the current node is defined and the next
 * one to be used is different, the replacement of the current node will be made
 * @param {*} vnode
 * @param {boolean} isSvg
 * @param {object} context
 * @param {function|undefined} currentUpdateComponent
 */
export function update(
    ID,
    prevNode,
    vnode,
    isSvg,
    context,
    currentUpdateComponent
) {
    // get a node object
    vnode = defineVnode(vnode);
    // if the previous state exists, it obtains the state
    let { vnode: vprevnode, handlers = {}, updateComponent } =
        (prevNode && prevNode[ID]) || {};
    // if the node stored in the previous state is identical to the current one,
    // it will not execute the update process
    if (vnode === vprevnode) return prevNode;

    let {
        // defines the next node to manipulate the concurrent tree
        tag: nextTag,
        // define the properties that the next node must possess
        props: nextProps,
        // define the children that this node must possess in the following state
        children: nextChildren,
        // transmits keys to the updateChildren that is kept in the children list
        useKeys,
        // define if they would use updateChildren
        useChildren,
        // define if shadowDom was used
        useShadowDom
    } = vnode;
    // define if the tree is of the SVG type
    isSvg = isSvg || nextTag === "svg";

    let nextNode = prevNode,
        isFunction = typeof nextTag === "function";

    // create an updateComponent
    if (isFunction && !updateComponent) {
        updateComponent = createUpdateComponent(ID, isSvg);
    }

    if (
        getNodeName(prevNode) !== nextTag &&
        nextTag !== "host" &&
        !isFunction
    ) {
        nextNode = createNode(nextTag, isSvg);
        handlers = {};
        let parent = prevNode && prevNode.parentNode;
        if (parent) parent.replaceChild(nextNode, prevNode);
    }
    if (updateComponent && currentUpdateComponent !== updateComponent) {
        return updateComponent(COMPONENT_UPDATE, nextNode, vnode, context);
    } else if (nextTag !== NODE_TEXT) {
        updateProperties(nextNode, nextProps, handlers, isSvg);
        if (useChildren && (vprevnode || {}).children !== vnode.children) {
            updateChildren(
                ID,
                useShadowDom ? nextNode.shadowRoot || nextNode : nextNode,
                nextChildren,
                useKeys,
                isSvg,
                context
            );
        }
    } else {
        if (nextNode.nodeValue !== nextChildren) {
            nextNode.nodeValue = nextChildren;
        }
    }

    nextNode[ID] = { handlers, vnode, updateComponent };

    return nextNode;
}
