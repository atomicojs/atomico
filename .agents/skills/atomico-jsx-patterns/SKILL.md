---
name: atomico-jsx-patterns
description: >
  Best practices and patterns for using JSX in Atomico web components.
  Triggers when the user needs guidance on JSX composition, constructor vs
  tag-name usage, type inference patterns, slot management, style handling,
  or virtualDOM rendering behavior. Covers the critical recommendation to
  prefer constructor instances over tag-name strings for type safety.
license: MIT
compatibility: "Atomico >=1.79, TypeScript >=5.0"
metadata:
  category: patterns
  priority: high
---

# JSX Patterns & Best Practices

## 🏆 Golden Rule: Constructor Instances over Tag Strings

**Always prefer constructor references** (`<MyComponent />`) over tag-name
strings (`<my-component />`) in JSX. This is the single most important pattern
in Atomico for leveraging the type system.

### Why?

| Feature | `<MyComponent />` | `<my-component />` |
|---------|--------------------|--------------------|
| Prop type checking | ✅ Full | ❌ None |
| Event type inference | ✅ `detail` typed | ❌ Untyped |
| IDE autocompletion | ✅ All props/events | ❌ None |
| Dependency tracking | ✅ Import graph | ❌ Hidden |
| Refactoring safety | ✅ Rename cascades | ❌ Manual updates |

### Example

```tsx
import { c, event } from "atomico";

// ── Define child component ──
const TodoTask = c(
    ({ checked, message, changeTask }) => (
        <host shadowDom>
            <label onchange={(e) => changeTask((e.target as HTMLInputElement).checked)}>
                <input type="checkbox" checked={checked} />
                <span>{message}</span>
            </label>
        </host>
    ),
    {
        props: {
            changeTask: event<boolean>({ bubbles: true, composed: true }),
            message: String,
            checked: { type: Boolean, reflect: true }
        }
    }
);

// ── Compose with constructor ──
const TodoApp = c(() => (
    <host shadowDom>
        {/* ✅ Full type inference — all props validated */}
        <TodoTask
            message="Buy groceries"
            checked={false}
            onchangeTask={({ detail }) => {
                console.log(detail);  // boolean — inferred!
            }}
        />

        {/* ❌ No type inference, no validation */}
        <todo-task message="Buy groceries"></todo-task>
    </host>
));
```

---

## The `<host>` Element

`<host>` is a special JSX element that represents the custom element itself.
It MUST be the root of every Atomico component's return value.

### Props on `<host>`

```tsx
<host
    // Enable shadow DOM
    shadowDom
    // Shadow DOM with options
    shadowDom={{ slotAssignment: "manual", delegatesFocus: true }}
    // Standard DOM properties
    class="my-class"
    style={{ color: "red" }}
    // Event handlers
    onclick={(e) => console.log(e)}
>
    {children}
</host>
```

---

## Slot Patterns

### Default Slot

```tsx
<host shadowDom>
    <header>Header content</header>
    <slot />  {/* Light DOM children appear here */}
    <footer>Footer content</footer>
</host>
```

### Named Slots

```tsx
<host shadowDom>
    <slot name="header" />
    <main>
        <slot />  {/* Default slot */}
    </main>
    <slot name="footer" />
</host>

// Usage in HTML:
// <my-component>
//     <h1 slot="header">Title</h1>
//     <p>Default content</p>
//     <footer slot="footer">Footer</footer>
// </my-component>
```

### Manual Slot Assignment

```tsx
<host shadowDom={{ slotAssignment: "manual" }}>
    {nodes.map((node) => (
        <li>
            <slot assignNode={node} />
        </li>
    ))}
</host>
```

---

## Style Patterns

### Inline Styles (Object)

```tsx
<div style={{
    color: "red",
    fontSize: "1rem",
    "--custom-var": "blue"     // CSS custom properties
}} />
```

### Inline Styles (String)

```tsx
<div style="color: red; font-size: 1rem;" />
```

### CSS Variable Theming

