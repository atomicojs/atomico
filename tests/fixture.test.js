import { fixture } from "../test-dom";
import { html } from "../core";
import { expect } from "@esm-bundle/chai";

describe("fixture", () => {
    it("single", () => {
        const ref = {};
        const node = fixture(html`<button ref=${ref}>button</button>`);
        expect(node).to.equal(ref.current);
    });

    it("list", () => {
        const list = [];
        const children = fixture(html`
            <button ref=${(node) => list.push(node)}>button</button>
            <button ref=${(node) => list.push(node)}>button</button>
            <button ref=${(node) => list.push(node)}>button</button>
        `);
        expect(children).to.deep.equal(list);
    });
});
