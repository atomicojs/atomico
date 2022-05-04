
    import { expect } from "@esm-bundle/chai";

    it("SSR", async () => {
        const root = document.createElement("div");
        root.innerHTML = `<my-component data-hydrate range="100" class="random" ><template shadowroot="open" ><span>1</span><span> </span><span>2</span><span> </span><span>3</span><button><span>ok</span></button><a data-hydrate count="0" ><button><span>increment</span></button><span><span>0</span></span><button><span>decrement</span></button></a><my-component-2 data-hydrate count="10" ><button><span>increment</span></button><span><span>10</span></span><button><span>decrement</span></button></my-component-2><style data-hydrate>
    :host {
        color: red;
        width: 200px;
        display: block;
        border: 1px solid red;
    }
</style></template><h1 slot="random" ><span>....</span></h1><span>1</span><span> </span><span>2</span><span> </span><span>3</span></my-component>`;
    
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
    
    