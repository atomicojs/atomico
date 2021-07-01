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
});
