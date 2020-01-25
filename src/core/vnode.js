import {
    ARRAY_EMPTY,
    SUPPORT_STYLE_SHEET,
    META_STYLE_SHEET,
    META_MAP_CHILDREN,
    STYLE_SHEET_KEY,
    META_KEYES
} from "./constants";

import { isArray, isFunction } from "./utils";

export let vNodeEmpty = createElement(null, { children: "" });

export let vNodeFill = createElement(null, { children: ARRAY_EMPTY });

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
            if (keyes) {
                value[META_KEYES] = keyes;
            }
            value[META_MAP_CHILDREN] = true;
        }
        if (value.styleSheet && !SUPPORT_STYLE_SHEET) {
            if (!value[META_STYLE_SHEET]) {
                // When patching styleSheet, define whether to keep ARRAY_EMPTY
                // or create a new array to fill and thus keep the reference intact
                value.children =
                    value.children == ARRAY_EMPTY ? [] : value.children;
                // add the node to the children list
                value.children.unshift(
                    toVnode(
                        createElement(
                            "style",
                            value[META_KEYES] ? { key: STYLE_SHEET_KEY } : {},
                            value.styleSheet
                        )
                    )
                );
                // if it is a list with keys, add the key to keyes
                if (value[META_KEYES]) {
                    value[META_KEYES].unshift(STYLE_SHEET_KEY);
                }
            }
            value[META_STYLE_SHEET] = true;
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
            if ("key" in vnode) {
                scan.keyes = scan.keyes || [];
                if (!scan.keyes.includes(vnode.key)) {
                    scan.keyes.push(vnode.key);
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
