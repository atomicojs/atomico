import { h, render } from "./render.js";
import { options } from "./options.js";
/**
 * @template {Element} T
 * @param {any} vnode
 * @param {DocumentFragment} [base]
 * @returns {T}
 */
export const template = (
    vnode,
    base = !options.ssr && document.createElement("template").content
) =>
    //@ts-ignore
    base ? render(h("host", null, vnode), base).children[0] : vnode;
