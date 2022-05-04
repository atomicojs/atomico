import "../ssr.js";
import { c, html, css, useProp } from "../../core.js";
import { writeFile } from "fs/promises";

function component() {
    return html`<host shadowDom>
        ${1} ${2} ${3}
        <button>ok</button>
        <${Component3} />
        <${Component2} count=${10} />
    </host>`;
}

component.styles = css`
    :host {
        color: red;
        width: 200px;
        display: block;
        border: 1px solid red;
    }
`;

component.props = {
    range: {
        type: Number,
        value: 100,
    },
};

customElements.define("my-component", c(component));

function component2() {
    const [count, setCount] = useProp("count");
    return html`<host>
        <button onclick=${() => setCount(count + 1)}>increment</button>
        <span>${count}</span>
        <button onclick=${() => setCount(count - 1)}>decrement</button>
    </host>`;
}

component2.props = {
    count: {
        type: Number,
        value: 0,
    },
};

const Component2 = c(component2);

customElements.define("my-component-2", Component2);

function component3() {
    const [count, setCount] = useProp("count");
    return html`<host>
        <button onclick=${() => setCount(count + 1)}>increment</button>
        <span>${count}</span>
        <button onclick=${() => setCount(count - 1)}>decrement</button>
    </host>`;
}

component3.props = {
    count: {
        type: Number,
        value: 0,
    },
};

const Component3 = c(component3, HTMLAnchorElement);

customElements.define("my-component-3", Component3, { extends: "a" });

const dom = html`<my-component class="random">
    <h1 slot="random">....</h1>
    ${1} ${2} ${3}
</my-component>`;

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
    });
    
    `
);
