import { options } from "./options.js";

/**
 * It is used only if the browser supports adoptedStyleSheets.
 * caches the CSSStyleSheet using the css as a reference to the instance
 * @type {{[id:string]:import("core").Sheet}}
 */
const SHEETS = {};

/**
 * Create a Style from a string
 * @param {TemplateStringsArray} template
 * @param  {...any} args
 */
export function css(template, ...args) {
    const cssText = (template.raw || template).reduce(
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
        const sheet = document.createElement("style");
        sheet.textContent = cssText;
        return sheet;
    }
}
