import { h, $, render } from "./render.js";
/**
 * @template {Element} T
 * @param {any} vnode
 * @param {DocumentFragment} [base]
 * @returns {T}
 */
export let template = (vnode, base = $.createElement("template").content) =>
    //@ts-ignore
    render(h("host", null, vnode), base).children[0];
