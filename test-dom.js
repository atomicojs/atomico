import { h, render } from "./src/core.js";

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
 * @param {any} vdom
 * @returns {HTMLDivElement}
 */
export function fixture(vdom) {
    const ref = TEST_HOST[TEST_KEY];

    if (Array.isArray(vdom)) {
        throw "fixture cannot receive an array";
    }

    const withHost = vdom && vdom.type == "host";

    const nextVdom = withHost ? vdom : h("host", null, vdom);

    render(nextVdom, ref.host, "fixture:" + ref.id);

    // insert the content into the document
    if (!ref.mount) {
        ref.mount = true;
        document.body.appendChild(ref.host);
    }

    return withHost ? ref.host : ref.host.children[0];
}
