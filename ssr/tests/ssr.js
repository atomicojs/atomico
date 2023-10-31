import { writeFile } from "fs/promises";
import "../load.js";
import { html } from "../../core.js";
import "./components/component-1.js";

const dom = html`<component-1
    class="random"
    ref=${{}}
    key="key"
    cloneNode
    staticNode
    _ignore="..."
>
    <h1 slot="random">....</h1>
    ${1} ${2} ${3}
</component-1>`;

// writeFile("./ssr/tests/demo.html", dom.render());
writeFile(
    "./ssr/tests/src.test.js",
    `
    import { expect } from "@esm-bundle/chai";

    it("SSR", async () => {
        const root = document.createElement("div");
        root.innerHTML = \`${dom.render()}\`;

        document.body.append(root);

        const nodes = root.querySelectorAll("[data-hydrate]");

        root.querySelectorAll("template[shadowroot]").forEach((el) => {
            el.parentElement.attachShadow({ mode: "open" });
            el.parentElement.shadowRoot.append(el.content);
            el.remove();
        });

        // let hydrate = new Map();

        // root.addEventListener("hydrate", ({ detail }) => {
        //     console.log(detail);
        // });

        await import("./client.js");

        const nodesH = root.querySelectorAll("[data-hydrate]");

        await Promise.all([...nodesH].map((node) => node.updated));

        expect(nodes).to.deep.equal(nodesH);

        const component4 = root.querySelector("component-4");

        const [increment, decrement] = [
            ...component4.shadowRoot.querySelectorAll("button"),
        ];
    
        increment.click();
    
        expect(component4.count).to.equal(101);
    
        await component4.updated;
    
        decrement.click();
    
        expect(component4.count).to.equal(100);
    });

    `,
);
