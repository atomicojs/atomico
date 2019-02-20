import { isArray } from "./utils";
import { EMPTY_CHILDREN, SHADOWDOM } from "./constants";
/**
 * allows to transfer the arguments to createVnode
 * @param {string|function} tag - define the vnode to work
 * @param {object} [props] - vnode properties
 * @param {array} [children] - properties to be transmitted to the vnode
 */
export function h(tag, props, ...children) {
    return createVnode(tag, props, children);
}
/**
 * if the vnode is defined different from an object, it returns a vnode that creates a text node
 * @param {*} value
 * @return {object}
 */
export function defineVnode(value) {
    let type = typeof value;
    if (type === "object" && value.tag) {
        return value;
    } else {
        return {
            tag: "#text",
            children: type === "number" || type === "string" ? "" + value : ""
        };
    }
}
/**
 * create a representative object of the node to be created, updated or deleted
 * @param {string|function} tag - type of node to represent
 * @param {object} nextProps - properties of the node to represent
 * @param {array} nextChildren - children of the node to represent
 */
export function createVnode(tag, nextProps, nextChildren) {
    nextProps = nextProps || {};
    // Increase the indexes to be reused.
    let useKeys,
        // key identifier
        key,
        // list of children
        children,
        // amount of props
        size = 1,
        // Tag properties
        props = {},
        // define whether the node will update the context
        useContext,
        // announces that the node will use shadowDom
        useShadowDom,
        // lets you ignore updateChildren
        useChildren = true,
        // scan the children recursively to form a list without depth
        mapChildren = (nextChildren, deep = 0, children = []) => {
            let length = nextChildren.length,
                recicleChildren = true;
            // allows recycling to nextChildren, if the condition is met
            while (!deep && length === 1 && isArray(nextChildren[0])) {
                nextChildren = nextChildren[0];
                length = nextChildren.length;
            }

            for (let i = 0; i < length; i++) {
                let child = nextChildren[i];
                if (isArray(child)) {
                    mapChildren(child, deep + 1, children);
                    recicleChildren = false;
                } else {
                    let childType = typeof child;
                    if (childType === "object" && child.key !== undefined) {
                        useKeys = useKeys || {};
                        if (child.key in useKeys) {
                            throw new Error(
                                "Each key must be unique among children"
                            );
                        } else {
                            useKeys[child.key] = true;
                        }
                    } else {
                        if (useKeys) {
                            throw new Error("Each child must have a key");
                        }
                    }
                    children.push(child);
                }
            }
            return recicleChildren ? nextChildren : children;
        };

    for (let index in nextProps) {
        let value = nextProps[index];
        switch (index) {
            case "context":
                if (typeof value === "object") useContext = value;
                continue;
            case "children":
                if (value === false) useChildren = false;
                nextChildren = value;
                continue;
            case "innerHTML":
            case "textContent":
            case "contenteditable":
                useChildren = false;
                break;
            case "class":
                index = "className";
                break;
            case SHADOWDOM:
                useShadowDom = value;
                break;
            case "key":
                if (value === undefined) continue;
                key = value = "" + value;
                break;
        }
        props[index] = value;
        size++;
    }
    children = mapChildren(nextChildren || []);
    // children is empty, it is replaced by the constant, in order to compare the empty state
    props.children = children = children.length ? children : EMPTY_CHILDREN;

    return {
        tag,
        key,
        size,
        props,
        children,
        useKeys,
        useContext,
        useChildren,
        useShadowDom
    };
}
