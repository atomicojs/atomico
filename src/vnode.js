import { isArray } from "./utils";
import { NODE_TEXT } from "./constants";
/**
 * Analyze if the object has a basic format to be a vdodo otherwise returns a text format.
 * @param {*} value
 * @return {object}
 * @example
 * {
 *     tag : "h1",
 *     props : {id:"10"}
 *     children : ["content"]
 * }
 */
export function defineVnode(value) {
    let type = typeof value;
    if (type === "object" && value.tag) {
        return value;
    } else {
        return {
            tag: NODE_TEXT,
            children: type === "string" || type === "number" ? value : ""
        };
    }
}
/**
 * create an optimized vnode
 * @param {function|string} tag - if it is a function, the vnode will be a component.
 * @param {object|null} [props] - properties to associate to the node or component
 * @param {array} [groupChildren] - children to associate to the node or component
 */
export function vnode(tag, props, groupChildren) {
    props = props || {};

    let withKeys,
        // key identifier
        key = props.key,
        // children counter, used inside scan
        length = 0,
        // list of children
        children = [],
        // announces that the node manipulates the context
        withContext = props.context,
        // announces that the node will use shadowDom
        withShadowDom = props.shadowDom,
        // scan the children recursively to form a list without depth
        scan = groupChildren => {
            let sLength = groupChildren.length;
            for (let i = 0; i < sLength; i++) {
                let child = groupChildren[i];
                if (isArray(child)) {
                    scan(child);
                } else {
                    if (child && child.key !== undefined) {
                        withKeys = withKeys || {};
                        if (child.key in withKeys) {
                            throw new Error(
                                "Each key must be unique among children"
                            );
                        } else {
                            withKeys[child.key] = true;
                        }
                    } else {
                        if (withKeys) {
                            throw new Error("Each child must have a key");
                        }
                    }
                    children[length++] = child;
                }
            }
        };

    scan(props.children || groupChildren || []);

    return {
        tag,
        key,
        props: { ...props, children },
        children,
        withKeys,
        withContext,
        withShadowDom
    };
}
