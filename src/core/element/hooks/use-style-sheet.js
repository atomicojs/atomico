import { useHost, useEffect } from "../../hooks";
import { createNode, insertNode } from "../../render/utils";

const CACHE_STYLE_SHEET = {};
const CACHE_HASH_STYLE_SHEET = {};

export function useStyleSheet(...sheets) {
    let { current } = useHost();
    useEffect(() => {
        let { shadowRoot } = current;
        let setStyle = (id, cssText) => {
            let style;
            let query = `:scope > style#${id}`;
            if (shadowRoot) {
                style = shadowRoot.querySelector(query);
                if (!style) {
                    style = createNode("style");
                    // to avoid scanning children inside the web component insertNode is used,
                    // since this marks the limit position, avoiding the elimination of style
                    insertNode(shadowRoot, style, null, true);
                }
            } else {
                let root = current.getRootNode();
                root = root == document ? document.head : root;
                style = root.querySelector(query);
                if (!style) {
                    // Being a component created within another or the document,
                    // the limit is already deferred so it is safe to use appendChild
                    root.appendChild((style = createNode("style")));
                }
            }
            style.textContent = cssText;
        };
        if (shadowRoot && "adoptedStyleSheets" in document) {
            shadowRoot.adoptedStyleSheets = sheets.map(cssText => {
                if (cssText instanceof CSSStyleSheet) {
                    return cssText;
                }
                if (!CACHE_STYLE_SHEET[cssText]) {
                    CACHE_STYLE_SHEET[cssText] = new CSSStyleSheet();
                    CACHE_STYLE_SHEET[cssText].replace(cssText);
                }
                return CACHE_STYLE_SHEET[cssText];
            });
            return;
        }
        sheets.forEach(cssText =>
            setStyle(
                (CACHE_HASH_STYLE_SHEET[cssText] =
                    CACHE_HASH_STYLE_SHEET[cssText] || toHash(cssText)),
                cssText
            )
        );
    }, sheets);
}

export const toHash = str =>
    "css" +
    str.split("").reduce((out, i) => (10 * out + i.charCodeAt(0)) >>> 0, 0);
