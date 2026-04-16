---
name: atomico-component
description: >
  Create Atomico web components using the `c()` function. Triggers when the user
  needs to create a new custom element, define reactive props, attach styles, or
  register a component with `customElements.define`. Do NOT trigger for React,
  Vue, or Angular component creation. Atomico components are functional web
  components that return JSX with a mandatory `<host>` root element.
license: MIT
compatibility: "Atomico >=1.79, TypeScript >=5.0, JSX via atomico/jsx-runtime"
metadata:
  category: core
  priority: high
---

# Atomico Component Creation — `c()`

## Overview

`c()` is the core function to create web components in Atomico. It receives a
**render function** and an optional **configuration object** with `props`,
`styles`, and `form`.

```ts
import { c, css } from "atomico";

const MyComponent = c(
    (props) => (
        <host shadowDom>
            <h1>{props.message}</h1>
        </host>
    ),
    {
        props: {
            message: { type: String, value: () => "Hello" }
        },
        styles: css`:host { display: block; }`
    }
);

customElements.define("my-component", MyComponent);
```

## Critical Rules

### 1. Always return `<host>` as root

Every Atomico component MUST return `<host>` as the outermost JSX element.
`<host>` maps to the custom element itself.

```tsx
// ✅ Correct
const MyComponent = c(() => <host><h1>Hello</h1></host>);

// ❌ Wrong — never return a div or fragment as root
const MyComponent = c(() => <div>Hello</div>);
```

### 2. Prefer Constructor Instances in JSX

**Always use the constructor reference** (e.g., `<MyChild />`) instead of the
tag-name string (`<my-child />`) when composing components in JSX. This enables:

- **Full type inference** for props, events, and methods
- **Instance dependency tracking** — the bundler knows about the relationship
- **Autocompletion** in IDEs for all declared props and events

```tsx
// ✅ Preferred — types are inferred, props are validated
<TodoTask message="Do laundry" checked={false} onchangeTask={handler} />

// ⚠️ Avoid — no type inference, no prop validation
<todo-task message="Do laundry"></todo-task>
```

### 3. Props Declaration Patterns

Props can be declared in shorthand or detailed form:

```ts
{
    props: {
        // Shorthand — type only, value is undefined until set
        name: String,
        count: Number,
        active: Boolean,
        items: Array,
        config: Object,

        // Detailed — with default value, reflection, etc.
        message: {
            type: String,
            value: () => "default",  // Factory function for default
            reflect: true,           // Mirrors to HTML attribute
            attr: "custom-attr"      // Custom attribute name
        },

        // Custom type (e.g., another component constructor)
        child: {
            type: MyOtherComponent,
            value: () => new MyOtherComponent()
        },

        // Promise type with typed return
        data: {
            type: Promise,
            value: async (): Promise<number[]> => []
        }
    }
}
```

### 4. Supported Prop Types

| Type | JS Type | Attribute Parsing |
|------|---------|-------------------|
| `String` | `string` | Direct string |
| `Number` | `number` | `Number(value)` |
| `Boolean` | `boolean` | Presence = `true` |
| `Array` | `any[]` | `JSON.parse` |
| `Object` | `object` | `JSON.parse` |
| `Date` | `Date` | `new Date(value)` |
| `Map` | `Map` | `new Map(value)` |
| `Promise` | `Promise` | N/A |
| `Function` | `function` | N/A |
| Custom Class | instance | `new Type(value)` |
| `null` (Any) | any | No validation |

### 5. Styles with `css` Tagged Template

```tsx
import { c, css } from "atomico";

const MyComponent = c(
    () => (
        <host shadowDom>
            <slot />
        </host>
    ),
    {
        styles: css`
            :host {
                display: block;
                padding: 1rem;
            }
            ::slotted(*) {
                margin: 0.5rem;
            }
        `
    }
);
```

> **Note**: Styles use `adoptedStyleSheets` and are cached by CSS text. They
> require `shadowDom` to be enabled on `<host>`.

### 6. Events with `event()` and `callback()`

```tsx
import { c, event, callback } from "atomico";

const MyComponent = c(
    (props) => (
        <host shadowDom>
            <button onclick={() => props.change({ id: 1 })}>
                Dispatch event
            </button>
        </host>
    ),
    {
        props: {
            // Dispatches a CustomEvent — listen with `onchange` in JSX
            change: event<{ id: number }>({ bubbles: true, composed: true }),
            // Function prop — parent provides logic, child invokes it
            processMarkdown: callback<() => Promise<string>>()
        }
    }
);

// Consuming with JSX (constructor instance):
<MyComponent
    onchange={({ detail }) => console.log(detail.id)}
    processMarkdown={() => Promise.resolve("# Hello")}
/>;
```

### 7. Form-Associated Components

```tsx
const MyInput = c(
    ({ name }) => {
        const [value, setValue] = useFormProps();
        return (
            <host shadowDom={{ delegatesFocus: true }}>
                <input
                    value={value}
                    oninput={({ currentTarget }) => setValue(currentTarget.value)}
                />
            </host>
        );
    },
    {
        form: true,          // Enables formAssociated
        props: {
            name: String,
            value: String
        }
    }
);
```

### 8. Component without Props

```tsx
const SimpleComponent = c(() => <host><p>No props needed</p></host>);
customElements.define("simple-component", SimpleComponent);
```

### 9. ShadowDOM Options

```tsx
// Simple shadowDom
<host shadowDom>...</host>

// With options
<host shadowDom={{ slotAssignment: "manual", delegatesFocus: true }}>...</host>
```

## Anti-Patterns

- ❌ Using `document.createElement` instead of JSX constructors
- ❌ Returning anything other than `<host>` from the render function
- ❌ Mutating props directly — props are read-only in the render function
- ❌ Using string tag names in JSX when the constructor is available in scope
- ❌ Defining `value` as a plain value instead of a factory function
