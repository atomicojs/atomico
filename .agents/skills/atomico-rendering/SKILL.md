---
name: atomico-rendering
description: >
  Understand Atomico's virtual DOM rendering engine: createElement, render,
  Fragment, Mark, and reconciliation. Triggers when the user needs to understand
  how Atomico renders, how keyed reconciliation works, how moveBefore is used
  for DOM reordering, or how the render pipeline (hooks → render → effects)
  operates. Also covers utilities like createRef, className, and delegateValidity.
license: MIT
compatibility: "Atomico >=1.79"
metadata:
  category: internal
  priority: low
---

# Rendering Engine & Utilities

## Render Pipeline

Each Atomico component follows this render cycle:

```
1. connectedCallback (mount)
2. component render function executes
3. useInsertionEffect callbacks fire
4. Virtual DOM diff → DOM mutations
5. useLayoutEffect callbacks fire
6. (microtask boundary)
7. useEffect callbacks fire
```

### Update Cycle

```
prop change / setState / useUpdate()
  → this.update() called
  → await mounted promise
  → hooks.render(this._render)
  → hooks.dispatch(INSERTION_EFFECT)
  → render(result, this, this.symbolId)
  → hooks.dispatch(LAYOUT_EFFECT)
  → await microtask
  → hooks.dispatch(EFFECT)
```

---

## `createElement` / `h` — Create Virtual Nodes

The function underlying JSX transformation.

```ts
import { createElement, h } from "atomico";

// These are equivalent:
const vnode1 = createElement("div", { class: "card" }, "Hello");
const vnode2 = h("div", { class: "card" }, "Hello");
const vnode3 = <div class="card">Hello</div>;  // JSX
```

### VNode Structure

```ts
{
    type: "div" | Constructor | Node,
    props: { ... },
    key: any
}
```

---

## Virtual DOM Reconciliation

### Keyed Lists

When children have `key` props, Atomico uses keyed reconciliation:

```tsx
{items.map((item) => (
    <li key={item.id}>{item.name}</li>
))}
```

- Keyed nodes are tracked in a `Map<key, ChildNode>`
- Reordered nodes use `moveBefore` (if available) to preserve internal state
  (focus, scroll position, etc.)
- Orphaned keyed nodes are collected and removed after reconciliation

### Non-Keyed Lists

Without keys, Atomico uses positional matching and replaces nodes in-place.

### `moveBefore` API

Atomico detects browser support for `moveBefore` and uses it for keyed list
reordering. This preserves:

- Input focus state
- Scroll positions
- CSS animations
- `<video>`/`<audio>` playback state

---

## `Fragment`

Groups children without adding a DOM wrapper:

```tsx
import { Fragment } from "atomico";

<Fragment>
    <p>First</p>
    <p>Second</p>
</Fragment>
```

---

## `Mark` — Internal Fragment Boundary

`Mark extends Text` — used internally to delimit fragment boundaries in the
DOM. The `renderChildren` algorithm uses `Mark` instances as sentinels.

> **Note**: `Mark` nodes are filtered out by `useSlot` and `useNodes` hooks
> automatically. You should never need to create or interact with them directly.

---

## `render` — Mount VNodes to DOM

The imperative render function for mounting virtual DOM trees:

```ts
import { render, createElement } from "atomico";

render(
    createElement("host", { children: "Hello" }),
    document.getElementById("app")
);
```

---

## Component Instance Properties

Every Atomico element instance has these special properties:

| Property | Type | Description |
|----------|------|-------------|
| `updated` | `Promise<void>` | Resolves after the current render cycle |
| `update()` | `() => void` | Triggers a re-render |
| `symbolId` | `Symbol` | Unique render ID for the instance |

### Waiting for Render Completion

```tsx
const el = new MyComponent();
document.body.appendChild(el);
await el.updated;
// DOM is now fully rendered
```

---

## Utilities

### `createRef`

Creates a ref object `{ current: T }`:

```ts
import { createRef } from "atomico";

const ref = createRef<HTMLElement>();
ref.current;  // HTMLElement | undefined
```

### `className` (from `atomico/utils`)

Concatenates class names, filtering falsy values:

```ts
import { className } from "atomico/utils";

className("base", isActive && "active", isLarge && "large");
// "base active" (if isActive is true, isLarge is false)
```

### `delegateValidity` (from `atomico/utils`)

Extracts validity state from a native input for use with `useFormValidity`:

```ts
import { delegateValidity } from "atomico/utils";

const result = delegateValidity(inputElement);
// { valid, message, valueMissing, tooShort, ... }
```

---

## Property Assignment Logic

When setting properties on DOM nodes, Atomico follows this priority:

1. **`shadowDom`, `staticNode`, `cloneNode`, `children`, `key`**: Internal props, not
   applied to the DOM
2. **`on*` handlers**: Registered as event listeners with event delegation
3. **`ref`**: Applied as `.current = node` or called as function
4. **`style`**: Applied as object (per-property) or string (cssText)
5. **`assignNode` on `<slot>`**: Calls `slot.assign(node)` in a task queue
6. **`$`-prefixed**: Always set as attributes (forces attribute mode)
7. **Properties in element prototype** (and not in PROPS_AS_ATTRS): Set as
   properties
8. **Everything else**: Set as attributes

### Special Attributes (Always Set as Attributes)

`list`, `type`, `size`, `form`, `width`, `height`, `src`, `href`, `slot`

### Checked Properties (Read from DOM)

`checked`, `value`, `selected` — values are read from the DOM node before
comparison to detect external mutations.
