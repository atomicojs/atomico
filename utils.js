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

export const serialize = (...args) => args.filter((value) => value).join(" ");

export const checkIncompatibility = () =>
    compatibilityList
        //@ts-ignore
        .map(([check, ctx]) => (!ctx || !(check in ctx) ? check : 0))
        .filter((check) => check);
