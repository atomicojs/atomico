import { expect } from "@esm-bundle/chai";
import { h } from "../../core.js";
import { html } from "../html.js";

describe("html", () => {
    it("virtual-dom 1", () => {
        expect(html`<host></host>`).to.deep.equal(h("host"));
    });
    it("virtual-dom 2", () => {
        expect(html`<host>every</host>`).to.deep.equal(
            h("host", null, "every"),
        );
    });
});
