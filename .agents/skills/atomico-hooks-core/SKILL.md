---
name: atomico-hooks-core
description: >
  Use core Atomico hooks: useState, useMemo, useCallback, useRef, useHost,
  useUpdate, useId, useHook. Triggers when the user needs local state management,
  memoization, DOM references, or access to the host element in Atomico components.
  Do NOT trigger for React hooks — Atomico hooks have the same API but run in a
  web component context with different lifecycle semantics.
license: MIT
compatibility: "Atomico >=1.79"
metadata:
  category: hooks
  priority: high
---

# Core Hooks

## `useState` — Local Reactive State

Works identically to React's `useState`. Accepts an initial value or a factory
function. Returns `[value, setter]`.

```tsx
import { c, useState } from "atomico";

const Counter = c(() => {
    const [count, setCount] = useState(0);

    return (
        <host>
            <span>{count}</span>
            <button onclick={() => setCount(count + 1)}>+</button>
            <button onclick={() => setCount((prev) => prev - 1)}>-</button>
        </host>
    );
});
```

### Type Inference

```ts
// Inferred as number
const [count, setCount] = useState(0);

// Explicit generic for undefined initial state
const [active, setActive] = useState<boolean>();

// Factory function — type inferred from return
const [items, setItems] = useState<string>(() => "welcome");

// Complex types
const [values, setValues] = useState<[number, number, number, number]>([1, 2, 3, 4]);
```

### Setter Behavior

The setter only triggers an update if the new value is strictly different
(`!==`) from the current value.

```ts
setCount(5);                       // Direct value
setCount((prev) => prev + 1);     // Functional update
```

---

## `useMemo` — Memoized Computation

Caches the return of a callback. Only recomputes when dependencies change.

```ts
import { useMemo } from "atomico";

const expensive = useMemo(() => computeHeavyValue(data), [data]);
```

### Type Inference

```ts
// Type inferred from callback return
const result = useMemo(() => 42, []);  // number

const isValid = useMemo(() => {
    return dateToValidate.getFullYear() === 2022;
}, [dateToValidate]);  // boolean
```

---

## `useCallback` — Memoized Function Reference

Shorthand for `useMemo(() => callback, args)`. Returns the same function
reference until dependencies change.

```ts
import { useCallback } from "atomico";

const handler = useCallback(
    (param: boolean) => param ? 10 : 0,
    [dependency]
);
```

---

## `useRef` — Persistent Mutable Reference

Creates a persistent reference object `{ current }` that survives re-renders.
Commonly used for DOM element references.

```tsx
import { c, useRef } from "atomico";

const MyComponent = c(() => {
    const inputRef = useRef<HTMLInputElement>();

    return (
        <host shadowDom>
            <input ref={inputRef} />
            <button onclick={() => inputRef.current?.focus()}>
                Focus
            </button>
        </host>
    );
});
```

### Typed Refs for Atomico Components

```tsx
import { useRef } from "atomico";
import { MyChild } from "./my-child.js";

// Use typeof to get the constructor type
const childRef = useRef<typeof MyChild>();

childRef.current?.myProp;  // Full type inference on component props
```

---

## `useHost` — Access the Host Element

Returns a ref to the host custom element. Essential for accessing the DOM node,
dispatching events, or manipulating the element itself.

```tsx
import { c, useHost } from "atomico";

const MyComponent = c(() => {
    const host = useHost();

    // Access the host element
    host.current.updated.then(() => {
        console.log("Component rendered!");
    });

    return <host><p>Hello</p></host>;
});
```

> **Note**: `useHost()` returns `{ current: HTMLElement }` — the `current`
> property always points to the web component instance.

---

## `useUpdate` — Force Re-render

Returns the component's update function. Calling it triggers a re-render
without changing any state.

```tsx
import { c, useUpdate } from "atomico";

const MyComponent = c(() => {
    const update = useUpdate();

    return (
        <host>
            <button onclick={() => update()}>Force re-render</button>
        </host>
    );
});
```

---

## `useId` — Stable Unique Identifier

Generates a unique, stable ID for the current hook position. Useful for
accessibility attributes.

```tsx
import { c, useId } from "atomico";

const MyComponent = c(() => {
    const id = useId();

    return (
        <host shadowDom>
            <label for={id}>Name</label>
            <input id={id} />
        </host>
    );
});
```

---

## `useHook` — Low-Level Custom Hook Primitive

The foundational hook for building custom hooks. Manages persistent state across
renders using a callback pattern.

```ts
import { useHook } from "atomico";

const useMyCustomHook = () => {
    return useHook((state = { count: 0 }) => {
        state.count++;
        return state;
    });
};
```

> **Advanced**: `useHook` is the building block for `useState`, `useMemo`, and
> all other hooks. Use it when none of the built-in hooks fit your needs.
