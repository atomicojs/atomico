# Atomico Hooks API Reference

Atomico shares hooks concepts with React, but adapts their execution to the native Custom Elements lifecycle. This document consolidates all available Atomico hooks.

---

## 1. Core Hooks

### `useState` — Local Reactive State
Works identically to React's `useState`. Accepts an initial value or a factory function. Returns `[value, setter]`.
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

* **Type Inference:**
  ```ts
  const [count, setCount] = useState(0); // Inferred as number
  const [active, setActive] = useState<boolean>(); // Explicit generic
  const [items, setItems] = useState<string>(() => "welcome"); // Factory function
  ```
* **Setter Behavior:** The setter only triggers an update if the new value is strictly different (`!==`) from the current value.

### `useMemo` — Memoized Computation
Caches the return of a callback. Only recomputes when dependencies change.
```ts
import { useMemo } from "atomico";
const expensive = useMemo(() => computeHeavyValue(data), [data]);
```

### `useCallback` — Memoized Function Reference
Shorthand for `useMemo(() => callback, args)`. Returns the same function reference until dependencies change.
```ts
import { useCallback } from "atomico";
const handler = useCallback((param: boolean) => param ? 10 : 0, [dependency]);
```

### `useRef` — Persistent Mutable Reference
Creates a persistent reference object `{ current }` that survives re-renders. Commonly used for DOM element references.
```tsx
import { c, useRef } from "atomico";

const MyComponent = c(() => {
    const inputRef = useRef<HTMLInputElement>();
    return (
        <host shadowDom>
            <input ref={inputRef} />
            <button onclick={() => inputRef.current?.focus()}>Focus</button>
        </host>
    );
});
```
* **Typed Refs for Custom Elements:**
  ```tsx
  import { useRef } from "atomico";
  import { MyChild } from "./my-child.js";
  const childRef = useRef<typeof MyChild>();
  childRef.current?.myProp; // Full type inference on component props
  ```

### `useHost` — Access Host Element
Returns a ref to the host custom element instance (`this`).
```tsx
import { c, useHost } from "atomico";

const MyComponent = c(() => {
    const host = useHost();
    host.current.updated.then(() => {
        console.log("Component rendered!");
    });
    return <host><p>Hello</p></host>;
});
```

### `useUpdate` — Force Re-render
Returns the component's update function. Calling it forces a re-render.
```ts
const update = useUpdate();
update();
```

### `useId` — Stable Unique Identifier
Generates a unique, stable ID for the current hook position. Useful for accessibility.
```tsx
const id = useId();
return (
    <host shadowDom>
        <label for={id}>Name</label>
        <input id={id} />
    </host>
);
```

### `useHook` — Low-Level Custom Hook Primitive
The building block for all other hooks. Manages persistent state across renders using a callback pattern.
```ts
import { useHook } from "atomico";

const useMyCustomHook = () => {
    return useHook((state = { count: 0 }) => {
        state.count++;
        return state;
    });
};
```

---

## 2. Prop Binding Hook (`useProp`)

Provides a `[value, setter]` tuple for a declared prop, synced with the component's public prop API. Setting a value updates the actual property on the custom element instance.

```tsx
import { c, useProp } from "atomico";

export const Toggle = c(() => {
    const [active, setActive] = useProp<boolean>("active");
    return (
        <host shadowDom>
            <button onclick={() => setActive(!active)}>{active ? "ON" : "OFF"}</button>
        </host>
    );
}, {
    props: {
        active: { type: Boolean, reflect: true }
    }
});
```

### ⚠️ Important Rules for `useProp`

1. **useProp vs `event()` for Component State:** If you are emitting a change representing internal state (e.g., input text, open status), **use `useProp`** linked to a declared prop instead of an isolated custom event. When you call `setValue(newValue)`, Atomico updates the host element and fires a property update change event.
2. **Prop must exist:** The prop name passed to `useProp` MUST be declared in the component's `props` configuration.
3. **useProp vs props parameter:** Use `useProp` when you need to **write** props from within the component. Use the `props` parameter of the render function when you only need to **read**.

---

## 3. Async Hooks

### `usePromise` — Promise State Tracking
Executes an async callback and tracks its state.
```ts
const state = usePromise(callback, args?, autorun?);
// Returns: { result?, pending?, fulfilled?, rejected?, aborted? }
```

```tsx
import { c, usePromise } from "atomico";

const PhotoList = c(() => {
    const promise = usePromise(
        async () => fetch("/api/photos").then((res) => res.json()),
        []
    );
    return (
        <host>
            {promise.fulfilled ? (
                promise.result.map((item) => <li>{item.title}</li>)
            ) : (
                <li>Loading...</li>
            )}
        </host>
    );
});
```

### `useAsync` — Suspense-Based Async
Throws a `SUSPENSE` signal while pending. The component won't render until the promise resolves. **Must be used inside a `useSuspense` boundary**.
```tsx
const result = useAsync(async () => fetch("/api/photos").then((r) => r.json()), []);
```

