/**
 * The next example demonstrates the useNodes hook in Atomico.
 * This hook allows you to work with assigned nodes in a web component.
 */
import { c, css, useParent, useListener } from "atomico";

const MyParent = c(
    () => {
        return (
            <host shadowDom>
                <form>
                    <slot />
                </form>
            </host>
        );
    },
    {
        props: {
            message: String
        }
    }
);

export const EgUseParent = c(
    () => {
        const parent = useParent("form", true);

        useListener(parent, "submit", (event: Event) => {
            event.preventDefault();
            console.log("Prevent!");
        });

        return (
            <host
                shadowDom={{
                    slotAssignment: "manual"
                }}
            >
                <h1>{parent.current.localName}</h1>
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

customElements.define("example-use-parent-my-parent", MyParent);
customElements.define("example-use-parent", EgUseParent);
