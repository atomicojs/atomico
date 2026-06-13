# State Management Guide

This guide covers managing component state, starting with the primary hook **`useProp`** for public component properties, followed by private state management using **`useState`** (isolated private state) and **`useObjectState`** (grouped private state).

---

## 1. Public Component State (`useProp`)

In Custom Elements, the primary way to manage state is by exposing properties to the outer HTML document. The `useProp` hook connects local component state directly to declared properties, and can reflect changes to HTML attributes.

> [!IMPORTANT]
> Always define the generic type parameter in `useProp<T>("name")` to ensure strict compile-time typing and avoid implicit `any` assignments.
> Use `useProp` strictly when the component needs to **write/mutate** the value internally. For read-only property display, use parameter destructuring.

```tsx
import { c, useProp } from "atomico";

export const RangeCounter = c(
    () => {
        // ✅ Good: Typed useProp for mutable counter property
        const [count, setCount] = useProp<number>("count");

        return (
            <host shadowDom>
                <div class="counter-row">
                    <button onclick={() => setCount((prev = 0) => prev - 1)}>-</button>
                    <span>{count}</span>
                    <button onclick={() => setCount((prev = 0) => prev + 1)}>+</button>
                </div>
            </host>
        );
    },
    {
        props: {
            // Property configuration with arrow factory default value
            count: { type: Number, value: () => 0, reflect: true }
        }
    }
);
```

---

## 2. Single Ephemeral State (`useState`)

Use `useState` strictly for individual, transient UI states that do not affect other fields and do not require external observation.

```tsx
import { c, useState } from "atomico";

export const ExpandablePanel = c(() => {
    // ✅ Good: Simple private toggle isolated to this component
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <host shadowDom>
            <button onclick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? "Collapse" : "Expand"}
            </button>
            {isExpanded && (
                <div class="content">
                    <slot />
                </div>
            )}
        </host>
    );
});
```

---

## 3. Grouped Related States (`useObjectState`)

When managing two or more related state parameters (e.g., input forms, search matrices, list filters, active tabs, sorting directions), you **MUST** use a single `useObjectState` hook.

> [!TIP]
> `useObjectState` supports partial updates (automatically merging the patch with the existing object keys) and optimizes render scheduling, eliminating redundant render cycles caused by multiple standalone `useState` triggers.

```tsx
import { c, useObjectState } from "atomico";

interface SearchCriteria {
    query: string;
    sortBy: "name" | "date";
    ascending: boolean;
    currentPage: number;
}

export const FilterDashboard = c(() => {
    // ✅ Good: Unified state object for related parameters
    const [state, setState] = useObjectState<SearchCriteria>({
        query: "",
        sortBy: "date",
        ascending: true,
        currentPage: 1
    });

    return (
        <host shadowDom>
            <div class="search-bar">
                {/* ✅ GOOD: Inline event handlers leverage automatic Event target typing */}
                <input 
                    type="text" 
                    value={state.query} 
                    oninput={(e) => setState({ query: e.currentTarget.value, currentPage: 1 })} 
                    placeholder="Search records..." 
                />
                <button onclick={() => setState({ ascending: !state.ascending })}>
                    Order: {state.ascending ? "Ascending" : "Descending"}
                </button>
            </div>
            <div class="current-filters">
                <p>Sorting by {state.sortBy} on page {state.currentPage}</p>
            </div>
        </host>
    );
});
```