```tsx
const MyComponent = c(
    () => (
        <host shadowDom>
            <div class="card">Themed card</div>
        </host>
    ),
    {
        styles: css`
            :host {
                --bg: #f0f0f9;
                --border: #dcdce1;
            }
            :host([active]) {
                --bg: #a3ebd4;
                --border: #6ee2c9;
            }
            .card {
                background: var(--bg);
                border: 1px solid var(--border);
                padding: 1rem;
                border-radius: 0.5rem;
            }
        `
    }
);
```

---

## Conditional Rendering

```tsx
<host>
    {isLoading ? (
        <p>Loading...</p>
    ) : error ? (
        <p>Error: {error.message}</p>
    ) : (
        <div>{data}</div>
    )}
</host>
```

---

## List Rendering with Keys

```tsx
<host>
    <ul>
        {items.map((item) => (
            <li key={item.id}>{item.name}</li>
        ))}
    </ul>
</host>
```

> **Note**: Keys enable efficient list reconciliation. Without keys, Atomico
> uses positional matching. With keys, nodes can be reordered via `moveBefore`
> (if supported) preserving focus, scroll, and animation state.

---

## Event Handler Patterns

### Inline Handlers Over Extracted Functions

```tsx
// ❌ Don't: Extracts the handler, breaks inference, forces manual type casting
const handleInput = (e: InputEvent) => {
    const val = (e.currentTarget as HTMLInputElement).value;
    inputChange(val);
};

// <input oninput={handleInput} />

// ✅ Do Instead: Keep it inline. TypeScript infers `currentTarget` automatically from the tag.
// <input oninput={({ currentTarget }) => inputChange(currentTarget.value)} />
```

> **Note**: Only extract event handlers to standalone functions if the exact same handler is shared across multiple different elements. Inline handlers leverage Atomico's deep JSX type integration, avoiding verbose overhead.

### Direct Handler

```tsx
<button onclick={(e) => handleClick(e)}>Click</button>
```

### With Options

```tsx
<button onclick={Object.assign(
    (e) => handleClick(e),
    { capture: true, once: true, passive: true }
)}>
    Click (with options)
</button>
```

### Event Delegation via currentTarget

```tsx
<form
    oninput={({ currentTarget }) => {
        const data = new FormData(currentTarget as HTMLFormElement);
        console.log(Object.fromEntries(data));
    }}
>
    <input name="field1" />
    <input name="field2" />
</form>
```

---

## Ref Patterns

### Element Reference

```tsx
const ref = useRef<HTMLInputElement>();
<input ref={ref} />
// Access: ref.current?.focus()
```

### Callback Ref

```tsx
<input ref={(node) => console.log("Element mounted:", node)} />
```

### Component Reference

```tsx
const childRef = useRef<typeof MyChild>();
<MyChild ref={childRef} />
// Access: childRef.current?.myProp
```

---

## Static Node Optimization

Prevent re-rendering of a subtree with `staticNode`:

```tsx
<div staticNode>
    {/* This subtree is rendered once and never updated */}
    <heavy-visualization data={initialData} />
</div>
```

---

## Fragment Pattern

```tsx
import { Fragment } from "atomico";

<host>
    <Fragment>
        <p>First</p>
        <p>Second</p>
    </Fragment>
</host>
```

Or with shorthand (if configured):

```tsx
<host>
    <>
        <p>First</p>
        <p>Second</p>
    </>
</host>
```

---

## SVG Support

Atomico auto-detects SVG context and creates elements in the SVG namespace:

```tsx
<host shadowDom>
    <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="red" />
        <foreignObject x="10" y="10" width="80" height="80">
            {/* HTML content inside SVG */}
            <div>HTML in SVG!</div>
        </foreignObject>
    </svg>
</host>
```

---

## Anti-Patterns

| ❌ Don't | ✅ Do Instead |
|----------|---------------|
| `<my-child />` in JSX | `<MyChild />` |
| Return `<div>` as root | Return `<host>` |
| `document.createElement` | Use JSX |
| Mutate props directly | Use `useProp` or `useState` |
| Inline complex logic in JSX | Extract to hooks or utils |
| Skip `key` in dynamic lists | Always provide `key` |
