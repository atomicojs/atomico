import { expect } from "@esm-bundle/chai";
import { render } from "../render.js";
import { c } from "../element/custom-element.js";
import html from "../../html/html";

describe("src/render#ssr", () => {
    it("without hydration", () => {
        const container = document.createElement("div");
        container.innerHTML = `<h1>1...</h1>`;
        const h1 = container.querySelector("h1");
        const text = h1.firstChild;
        const ref = {};
        render(html`<host><h1 ref=${ref}>...2</h1></host>`, container);

        expect(ref.current).to.not.equal(h1);
        expect(ref.current.childNodes[1]).to.not.equal(text);
    });
    it("with hydration", () => {
        const container = document.createElement("div");
        container.innerHTML = `<h1>1...</h1>`;
        const h1 = container.querySelector("h1");
        const text = h1.firstChild;
        const ref = {};
        render(
            html`<host><h1 ref=${ref}>...2</h1></host>`,
            container,
            undefined,
            true
        );

        expect(ref.current).to.equal(h1);

        expect(ref.current.childNodes[1]).to.equal(text);
    });
    it("hydration of the customElement", async () => {
        const ref = {};
        function component() {
            return html`<host shadowDom><h1 ref=${ref}>title</h1></host>`;
        }

        const tagName = "ssr-component";

        const node = document.createElement(tagName);

        node.attachShadow({ mode: "open" }).innerHTML = `<h1>title</h1>`;

        node.dataset.hydrate = "";

        const h1 = node.shadowRoot.firstChild;

        document.body.appendChild(node);

        customElements.define(tagName, c(component));

        await node.updated;

        expect(h1).to.equal(ref.current);
    });
});
