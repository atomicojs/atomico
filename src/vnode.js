import { isArray } from "./utils";
import { NODE_TEXT } from "./constants";
/**
 * Analyze if the object has a basic format to be a vdodo otherwise returns a text format.
 * @param {*} value
 * @return {object}
 * @example
 * {
 *     tag : "h1",
 *     nextProps : {id:"10"}
 *     children : ["content"]
 * }
 */
export function defineVnode(value) {
    let type = typeof value;
    if (type === "object" && value.tag) {
        return value;
    } else {
        return vnode(NODE_TEXT, {
            nodeValue: type === "string" || type === "number" ? value : ""
        });
    }
}
/**
 * create an optimized vnode
 * @param {function|string} tag - if it is a function, the vnode will be a component.
 * @param {object|null} [nextProps] - properties to associate to the node or component
 * @param {array} [nextChildren] - children to associate to the node or component
 */
export function vnode(tag, nextProps, nextChildren) {
    nextProps = nextProps || {};

    let useKeys,
        // key identifier
        key = nextProps.key,
        // children counter, used inside scan
        length = 0,
        // list of children
        children = [],
        props = { children },
        // announces that the node manipulates the context
        useContext = nextProps.context,
        // announces that the node will use shadowDom
        useShadowDom = nextProps.shadowDom,
        // lets you ignore updateChildren
        useChildren = tag === NODE_TEXT,
        // scan the children recursively to form a list without depth
        mapChildren = nextChildren => {
            let sLength = nextChildren.length;
            for (let i = 0; i < sLength; i++) {
                let child = nextChildren[i];
                if (isArray(child)) {
                    mapChildren(child);
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
                    children[length++] = child;
                }
            }
        };

    for (let key in nextProps) {
        let value = nextProps[key];
        switch (key) {
            case "children":
                nextChildren = value;
                break;
            case "innerHTML":
                useChildren = true;
                break;
            case "textContent":
                key = "nodeValue";
            case "class":
                key = "className";
            default:
                props[key] = value;
        }
    }

    mapChildren(nextChildren || []);

    return {
        tag,
        key,
        props,
        children,
        useKeys,
        useContext,
        useShadowDom,
        useChildren
    };
}
