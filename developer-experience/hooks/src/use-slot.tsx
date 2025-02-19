import { c, useRef, useSlot } from "atomico";

export const EgUseSlot = c(() => {
    const ref = useRef();
    const slots1 = useSlot(ref);
    const slots2 = useSlot(ref);

    console.log("use-slot - render", slots1.length);
    return (
        <host shadowDom>
            use-slot - slot: {slots1.length}
            <hr />
            use-slot - slot: {slots2.length}
            <slot ref={ref}></slot>
        </host>
    );
});

customElements.define("eg-use-slot", EgUseSlot);
