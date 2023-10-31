import { expect } from "@esm-bundle/chai";
import { options } from "../options.js";
import { css } from "../css.js";

describe("src/css", () => {
    it("CSSStyleSheet", () => {
        const styleSheet = css`
            :host {
                width: 696px;
            }
        `;
        expect(styleSheet).to.an.instanceOf(CSSStyleSheet);
    });
    it("HTMLStyleElements", () => {
        options.sheet = false;
        const styleSheet = css`
            :host {
                width: 969px;
            }
        `;
        options.sheet = true;
        expect(styleSheet).to.an.instanceOf(HTMLStyleElement);
    });
    it("stringify", () => {
        const styleSheet = css({
            ":host": {
                width: "696px",
                height: "100px",
            },
            ".root": {
                fontSize: "12px",
                lineHeight: "1.5",
            },
        });
        const cssText =
            "cssRules" in styleSheet
                ? Object.values(styleSheet.cssRules).map((v) => v.cssText)
                : [];
        expect(cssText).to.eql([
            ":host { width: 696px; height: 100px; }",
            ".root { font-size: 12px; line-height: 1.5; }",
        ]);
    });
});
