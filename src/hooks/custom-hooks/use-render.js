import { render, createElement } from "../../render.js";
import { useHost } from "../create-hooks.js";
import { useInsertionEffect } from "../hooks.js";
import { useId } from "../create-hooks.js";

/**
 * Ensures that the render function always
 * receives a tree that starts from the host tag
 * @param {any} vnode
 */
const fillHost = (vnode) =>
    vnode && vnode.type === "host"
        ? vnode
        : createElement("host", { children: vnode });

/**
 * @type {import("hooks").UseRender}
 */
export const useRender = (view, args) => {
    const host = useHost();

    const id = useId();

    useInsertionEffect(() => {
        render(fillHost(view()), host.current, host[id]);
    }, args);
};
