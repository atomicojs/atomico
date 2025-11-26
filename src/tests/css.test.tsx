import { expect, describe, it } from "vitest";
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
});
