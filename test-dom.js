import { h, render } from "./src/core.js";
import { isArray } from "./src/utils.js";
/**
 * @type {Object<string,{ref: HTMLDivElement, id: number, mount?: boolean}>}
 */
const TEST_HOST = {};

let TEST_KEY = 0;

try {
    beforeEach(() => {
        const id = ++TEST_KEY;
        TEST_HOST[id] = {
            id,
            host: document.createElement("div"),
        };
    });

    afterEach(() => {
        const { host } = TEST_HOST[TEST_KEY];
        host.remove();
    });
} catch (e) {
    throw "atomico/test-dom requires global definition of beforeEach and afterEach functions";
}

/**
 *
 * @param {any} Vnode
 * @returns {HTMLDivElement}
 */
export function fixture(Vnode) {
    const ref = TEST_HOST[TEST_KEY];

    if (isArray(Vnode)) {
        throw "fixture cannot receive an array";
    }

    const withHost = Vnode && Vnode.type == "host";

    const nextVnode = withHost ? Vnode : h("host", null, Vnode);

    render(nextVnode, ref.host, "fixture:" + ref.id);

    // insert the content into the document
    if (!ref.mount) {
        ref.mount = true;
        document.body.appendChild(ref.host);
    }

    return withHost ? ref.host : ref.host.children[0];
}
