const w = window;

const compatibilityList = [
    ["customElements", w],
    ["ShadowRoot", w],
    ["Map", w],
    ["append", document],
    ["prepend", document],
    ["Symbol", w],
    ["for", w.Symbol],
];

/**
 * serialize a string
 * @param  {...any} args
 * @returns {string}
 */
export const serialize = (...args) => args.filter((value) => value).join(" ");

/**
 * check the features that Atomico leverages the browser
 * @returns {string[]}
 */
export const checkIncompatibility = () =>
    compatibilityList
        //@ts-ignore
        .map(([check, ctx]) => (!ctx || !(check in ctx) ? check : 0))
        .filter((check) => check);

/**
 * @template {Element} T
 * @param {*} vnode
 * @returns {T}
 */
export const template = (vnode) =>
    render(h("host", null, vnode), new DocumentFragment()).firstElementChild;
