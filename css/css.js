import { useHost, useEffect } from "../core.js";
import { saniate, createSheet, SupportAdoptedStyleSheets } from "./utils.js";
/**
 * It is used only if the browser supports adoptedStyleSheets.
 * caches the CSSStyleSheet using the css as a reference to the instance
 * @type {{[prop:string]:CSSStyleSheet}}
 */
const Sheets = {};
/**
 * used as a reference id to the styles associated with the component
 */
const sheetsId = Symbol();

/**
 * Create a style or CSSStyleSheet tag as a reference to associate with the component
 * @param {TemplateStringsArray} template
 * @param  {...any} args
 * @returns {Sheet}
 */
export const css = (template, ...args) => {
    const cssText = saniate(template, args);
    return (Sheets[cssText] = Sheets[cssText] || createSheet(cssText));
};
/**
 * Associate the styles to the component
 * @param {...Sheet} sheets
 */
export const useStyleSheet = (...sheets) => {
    const host = useHost();
    useEffect(() => {
        const { current } = host;
        current[sheetsId] = current[sheetsId] || new Map();
        const { shadowRoot } = current;

        if (!shadowRoot) return;

        sheets.map((sheet) => {
            if (!sheet) return;
            if (!current[sheetsId].has(sheet)) {
                const ref = SupportAdoptedStyleSheets
                    ? null
                    : sheet.cloneNode(true);
                current[sheetsId].set(sheet, {
                    count: 0,
                    ref,
                });
                if (ref) shadowRoot.appendChild(ref);
            }
            current[sheetsId].get(sheet).count++;
        });
        const list = [...current[sheetsId]];
        const mapSheet = ([sheet]) => sheet;
        if (SupportAdoptedStyleSheets) {
            shadowRoot.adoptedStyleSheets = list.map(mapSheet);
        }
        return () => {
            list.map(([sheet, state]) => {
                if (!--state.count) {
                    current[sheetsId].delete(sheet);
                    if (!SupportAdoptedStyleSheets) state.ref.remove();
                }
            });
            if (SupportAdoptedStyleSheets) {
                shadowRoot.adoptedStyleSheets = [...current[sheetsId]].map(
                    mapSheet
                );
            }
        };
    }, sheets);
};
/**
 * @typedef {typeof HTMLStyleElement| typeof CSSStyleSheet} Sheet
 */
