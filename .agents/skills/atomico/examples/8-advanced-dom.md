# Example: Advanced DOM Interaction & Rendering

Deep-dive showing how to observe Light DOM children, query ancestors composed crossing shadow roots, filter slots with typings, and render directly into the Light DOM.

```tsx
import { c, useRef, useSlot, useNodes, useParent, useRender, css } from "atomico";

// A typed child component
export const MenuItem = c(() => <host shadowDom><slot /></host>);
customElements.define("menu-item", MenuItem);

export const AdvancedMenu = c(
    () => {
        const slotRef = useRef();

        // 1. useSlot with strict type assertion and filter
        const activeItems = useSlot<typeof MenuItem>(
            slotRef,
            (el) => el instanceof MenuItem
        );

        // 2. useNodes: Observe Light DOM children via MutationObserver directly on host
        const allNodes = useNodes<Element>((el) => el instanceof Element);

        // 3. useParent: Query nearest parent form, composed crossing Shadow Roots
        const formParent = useParent("form", true);

        // 4. useRender: Render semantic nodes directly into the Light DOM (good for accessibility/SEO)
        useRender(() => (
            <div class="light-dom-footer">
                Total child nodes observed: {allNodes.length}
            </div>
        ));

        return (
            <host shadowDom={{ slotAssignment: "manual" }}>
                <h2>Menu (Inside Form: {formParent.current ? "Yes" : "No"})</h2>
                
                {/* Dynamically distribute observed items inside Shadow DOM list */}
                <ul>
                    {activeItems.map((item) => (
                        <li>
                            <slot assignNode={item} />
                        </li>
                    ))}
                </ul>

                {/* The default slot reference to observe assigned nodes */}
                <slot ref={slotRef} />
            </host>
        );
    },
    {
        styles: css`
            :host { display: block; border: 1px solid #eaeaea; padding: 1rem; }
            ul { list-style: none; padding: 0; }
        `
    }
);

customElements.define("advanced-menu", AdvancedMenu);
```
