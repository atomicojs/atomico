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
                width: 696,
                height: 100,
                flex: 1,
            },
            ".root": {
                fontSize: 12,
                lineHeight: 1.5,
            },
        });
        const cssText =
            "cssRules" in styleSheet
                ? Object.values(styleSheet.cssRules).map((v) => v.cssText)
                : [];
        expect(cssText).to.eql([
            ":host { width: 696px; height: 100px; flex: 1 1 0%; }",
            ".root { font-size: 12px; line-height: 1.5; }",
        ]);
    });
});
