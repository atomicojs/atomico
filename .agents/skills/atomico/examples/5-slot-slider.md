# Example: Manual Slot Assignment (Slider)

Using `useNodes` and `assignNode` on slots to dynamically distribute Light DOM children to specific slots based on user interaction (e.g., a slider or carousel).

> [!IMPORTANT]
> When assigning slots manually (`slotAssignment: "manual"`), you must observe the Light DOM children using `useNodes` (not `useSlot`, since they are not assigned yet) and then render a `<slot assignNode={element} />` to map them into the Shadow DOM.

```tsx
import { c, css, useNodes, useProp } from "atomico";

export const Slider = c(
    () => {
        // useNodes tracks the light DOM children (filtering out text/comments if needed)
        const nodes = useNodes<Element>((el) => el instanceof Element);
        const [currentIndex, setCurrentIndex] = useProp("index");

        const next = () => setCurrentIndex((currentIndex + 1) % (nodes.length || 1));
        const prev = () => setCurrentIndex((currentIndex - 1 + nodes.length) % (nodes.length || 1));

        // Get the active node based on the current index
        const activeNode = nodes[currentIndex] || nodes[0];

        return (
            // Required config for manual slot assignment
            <host shadowDom={{ slotAssignment: "manual" }}>
                <div class="slider-container">
                    <button onclick={prev}>&lt;</button>
                    
                    <div class="slide-content">
                        {/* 
                            We use the assignNode prop on the slot to explicitly 
                            assign the activeNode into this slot 
                        */}
                        {activeNode && <slot assignNode={activeNode} />}
                    </div>

                    <button onclick={next}>&gt;</button>
                </div>
            </host>
        );
    },
    {
        props: {
            index: { type: Number, value: () => 0, reflect: true }
        },
        styles: css`
            :host { display: block; }
            .slider-container {
                display: flex;
                align-items: center;
                gap: 1rem;
            }
        `
    }
);

customElements.define("ui-slider", Slider);
```
