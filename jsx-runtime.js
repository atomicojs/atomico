import { createElement } from "./src/core.js";
export { Fragment } from "./src/core.js";

/**
 *
 * @param {any} type
 * @param {any} props
 * @param {any} [key ]
 * @returns
 */
export const jsx = (type, props, key) => {
    if (props == undefined) {
        props = { key };
    } else {
        props.key = key;
    }
    return createElement(type, props);
};

export const jsxs = jsx;

export const jsxDEV = jsx;
