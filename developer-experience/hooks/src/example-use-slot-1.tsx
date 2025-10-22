import { c, useRef, useSlot } from "atomico";

export const EgUseSlot = c(() => {
    const ref = useRef();
    const slots = useSlot(ref);
    console.log("use-slot - render", slots.length);
    return (
        <host shadowDom={{slotAssignment: "manual"}}>
            use-slot - slot: {slots.length}
            <br />
            <slot ref={ref}></slot>
        </host>
    );
});

customElements.define("example-use-slot", EgUseSlot);
