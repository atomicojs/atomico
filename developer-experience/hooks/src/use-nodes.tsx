import { c, css, useNodes } from "atomico";

export const EgUseNodes = c(
    () => {
        const nodes = useNodes<Element>((el) => el instanceof Element);

        return (
            <host
                shadowDom={{
                    slotAssignment: "manual"
                }}
            >
                <ul>
                    {nodes.map((el) => (
                        <li>
                            <slot assignNode={el} />
                        </li>
                    ))}
                </ul>
            </host>
        );
    },
    {
        styles: css`
            :host {
                border: 1px solid red;
                display: block;
            }
        `
    }
);

customElements.define("eg-use-nodes", EgUseNodes);
