import { expect } from "@esm-bundle/chai";
import { html } from "../../html.js";
import { template } from "../template";

describe("src/template", () => {
    it("check", () => {
        const dom = template(
            html`<div>text ${"."}${"."}${"."}<!--ignore--></div>`,
        );

        expect(dom).to.instanceOf(HTMLDivElement);
        expect(dom.textContent).to.equal("text ...");
    });
});
