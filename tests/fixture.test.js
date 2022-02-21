import { expect } from "@esm-bundle/chai";
import { html } from "../core";
import { fixture, getFragment } from "../test-dom";

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

    it("getFragmet", () => {
        const list = [];
        const ref = {};

        fixture(html`<host>
            <div ref=${ref}>
                <button ref=${(node) => list.push(node)}>button</button>
                <button ref=${(node) => list.push(node)}>button</button>
                <button ref=${(node) => list.push(node)}>button</button>
            </div>
        </host>`);

        expect(getFragment(ref.current)).to.deep.equal(list);
    });
});
