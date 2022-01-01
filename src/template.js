import { h, render } from "./render.js";
/**
 * @template {Element} T
 * @param {any} vnode
 * @returns {T}
 */
export const template = (vnode) =>
    //@ts-ignore
    render(h("host", null, vnode), new DocumentFragment()).firstElementChild;
