import { h, render, Mark } from "./src/core.js";
import { isArray } from "./src/utils.js";
/**
 * @type {Object<string,{ref: HTMLDivElement, id: number, mount?: boolean}>}
 */
const TEST_HOST = {};

let TEST_KEY = 0;

const fill = (vnode) =>
    vnode && vnode.type == "host" ? vnode : h("host", null, vnode);

if (window.beforeEach) {
    window.beforeEach(() => {
        const id = ++TEST_KEY;
        const host = document.createElement("div");
        host.id = "fixture-" + id;
        TEST_HOST[id] = {
            id,
            host,
        };
    });
    if (window.afterEach) {
        window.afterEach(() => {
            const { host } = TEST_HOST[TEST_KEY];
            host.remove();
        });
    }
}

/**
 *
 * @param {Element} node
 * @param {string|symbol} [id]
 * @returns
 */
export const getFragment = (node, id) => {
    const children = [];
    if (id) {
        if (node[id].fragment) {
            let { markStart, markEnd } = node[id].fragment;
            while ((markStart = markStart.nextSibling) != markEnd)
                children.push(markStart);
        }
    } else {
        let markStart = node.firstChild;
        while (markStart) {
            if (!(markStart instanceof Mark)) children.push(markStart);
            markStart = markStart.nextSibling;
        }
    }
    return children;
};
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

    const children = getFragment(ref.host, id);

    return nextVnode == vnode
        ? ref.host
        : isArray(vnode)
        ? children
        : children[0];
}

/**
 * @param {ChildNode | typeof  window } node
 * @param {string} type
 * @param {boolean | AddEventListenerOptions} [options]
 * @returns {Promise<Event>}
 */
export const asyncEventListener = (node, type, options) =>
    new Promise((resolve) => node.addEventListener(type, resolve, options));

/**
 * @type {import("./types/test-dom").DispatchEvent}
 */
export const dispatchEvent = (currentTarget, event, target) => {
    if (target != null) {
        Object.defineProperty(event, "target", { value: target });
    }
    return currentTarget.dispatchEvent(event);
};
