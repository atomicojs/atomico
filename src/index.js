import { update } from "./update";
import { vnode } from "./vnode";
export { options } from "./options";

export { useHook, useState, useEffect, useContext } from "./component";

export { useRef, useMemo } from "./customHooks";

export function h(tag, props, ...children) {
    return vnode(tag, props, children);
}

export function render(vnode, node) {
    update(
        node,
        typeof node == "object" && node.tag === "host"
            ? node
            : {
                  tag: "host",
                  children: [vnode]
              }
    );
}
