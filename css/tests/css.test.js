import { expect } from "@esm-bundle/chai";
import { css, useStyleSheet } from "../css.js";
import { createHooks } from "../../test-hooks.js";

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

        const load = () => {
            useStyleSheet(sheet);
        };

        const host = document.createElement("div");

        host.attachShadow({ mode: "open" });

        document.body.appendChild(host);

        const hooks = createHooks(null, host);

        hooks.load(load);

        hooks.cleanEffects()();

        const style = getComputedStyle(host);

        expect(style.width).to.equal("100px");
        expect(style.height).to.equal("100px");
    });
    /**
     * Verify that using StyleSheet works with more than one style sheet
     */
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
        const load = () => {
            useStyleSheet(sheet1, sheet2);
        };

        const host = document.createElement("div");

        host.attachShadow({ mode: "open" });

        document.body.appendChild(host);

        const hooks = createHooks(null, host);

        hooks.load(load);

        hooks.cleanEffects()();

        const style = getComputedStyle(host);

        expect(style.width).to.equal("100px");
        expect(style.height).to.equal("100px");
        expect(style.color).to.equal("rgb(255, 99, 71)");
    });
    /**
     * Verify that the stylesheets are associated by condition
     */
    it("useStyleSheet with 2 conditional parameters", async () => {
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

        const load = (toggle) => {
            useStyleSheet(sheet1, toggle && sheet2);
        };

        const host = document.createElement("div");

        host.attachShadow({ mode: "open" });

        document.body.appendChild(host);

        const hooks = createHooks(null, host);

        hooks.load(() => load(true));

        hooks.cleanEffects()();

        const style1 = getComputedStyle(host);

        expect(style1.width).to.equal("100px");
        expect(style1.height).to.equal("100px");
        expect(style1.color).to.equal("rgb(255, 99, 71)");

        hooks.load(() => load(false));

        hooks.cleanEffects()();

        const style2 = getComputedStyle(host);

        expect(style2.width).to.equal("100px");
        expect(style2.height).to.equal("100px");
        expect(style2.color).to.not.equal("rgb(255, 99, 71)");
    });
    /**
     * Check the non-association of styles, data that the
     * shadowRoot has not been enabled in the element
     */
    it("useStyleSheet no shadowRoot", async () => {
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
        const load = () => {
            useStyleSheet(sheet1, sheet2);
        };

        const host = document.createElement("div");

        document.body.appendChild(host);

        const hooks = createHooks(null, host);

        hooks.load(load);

        hooks.cleanEffects()();

        const style = getComputedStyle(host);

        expect(style.width).to.not.equal("100px");
        expect(style.height).to.not.equal("100px");
        expect(style.color).to.not.equal("rgb(255, 99, 71)");
    });
});
