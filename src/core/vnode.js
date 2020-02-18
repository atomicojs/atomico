import { ARRAY_EMPTY } from "./constants";

import { isArray, isFunction } from "./utils";

export let vNodeEmpty = createElement(null, { children: "" });

export let vNodeFill = createElement(null, { children: ARRAY_EMPTY });

export const META_MAP_CHILDREN = Symbol("mapChildren");

export const META_KEYES = Symbol("keyes");
/**
 * @param {VnodeType} nodeType
 * @param {VnodeProps} [props]
 * @param {Vnode|Vnode[]} [children]
 * @returns {Vnode}
 **/
export function createElement(nodeType, props, ...children) {
    return { children, ...props, nodeType: nodeType || null };
}
/**
 * toVnode, processes the object for correct use within the diff process.
 **/
export function toVnode(value) {
    if (isVnodeValue(value)) {
        return value;
    } else {
        // this process occurs only once per vnode
        if (!value[META_MAP_CHILDREN]) {
            let { children, keyes } = mapChildren(value.children);
            value.children = children.length ? children : ARRAY_EMPTY;
            if (keyes && keyes.length == children.length) {
                value[META_KEYES] = keyes;
            }
            value[META_MAP_CHILDREN] = true;
        }
    }
    return value;
}

function mapChildren(children, scan = { children: [] }, deep = 0) {
    if (isArray(children)) {
        let length = children.length;
        for (let i = 0; i < length; i++) {
            mapChildren(children[i], scan, deep + 1);
        }
    } else {
        if (children == null && !deep) return scan;

        let vnode = toVnode(children);

        if (vnode != null && typeof vnode == "object") {
            if (isFunction(vnode.nodeType)) {
                let { nodeType, ...props } = vnode;
                return mapChildren(nodeType(props), scan, deep + 1);
            }
            if ("id" in vnode) {
                scan.keyes = scan.keyes || [];
                if (!scan.keyes.includes(vnode.id)) {
                    scan.keyes.push(vnode.id);
                }
            }
        }

        scan.children.push(vnode);
    }
    return scan;
}

export function isVnodeEmpty(value) {
    let type = typeof value;
    return value == null || type == "boolean" || type == "function";
}

export function fillVnodeValue(value) {
    return isVnodeEmpty(value)
        ? vNodeEmpty
        : createElement(null, { children: "" + value });
}

export function isVnodeValue(value) {
    let type = typeof value;
    return (
        value == null ||
        type == "string" ||
        type == "number" ||
        type == "function" ||
        type == "boolean"
    );
}

/**
 * @typedef {(Object<string,any>)} VnodeProps;
 *
 * @typedef {(Function|string)} VnodeType;
 *
 * @typedef {{type:VnodeType,props:VnodeProps}} Vnode
 **/
