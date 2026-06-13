# Slot Interactions & DOM Manipulation Guide

This guide demonstrates how to interact with elements inside `<slot>` tags, observe light DOM mutations, and handle custom Light DOM rendering.

## 1. Tracking Slotted Elements (`useSlot`)

`useSlot` allows you to observe children dynamically assigned inside a `<slot>`. You can filter which nodes to capture (e.g., matching a selector or element type).

```tsx
import { c, useRef, useSlot } from "atomico";

export const CustomMenu = c(() => {
    const slotRef = useRef<HTMLSlotElement>(null);

    // ✅ Track only child elements that are instances of HTMLLIElement
    const menuItems = useSlot(slotRef, (el) => el instanceof HTMLLIElement);

    return (
        <host shadowDom>
            <div class="menu-container">
                <nav>
                    {/* The slot receives the elements from the Light DOM */}
                    <slot ref={slotRef} />
                </nav>
                <div class="footer">
                    Total menu options: {menuItems.length}
                </div>
            </div>
        </host>
    );
});
```

---

## 2. Dynamic Slot Encapsulation (`useNodes`)

`useNodes` tracks direct Light DOM children. In advanced layouts, you can loop through these children, dynamically assign them unique `slot` names (e.g., `child.slot = "item-i"`), and map them to corresponding `<slot name="item-i">` placeholders in the Shadow DOM. 

This enables you to isolate raw children inside custom Shadow DOM wrapper elements (like `<li>` or `div` wrappers) for layout control and styling.

```tsx
import { c, useNodes } from "atomico";

export const CustomList = c(() => {
    // ✅ 1. Retrieve raw Light DOM child elements
    const elements = useNodes((node) => node instanceof HTMLElement) as HTMLElement[];

    return (
        <host shadowDom>
            <ul class="list-wrapper">
                {elements.map((child, index) => {
                    const slotName = `list-item-${index}`;
                    
                    // ✅ 2. Assign unique slot attribute to the Light DOM element
                    child.slot = slotName;

                    // ✅ 3. Project each isolated node into its own Shadow DOM wrapper
                    return (
                        <li key={index} class="list-item-container">
                            <slot name={slotName} />
                        </li>
                    );
                })}
            </ul>
        </host>
    );
});
```

---

## 3. Light DOM Direct Rendering (`useRender`)

By default, Atomico renders JSX inside the component's Shadow DOM. If you want to render content directly into the Light DOM, use `useRender`.

```tsx
import { c, useRender } from "atomico";

export const PortalModal = c(
    ({ show }) => {
        // ✅ Direct rendering to the Light DOM (ignores Shadow DOM boundaries)
        useRender(() => {
            if (!show) return null;
            return (
                <div class="light-dom-overlay">
                    <div class="modal-dialog">
                        <h2>Light DOM Portal</h2>
                        <slot />
                    </div>
                </div>
            );
        }, [show]);

        return (
            // The template root host remains empty or handles basic shadow styles
            <host />
        );
    },
    {
        props: {
            show: Boolean
        }
    }
);
```
