import { c, useNodes } from "atomico";

export const EgUseNodes = c(() => {
    const nodes = useNodes<Element>((el) => el instanceof Element);
    console.log("use-nodes - render - ", nodes.length);
    return (
        <host
            shadowDom={{
                slotAssignment: "manual"
            }}
        >
            use-nodes
            {nodes.map((el) => (
                <slot assignNode={el} />
            ))}
        </host>
    );
});

customElements.define("eg-use-nodes", EgUseNodes);
