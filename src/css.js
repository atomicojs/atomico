import { $ } from "./render.js";
import { options } from "./options.js";

/**
 * It is used only if the browser supports adoptedStyleSheets.
 * caches the CSSStyleSheet using the css as a reference to the instance
 * @type {Object<string,import("./element/custom-element").Style>}
 */
let Sheets = {};

/**
 * Create a Style from a string
 * @param {TemplateStringsArray} template
 * @param  {...any} args
 */
export function css(template, ...args) {
    let cssText = (template.raw || template).reduce(
        (cssText, part, i) => cssText + part + (args[i] || ""),
        ""
    );
    return (Sheets[cssText] = Sheets[cssText] || createSheet(cssText));
}

/**
 * Create a stylesheet according to browser support
 * @param {string} cssText
 * @returns {import("./element/custom-element").Style}
 */
export function createSheet(cssText) {
    if (options.sheet) {
        let sheet = new CSSStyleSheet();
        // Ts by default does not add .replace yet
        // @ts-ignore
        sheet.replaceSync(cssText);
        return sheet;
    } else {
        let sheet = $.createElement("style");
        sheet.textContent = cssText;
        return sheet;
    }
}
