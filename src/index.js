import { update } from "./update";
import { vnode } from "./vnode";
export { options } from "./options";

export { useHook, useState, useEffect, useContext } from "./component";

export { useRef, useMemo } from "./customHooks";

export function h(tag, props, ...children) {
    return vnode(tag, props, children);
}

export { createContext } from "./createContext";

export function render(vnode, node, hostComponent) {
    update(
        node,
        hostComponent
            ? vnode
            : typeof vnode === "object" && vnode.tag === "host"
            ? vnode
            : h("host", {}, vnode)
    );
}