### `useSuspense` — Loading Boundary
Creates a suspense boundary tracking all `usePromise`/`useAsync` states in its subtree via context.
```tsx
import { c, useSuspense } from "atomico";

const App = c(() => {
    const status = useSuspense();
    return (
        <host shadowDom>
            <h1>{status.pending ? "Loading..." : "All done!"}</h1>
            <DataLoader />
        </host>
    );
});
```

### `useAbortController` — Cancellable Requests
Creates an `AbortController` aborted when dependencies change or the component unmounts.
```tsx
const controller = useAbortController([query]);
const promise = usePromise(
    (q) => fetch(`/api/search?q=${q}`, { signal: controller.signal }).then((r) => r.json()),
    [query]
);
```

---

## 4. Effect Hooks

### Execution Order
```
render() → useInsertionEffect → DOM paint → useLayoutEffect → microtask → useEffect
```

* `useInsertionEffect` (Before Paint): CSS injection or DOM pre-modifications.
* `useLayoutEffect` (Sync After Paint): DOM measurements, slot adjustments.
* `useEffect` (Async After Paint): Data fetching, subscriptions, timers.

```tsx
import { c, useEffect, useLayoutEffect } from "atomico";

const MyComponent = c(() => {
    useEffect(() => {
        console.log("Mounted (connectedCallback)");
        return () => console.log("Unmounted (disconnectedCallback)");
    }, []);

    useLayoutEffect(() => {
        // Measure DOM
    }, []);

    return <host shadowDom />;
});
```

---

## 5. Event Hooks

### `useEvent` — Dispatch Custom Events
Creates a dispatcher function that fires a `CustomEvent` from the host element.
```tsx
import { c, useEvent } from "atomico";

const MyButton = c(() => {
    const dispatch = useEvent("myAction", { bubbles: true, composed: true });
    return (
        <host>
            <button onclick={() => dispatch({ action: "clicked" })}>Click</button>
        </host>
    );
});
```

### `useListener` — Listen to DOM Events
Attaches an event listener to a ref'd element. Automatically cleaned up when unmounted.
```tsx
import { c, useRef, useListener } from "atomico";

const MyComponent = c(() => {
    const buttonRef = useRef<HTMLButtonElement>();
    useListener(buttonRef, "click", (e) => console.log("Clicked", e));
    return (
        <host shadowDom>
            <button ref={buttonRef}>Click me</button>
        </host>
    );
});
```

---

## 6. Form Hooks

Form hooks enable components to participate as native form elements. They require setting `form: true` in the component configuration.

### `useInternals` — Access ElementInternals
Low-level hook that returns the `ElementInternals` object for the host element.
```tsx
const internals = useInternals();
```

### `useFormProps` — Bidirectional Form Value
Combines `useProp` for `name` and `value` props with automatic `FormData` submission and form reset handling.
```tsx
const [value, setValue] = useFormProps(); // default props: "name", "value"
```

### `useFormValidity` — Form Validation
Integrates with the browser's constraint validation API.
```tsx
const [message, validity] = useFormValidity(
    () => delegateValidity(inputRef.current),
    [value]
);
```

### Other Form Hooks:
* `useFormValue(propName)`: Manual control over the form submission value.
* `useFormSubmit(callback)`: Listens to the associated form's `submit` event.
* `useFormReset(callback)`: Registers a callback for when the form resets.
* `useFormAssociated(callback)`: Fires when associated with a form.
* `useFormDisabled(callback)`: Fires when disabled state changes.

---

## 7. DOM Interaction Hooks

### `useSlot` — Observe Slotted Nodes
Reactively tracks assigned nodes of a `<slot>`.
```tsx
const slotRef = useRef();
const slots = useSlot(slotRef);
```
* **Filter slots**:
  ```tsx
  const cards = useSlot<typeof CardItem>(slotRef, (el) => el instanceof CardItem);
  ```

### `useNodes` — Observe Light DOM Children
Tracks light DOM child nodes of the host element using a `MutationObserver`. Works especially well with manual slot assignments:
```tsx
const nodes = useNodes<Element>((el) => el instanceof Element);
return (
    <host shadowDom={{ slotAssignment: "manual" }}>
        {nodes.map(el => <li><slot assignNode={el} /></li>)}
    </host>
);
```

### `useParent` — Find Ancestor Element
Traverses up the DOM tree from the host.
```ts
const parentRef = useParent(MyParent); // Preferred (Constructor-based instanceof check)
const formRef = useParent("form", true); // Selector-based, composé=true traverses shadow roots
```

### `useRender` — Render into Light DOM
Renders virtual DOM into the light DOM (for SEO or external styling) while the UI resides in the shadow DOM.
```tsx
useRender(() => <button>Light DOM button</button>);
return <host shadowDom><slot /></host>;
```
