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
                    insertNode(shadowRoot, style, null, true);
                }
            } else {
                let root = current.getRootNode();
                root = root == document ? document.head : root;
                style = root.querySelector(`:scope > style#${id}`);
                if (!style) {
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
