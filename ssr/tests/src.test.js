
    import { expect } from "@esm-bundle/chai";

    it("SSR", async () => {
        const root = document.createElement("div");
        root.innerHTML = `<my-component data-hydrate range="100" class="random" ><span>1</span><span> </span><span>2</span><span> </span><span>3</span><button><span>ok</span></button><a data-hydrate count="0" data="{&quot;ok&quot;:1}" is="my-component-3" ><button><span>increment</span></button><span><span>0</span></span><button><span>decrement</span></button></a><my-component-2 data-hydrate count="10" ><template shadow-dom ><button><span>increment</span></button><span><span>10</span></span><button><span>decrement</span></button></template></my-component-2><h1 slot="random" ><span>....</span></h1><span>1</span><span> </span><span>2</span><span> </span><span>3</span></my-component>`;

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

    