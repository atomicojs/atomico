import { c, css, useEffect, useRef, useSlot } from "atomico";

export const EgUseSlotChild = c(
    ({ message }) => {
        return <host shadowDom>use-slot - child component - {message}</host>;
    },
    {
        props: {
            message: {
                type: String,
                value: () => "Hello, I'm a child component"
            }
        },
        styles: css`
            :host {
                display: block;
                padding: 0.5rem;
                border: 1px solid blue;
                margin: 0.25rem 0;
            }
        `
    }
);

export const EgUseSlot = c(() => {
    const ref = useRef();
    const slots = useSlot<typeof EgUseSlotChild>(
        ref,
        (element) => element instanceof EgUseSlotChild
    );

    useEffect(() => {
        const lastNode = slots.at(-1);
        /**
         * checks if Typescript respects the component's inherited type
         */
        console.log(
            "The message of the last component is:",
            lastNode.message.repeat(1)
        );
    }, slots);

    return (
        <host shadowDom>
            use-slot - slot: {slots.length}
            <br />
            <slot ref={ref}></slot>
        </host>
    );
});

customElements.define("example-use-slot-child", EgUseSlotChild);
customElements.define("example-use-slot", EgUseSlot);
