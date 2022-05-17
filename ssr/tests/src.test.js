
    import { expect } from "@esm-bundle/chai";

    it("SSR", async () => {
        const root = document.createElement("div");
        root.innerHTML = `<component-1 data-hydrate class="random" >1 2 3<button>ok</button><component-2 data-hydrate count="10" ><template shadowroot="open" ><button>increment</button><span>10</span><button>decrement</button></template></component-2><a data-hydrate count="0" data="{&quot;ok&quot;:1}" is="component-3" ><button>increment</button><span>0</span><button>decrement</button></a><component-4 data-hydrate count="100" ><template shadowroot="open" ><button>Increment</button><h1>100</h1><button>Decrement</button><style data-hydrate>
    :host {
        display: block;
        padding: 1rem;
        border: 1px solid black;
        display: grid;
        grid-template: repeat(auto-fit, minmax(200px, 1fr));
    }
</style></template></component-4><h1 slot="random" >....</h1>1 2 3</component-1>`;

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

    