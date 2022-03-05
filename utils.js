let W = window;

let COMPATIBILITY_LIST = [
    ["customElements", W],
    ["ShadowRoot", W],
    ["Map", W],
    ["append", document],
    ["prepend", document],
    ["Symbol", W],
    ["for", W.Symbol],
];

/**
 * serialize a string
 * @param  {...any} args
 * @returns {string}
 */
export let serialize = (...args) => args.filter((value) => value).join(" ");

/**
 * check the features that Atomico leverages the browser
 * @returns {string[]}
 */
export let checkIncompatibility = () =>
    COMPATIBILITY_LIST
        //@ts-ignore
        .map(([check, ctx]) => (!ctx || !(check in ctx) ? check : 0))
        .filter((check) => check);
