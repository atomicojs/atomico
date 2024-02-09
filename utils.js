import { css } from "./src/css.js";
import { IS_NON_DIMENSIONAL } from "./src/render.js";
import { isNumber, isObject } from "./src/utils.js";

const W = globalThis;

const COMPATIBILITY_LIST = [
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
export const serialize = (...args) => args.filter((value) => value).join(" ");

/**
 * check the features that Atomico leverages the browser
 * @returns {string[]}
 */
export const checkIncompatibility = () =>
    COMPATIBILITY_LIST
        //@ts-ignore
        .map(([check, ctx]) => (!ctx || !(check in ctx) ? check : 0))
        .filter((check) => check);

/**
 * @type {{[id:string]:string}}
 */
const PROPS = {};

/**
 * @param {string} str
 */
const hyphenate = (str) =>
    (PROPS[str] =
        PROPS[str] ||
        str
            .replace(/([A-Z])/g, "-$1")
            .toLowerCase()
            .replace(/^ms-/, "-ms-"));

/**
 * @param {object} obj
 * @returns {string}
 */
const stringify = (obj) =>
    Object.entries(obj)
        .map(([key, value]) => {
            if (isObject(value)) {
                return `${key}{${stringify(value)};}`.replace(/;;/g, ";");
            }
            if (key[0] === "-") {
                return `${key}:${value}`;
            }
            return `${hyphenate(key)}:${
                !isNumber(value) || IS_NON_DIMENSIONAL.test(key)
                    ? value
                    : `${value}px`
            }`;
        })
        .join(";")
        .replace(/};/g, "}");

/**
 * Create a Style from an object
 * @param {{[key:string]:import("csstype").Properties<string | number>}|string} obj
 * @returns {import("./types/css.js").Sheet | undefined}
 */
export function toCss(obj) {
    if (typeof obj === "string") {
        if (obj.match(/^https?:\/\//)) {
            const request = new XMLHttpRequest();
            request.open("get", obj, false);
            request.send();
            if (request.status === 200)
                return css`
                    ${request.responseText}
                `;
        }
    }
    return css`
        ${stringify(obj)}
    `;
}
