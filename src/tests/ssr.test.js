import { expect } from "@esm-bundle/chai";
import { h, render } from "../render.js";
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
});
