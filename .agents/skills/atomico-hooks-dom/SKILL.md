---
name: atomico-hooks-dom
description: >
  Use useSlot, useNodes, useRender, and useParent hooks for advanced DOM
  interaction in Atomico web components. Triggers when the user needs to observe
  slotted content, access light DOM children, render into the light DOM from
  shadow DOM, or traverse the component tree to find parent elements.
license: MIT
compatibility: "Atomico >=1.79"
metadata:
  category: hooks
  priority: medium
---

# DOM Interaction Hooks

## `useSlot` — Observe Slotted Nodes

Reactively tracks the assigned nodes of a `<slot>` element. Updates whenever
the slot's content changes via `slotchange` event.

### API

```ts
const nodes = useSlot<InstanceType>(ref, filter?);
```

### Basic Usage

```tsx
import { c, useRef, useSlot } from "atomico";

const MyContainer = c(() => {
    const slotRef = useRef();
    const slots = useSlot(slotRef);

    return (
        <host shadowDom>
            <p>Slotted items: {slots.length}</p>
            <slot ref={slotRef} />
        </host>
    );
});
```

### Filtered and Typed Slots

Use a filter function to select only specific element types. Combined with a
generic type parameter, this provides full type inference:

```tsx
import { c, css, useRef, useSlot, useEffect } from "atomico";

const CardItem = c(
    ({ message }) => <host shadowDom>{message}</host>,
    {
        props: {
            message: { type: String, value: () => "Default card" }
        },
        styles: css`
            :host { display: block; border: 1px solid blue; padding: 0.5rem; }
        `
    }
);

const CardList = c(() => {
    const slotRef = useRef();

    // Only observes CardItem instances — typed!
    const cards = useSlot<typeof CardItem>(
        slotRef,
        (element) => element instanceof CardItem
    );

    useEffect(() => {
        const last = cards.at(-1);
        // TypeScript knows `last.message` is string
        console.log("Last card:", last.message.repeat(1));
    }, cards);

    return (
        <host shadowDom>
            <h2>Cards: {cards.length}</h2>
            <slot ref={slotRef} />
        </host>
    );
});
```

### Manual Slot Assignment

```tsx
const MyComponent = c(() => {
    const slotRef = useRef();
    const slots = useSlot(slotRef);

    return (
        <host shadowDom={{ slotAssignment: "manual" }}>
            Count: {slots.length}
            <slot ref={slotRef} />
        </host>
    );
});
```

---

## `useNodes` — Observe Light DOM Children

Reactively tracks child nodes of the host element using a `MutationObserver`.
Unlike `useSlot`, this works with the light DOM directly and doesn't require a
`<slot>`.

### API

```ts
const nodes = useNodes<NodeType>(filter?);
```

### Usage

```tsx
import { c, css, useNodes } from "atomico";

const MyList = c(
    () => {
        // Only observe Element children (skip text nodes, comments)
        const nodes = useNodes<Element>((el) => el instanceof Element);

        return (
            <host shadowDom={{ slotAssignment: "manual" }}>
                <ul>
                    {nodes.map((el) => (
                        <li>
                            <slot assignNode={el} />
                        </li>
                    ))}
                </ul>
            </host>
        );
    },
    {
        styles: css`
            :host { border: 1px solid red; display: block; }
        `
    }
);
```

### Key Characteristics

1. **Requires shadowRoot**: `useNodes` only works when `shadowDom` is enabled
2. **MutationObserver-based**: Automatically detects child additions/removals
3. **Filters Mark nodes**: Internal `Mark` nodes (fragment markers) are excluded
4. **Text node tracking**: Also observes `characterData` changes in text nodes

### Use with Manual Slot Assignment

`useNodes` is especially powerful with `slotAssignment: "manual"` and the
`assignNode` slot prop — it lets you dynamically control how light DOM children
are distributed in shadow DOM:

```tsx
<host shadowDom={{ slotAssignment: "manual" }}>
    {nodes.map((el) => (
        <li><slot assignNode={el} /></li>
    ))}
</host>
```

---

## `useRender` — Render Into Light DOM

Renders virtual DOM into the **light DOM** (the host element itself) while the
component UI lives in the shadow DOM. Useful for SEO, accessibility, or when
external CSS needs to style content.

### API

```ts
useRender(view: () => VNode, args?: any[]);
```

### Usage

```tsx
import { c, useRender, css } from "atomico";

const MyWidget = c(
    () => {
        // This renders into the light DOM
        useRender(() => (
            <button>
                This button is in the light DOM, rendered from the component
            </button>
        ));

        // This renders into the shadow DOM
        return (
            <host shadowDom>
                <p>Shadow DOM content</p>
                <slot />  {/* Light DOM button appears here */}
            </host>
        );
    },
    {
        styles: css`
            :host {
                display: block;
                padding: 1rem;
                border: 2px dashed green;
            }
        `
    }
);
```

### When to Use

- **SEO**: Search engines can see light DOM content
- **External styling**: Light DOM is styleable by page CSS
- **Form elements**: Native form elements in light DOM participate in forms
- **Accessibility**: Screen readers access light DOM more reliably

---

## `useParent` — Find Ancestor Element

Traverses up the DOM tree from the host element to find a matching ancestor.
Returns a ref to the found element.

### API

```ts
const parentRef = useParent(element: string | Constructor, composed?: boolean);
```

### Parameters

- `element`: CSS selector string OR a constructor function (for `instanceof`)
- `composed`: If `true`, traverses through shadow DOM boundaries
  (via `assignedSlot`, `parentNode`, `host`)

### Usage with CSS Selector

```tsx
import { c, useParent, useListener } from "atomico";

const MyChild = c(() => {
    // Find nearest <form> ancestor, crossing shadow boundaries
    const formRef = useParent("form", true);

    useListener(formRef, "submit", (event: Event) => {
        event.preventDefault();
        console.log("Form submitted!");
    });

    return (
        <host shadowDom>
            <p>Parent: {formRef.current?.localName}</p>
        </host>
    );
});
```

### Usage with Constructor (Preferred for Type Safety)

```tsx
import { c, useParent } from "atomico";

const MyParent = c(
    () => <host shadowDom><slot /></host>,
    { props: { message: String } }
);

const MyChild = c(() => {
    // ✅ Preferred — instanceof check provides type inference
    const parentRef = useParent(MyParent);

    return (
        <host>
            <p>Parent message: {parentRef.current?.message}</p>
        </host>
    );
});
```

### Key Characteristics

1. **Ref return**: Returns `{ current: Element | null }` — check for null
2. **Composed traversal**: With `composed: true`, walks through shadow DOM
   boundaries (via `assignedSlot || parentNode || host`)
3. **Cleanup**: Automatically clears the ref on unmount
4. **Memoized**: Only re-traverses when the found parent changes

### Composed vs Non-Composed Traversal

```
// composed: false (default)
host → parentNode → parentNode → ...

// composed: true
host → assignedSlot || parentNode || host → ... (crosses shadow boundaries)
```
