import { update } from "./update";
import { vnode } from "./vnode";
export { options } from "./options";

export { useHook, useState, useEffect, useContext } from "./component";

export { useRef, useMemo } from "./customHooks";

export function h(tag, props, ...children) {
    return vnode(tag, props, children);
}

export { createContext } from "./createContext";
/**
 * Render translates the vnode to DOM state
 * @param {*} vnode
 * @param {*} node
 * @param {*} isHost - this utility is added with the purpose of
 *                     promoting the use of web-components, I have
 *                     modified the process of updating the DOM,
 *                     with the intention of facilitating the use of
 *                     the host tag when working with web-components,
 *                     this allows to create a parallel state that is
 *                     not shared with the default state.
 *
 *                     when enabling host use, you should always
 *                     return the <host /> tag
 */
export function render(vnode, node, isHost) {
    if (isHost) {
        if (typeof vnode.tag !== "function") {
            throw new Error(
                "If host is defined as true, the vnode must be a component"
            );
        }
    }
    update(
        node,
        isHost
            ? vnode
            : typeof vnode === "object" && vnode.tag === "host"
            ? vnode
            : h("host", {}, vnode),
        isHost
    );
}
