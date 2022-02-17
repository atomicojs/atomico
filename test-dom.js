import { h, render } from "./src/core.js";
import { isArray } from "./src/utils.js";
/**
 * @type {Object<string,{ref: HTMLDivElement, id: number, mount?: boolean}>}
 */
const TEST_HOST = {};

let TEST_KEY = 0;

const fill = (vnode) =>
    vnode && vnode.type == "host" ? vnode : h("host", null, vnode);

if (window.beforeEach) {
    beforeEach(() => {
        const id = ++TEST_KEY;
        TEST_HOST[id] = {
            id,
            host: document.createElement("div"),
        };
    });

    if (window.afterEach) {
        afterEach(() => {
            const { host } = TEST_HOST[TEST_KEY];
            host.remove();
        });
    }
}

/**
 *
 * @param {any} Vnode
 * @returns {HTMLDivElement}
 */
export function fixture(vnode) {
    const ref = TEST_HOST[TEST_KEY];

    if (!ref)
        throw "fixture depends on the global functions beforeEach and afterEach";

    const nextVnode = fill(vnode);

    const id = "fixture:" + ref.id;

    render(nextVnode, ref.host, id);

    // insert the content into the document
    if (!ref.mount) {
        ref.mount = true;
        document.body.appendChild(ref.host);
    }

    let { markStart, markEnd } = ref.host[id].fragment;

    const children = [];

    while ((markStart = markStart.nextSibling) != markEnd)
        children.push(markStart);

    return nextVnode == vnode
        ? ref.host
        : isArray(vnode)
        ? children
        : children[0];
}
