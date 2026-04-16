---
name: atomico-hooks-effects
description: >
  Use Atomico effect hooks: useEffect, useLayoutEffect, useInsertionEffect.
  Triggers when the user needs side effects, DOM manipulation after render,
  lifecycle management (mount/unmount), subscriptions, or cleanup logic in
  Atomico components. Similar to React effects but with web component lifecycle
  semantics (connectedCallback/disconnectedCallback).
license: MIT
compatibility: "Atomico >=1.79"
metadata:
  category: hooks
  priority: high
---

# Effect Hooks

Atomico provides three effect hooks that map to different phases of the
component render cycle.

## Execution Order

```
render() → useInsertionEffect → DOM paint → useLayoutEffect → microtask → useEffect
```

| Hook | Phase | Use Case |
|------|-------|----------|
| `useInsertionEffect` | Before DOM paint | CSS injection, DOM pre-modifications |
| `useLayoutEffect` | After DOM paint (sync) | DOM measurements, slot observation |
| `useEffect` | After DOM paint (async) | Data fetching, subscriptions, timers |

---

## `useEffect` — Asynchronous Side Effects

Runs **after** the DOM has been updated and painted. Best for operations that
don't need to block the visual update.

```tsx
import { c, useEffect, useState } from "atomico";

const MyComponent = c(() => {
    const [count, setCount] = useState(0);

    // Mount/unmount lifecycle
    useEffect(() => {
        console.log("Component MOUNTED (connectedCallback)");
        return () => {
            console.log("Component UNMOUNTED (disconnectedCallback)");
        };
    }, []);

    // Dependency-based effect
    useEffect(() => {
        console.log("Count changed:", count);
        return () => {
            // Cleanup runs before next effect and on unmount
            console.log("Cleaning up previous count:", count);
        };
    }, [count]);

    return (
        <host>
            <button onclick={() => setCount(count + 1)}>
                Count: {count}
            </button>
        </host>
    );
});
```

### Dependency Array Rules

```ts
// Runs on every render (no dependencies)
useEffect(() => { ... });

// Runs once on mount, cleanup on unmount
useEffect(() => { ... }, []);

// Runs when `dep1` or `dep2` change (shallow comparison)
useEffect(() => { ... }, [dep1, dep2]);
```

### Cleanup Pattern

The return value of effect callbacks MUST be either `void` or a cleanup
function. The cleanup function runs:

1. Before the next execution of the same effect
2. When the component unmounts (disconnectedCallback)

```ts
useEffect(() => {
    const timer = setInterval(() => tick(), 1000);
    return () => clearInterval(timer);  // Cleanup
}, []);
```

---

## `useLayoutEffect` — Synchronous DOM Effects

Runs **synchronously** after DOM updates but within the same microtask.
Use for DOM measurements or mutations that must happen before the user sees the
update.

```tsx
import { c, useLayoutEffect, useRef } from "atomico";

const MyComponent = c(() => {
    const ref = useRef<HTMLDivElement>();

    useLayoutEffect(() => {
        // Safe to read DOM dimensions here
        const rect = ref.current?.getBoundingClientRect();
        console.log("Element dimensions:", rect);
    }, []);

    return (
        <host shadowDom>
            <div ref={ref}>Measured element</div>
        </host>
    );
});
```

---

## `useInsertionEffect` — Pre-Paint DOM Effects

Runs **before** the DOM is painted. Ideal for injecting styles or making DOM
modifications that must be visible in the first paint.

```tsx
import { c, useInsertionEffect, useHost } from "atomico";

const MyComponent = c(() => {
    const host = useHost();

    useInsertionEffect(() => {
        // Modify host before paint
        host.current.setAttribute("aria-role", "button");
    }, []);

    return <host shadowDom><slot /></host>;
});
```

> **Note**: `useInsertionEffect` is the rarest to use. Prefer `useEffect` or
> `useLayoutEffect` unless you specifically need pre-paint DOM access.

---

## Web Component Lifecycle Mapping

| Web Component Callback | Atomico Equivalent |
|------------------------|--------------------|
| `connectedCallback` | `useEffect(() => { ... }, [])` |
| `disconnectedCallback` | `useEffect(() => () => { ... }, [])` (cleanup) |
| Prop change | `useEffect(() => { ... }, [propValue])` |
| Attribute change | Handled automatically by prop system |

### Mount/Unmount with DOM Re-attachment

Atomico preserves hook state when a component is removed and re-attached to the
DOM, as long as the parent node changes. Effect cleanups fire on
disconnectedCallback and re-mount effects fire on connectedCallback.

```tsx
const MyComponent = c(() => {
    useEffect(() => {
        console.log("Mounted");
        return () => console.log("Unmounted");
    }, []);

    return (
        <host>
            <button onclick={({ target }) => {
                const host = target.parentNode as Element;
                host.remove();
                // Re-attach after 2 seconds — effects re-run
                setTimeout(() => document.body.appendChild(host), 2000);
            }}>
                Remove & re-attach
            </button>
        </host>
    );
});
```
