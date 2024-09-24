import { expect, describe, it } from "vitest";
import { options } from "../options.js";
import { css } from "../css.js";

describe("src/css", () => {
    it("CSSStyleSheet", () => {
        const styleSheet = css`
            :host {
                width: 696px;
            }
        `;
        expect(styleSheet).toBeInstanceOf(CSSStyleSheet);
    });
    it("HTMLStyleElements", () => {
        options.sheet = false;
        const styleSheet = css`
            :host {
                width: 969px;
            }
        `;
        options.sheet = true;
        expect(styleSheet).toBeInstanceOf(HTMLStyleElement);
    });
});
