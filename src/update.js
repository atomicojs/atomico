import { createComponent, clearComponentEffects } from "./component";
import { updateElement, defineNodeTag } from "./updateElement";
import { updateChildren, clearElement } from "./updateChildren";
import { updateProperties } from "./updateProperties";
import { defineVnode } from "./vnode";
import { STATE, NODE_TEXT } from "./constants";
/**
 * updates a node based on the state of the vnode
 * @param {HTMLElement|SVGAElement|Text} [prevNode] - if false update returns a new node
 * @param {object|text|number} vnode - define next node state
 * @param {boolean} isSvg - define if the tree is of type svg
 * @param {object} context - current context
 * @param {number} [deep] - High order component depth
 * @param {array} [components] - List of high-order components associated with the node
 * @return {HTMLElement|SVGAElement|Text}
 */
export function update(
    prevNode,
    vnode,
    isSvg,
    context = {},
    deep = 0,
    components = []
) {
    let prevState = (prevNode && prevNode[STATE]) || {};
    // check if the previous state is identical to the current one, if so avoid the process
    if (prevState.vnode === vnode) {
        return prevNode;
    }
    // check if the vnode is valid
    vnode = defineVnode(vnode);

    let { props: prevProps } = prevState.vnode || {};

    let {
            /**
             * shows that keys are kept within children
             * @example
             * {1:true,3:true,5:true}
             **
             * these keys allow you to clean existing children in withKeys.             */
            withKeys,
            // shows if the vnode modifies the context
            withContext,
            // shows if the vdodo uses with shadowDom
            withShadowDom,
            // define the nodeName | component associated with the deer
            tag: nextTag,
            //  properties to define the node
            props: nextProps,
            // children to deliver to the node
            children: nextChildren
        } = vnode,
        // is reserved to be occupied by the current component
        component;
    // define if the node tree is of type svg
    isSvg = nextTag === "svg" || isSvg;
    // create or maintain your current context
    context = withContext ? { ...context, ...withContext } : context;
    // obtains the list of components associated with the node
    components = prevState.components || components;
    // get the current component based on the depth of the list
    component = components[deep];
    /**
     * Check if the current component is different requested
     * if it is different, we proceed to clear this
     */
    if (component && component.tag !== nextTag) {
        clearComponentEffects(components.splice(deep), true);
        component = false;
    }
    /**
     * recover or create the current component
     */
    if (typeof nextTag === "function") {
        // check if the component already has an instance, if it does not own, create one.
        if ((component || {}).tag !== nextTag) {
            components[deep] = createComponent(
                nextTag,
                isSvg,
                deep,
                components
            );
        }
        // resumes the instance of the current component
        component = components[deep];
        // associates the previous state of the tag with the current one or creates a text type.
        nextTag = defineNodeTag(prevNode) || NODE_TEXT;
    }
    // create or keep the next node to work
    let nextNode = updateElement(prevNode, nextTag, isSvg);
    // if prevNode has a definition, it proceeds to the replacement of the node
    if (prevNode && prevNode !== nextNode) {
        if (!component) clearElement(prevNode);
        prevNode.parentNode.replaceChild(nextNode, prevNode);
    }
    // if it is a component, the update is issued
    if (component) {
        component.set(nextNode, nextProps, context);
        // if the component maintains a wait state, its update is ignored
        return component.prevent ? nextNode : component.update();
    } else if (nextTag !== NODE_TEXT) {
        // updates the properties associated with the node
        updateProperties(nextNode, prevProps, nextProps, isSvg);
        // update the children of the node
        updateChildren(
            withShadowDom ? nextNode.shadowRoot || nextNode : nextNode,
            nextChildren || [],
            isSvg,
            context,
            withKeys
        );
    } else {
        if (nextNode.nodeValue !== nextChildren) {
            nextNode.nodeValue = nextChildren;
        }
    }

    nextNode[STATE] = { vnode, components };

    return nextNode;
}
