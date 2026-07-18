# Advanced Hooks & Utilities Guide

This guide covers utility hooks for managing DOM references, memoizing calculations, subscribing to events, and traversing the element tree.

## 1. Subscribing to DOM Events (`useListener`)

Use `useListener` to attach event listeners to elements or global objects (like `window` or `document`). It handles subscription cleanup automatically when the component unmounts.

```tsx
import { c, useListener, useState } from "atomico";

export const WindowResizer = c(() => {
    const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });

    // ✅ Listens to global window event; auto-cleans on unmount
    useListener({ current: window }, "resize", () => {
        setSize({ w: window.innerWidth, h: window.innerHeight });
    });

    return (
        <host shadowDom>
            <p>Viewport dimensions: {size.w}px x {size.h}px</p>
        </host>
    );
});
```

---

## 2. DOM Referencing & Tree Traversal (`useRef`, `useHost`, `useParent`)

*   **`useRef`**: Holds mutable values or targets elements.
*   **`useHost`**: Returns the current Custom Element host instance (`{ current: HTMLElement }`).
*   **`useParent`**: Finds parent components matching a selector, even crossing Shadow DOM boundaries.

```tsx
import { c, useRef, useHost, useParent, useEffect } from "atomico";

export const ChildElement = c(() => {
    // 1. Get host reference
    const hostRef = useHost();

    // 2. Find parent element matching selector across Shadow boundaries
    const parentContainer = useParent("ui-container", true);

    useEffect(() => {
        console.log("Current Custom Element:", hostRef.current);
        if (parentContainer) {
            console.log("Container Parent element located!");
        }
    }, [parentContainer]);

    return (
        <host shadowDom>
            <div>Sub-item element</div>
        </host>
    );
});
```

---

## 3. Memoization & Value Cache (`useMemo`)

`useMemo` caches the result of an expensive calculation between renders, re-evaluating the value only when one of its dependencies changes.

```tsx
import { c, useMemo } from "atomico";

export const DataSearch = c(
    ({ list, filterTerm }) => {
        // ✅ useMemo: Caches filtered results; only runs calculation when list or filterTerm changes
        const filteredList = useMemo(() => {
            return list.filter((item) => item.toLowerCase().includes(filterTerm.toLowerCase()));
        }, [list, filterTerm]);

        return (
            <host shadowDom>
                <ul>
                    {filteredList.map((item, idx) => (
                        <li key={idx}>{item}</li>
                    ))}
                </ul>
            </host>
        );
    },
    {
        props: {
            list: { type: Array, value: (): string[] => [] },
            filterTerm: { type: String, value: () => "" }
        }
    }
);
```

---

## 4. Manual Updates (`useUpdate`)

`useUpdate` returns a function that triggers a component render cycle programmatically when called.

```tsx
import { c, useUpdate, useRef } from "atomico";

export const ManualCounter = c(() => {
    const update = useUpdate();
    const countRef = useRef(0);

    const increment = () => {
        countRef.current += 1;
        update(); // ✅ Force component re-render to display the modified ref value
    };

    return (
        <host shadowDom>
            <p>Count: {countRef.current}</p>
            <button onclick={increment}>Increment</button>
        </host>
    );
});
```
