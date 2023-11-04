import { $, IS_NON_DIMENSIONAL } from "./render.js";
import { options } from "./options.js";
import { isNumber, isObject, isTagged } from "./utils.js";

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
function stringify(obj) {
    return Object.entries(obj)
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
}

/**
 * It is used only if the browser supports adoptedStyleSheets.
 * caches the CSSStyleSheet using the css as a reference to the instance
 * @type {{[id:string]:import("core").Sheet}}
 */
const SHEETS = {};

/**
 * Create a Style from a string
 * @param {TemplateStringsArray|{[key:string]:import("csstype").Properties<string | number>}} template
 * @param {...any} args
 */
export function css(template, ...args) {
    const cssText = !isTagged(template)
        ? stringify(template)
        : (template.raw || template).reduce(
              (cssText, part, i) => cssText + part + (args[i] || ""),
              ""
          );
    return (SHEETS[cssText] = SHEETS[cssText] || createSheet(cssText));
}

/**
 * Create a stylesheet according to browser support
 * @param {string} cssText
 * @returns {import("core").Sheet}
 */
export function createSheet(cssText) {
    if (options.sheet) {
        const sheet = new CSSStyleSheet();
        // Ts by default does not add .replace yet
        // @ts-ignore
        sheet.replaceSync(cssText);
        return sheet;
    } else {
        const sheet = $.createElement("style");
        sheet.textContent = cssText;
        return sheet;
    }
}
