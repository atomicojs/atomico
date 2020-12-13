import { expect } from "@esm-bundle/chai";
import html from "../../html/html";
import { css, useStyleSheet } from "../css.js";
import { customElementScope } from "../../src/tests/element.test.js";

describe("css", () => {
    it("returns an instance of CSSStyleSheet", () => {
        const sheet = css`
            :host {
                width: 100px;
                height: 100px;
                display: block;
            }
        `;
        expect(sheet).instanceOf(CSSStyleSheet);
    });
    it("useStyleSheet", async () => {
        const sheet = css`
            :host {
                width: 100px;
                height: 100px;
                display: block;
            }
        `;
        function component() {
            useStyleSheet(sheet);
            return html`<host shadowDom></host>`;
        }

        const element = customElementScope(component);

        document.body.appendChild(element);

        await element.updated;

        const style = getComputedStyle(element);

        expect(style.width).to.equal("100px");
        expect(style.height).to.equal("100px");
    });
    it("useStyleSheet with 2 parameters", async () => {
        const sheet1 = css`
            :host {
                width: 100px;
                height: 100px;
                display: block;
            }
        `;
        const sheet2 = css`
            :host {
                color: tomato;
            }
        `;
        function component() {
            useStyleSheet(sheet1, sheet2);
            return html`<host shadowDom></host>`;
        }

        const element = customElementScope(component);

        document.body.appendChild(element);

        await element.updated;

        const style = getComputedStyle(element);

        expect(style.width).to.equal("100px");
        expect(style.height).to.equal("100px");
    });
});
