/**
 * The next example demonstrates the useNodes hook in Atomico.
 * This hook allows you to work with assigned nodes in a web component.
 */
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

customElements.define("example-use-nodes", EgUseNodes);
