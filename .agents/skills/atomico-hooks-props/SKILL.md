---
name: atomico-hooks-props
description: >
  Use useProp hook to create bidirectional bindings to component props.
  Triggers when the user needs to read AND write a component prop reactively
  from within the component, especially for two-way data flow or controlled
  input patterns. Do NOT confuse with regular props access via the render
  function parameter — useProp provides a setter.
license: MIT
compatibility: "Atomico >=1.79"
metadata:
  category: hooks
  priority: high
---

# `useProp` — Bidirectional Prop Binding

## Overview

`useProp` provides a `[value, setter]` tuple for a declared prop, similar to
`useState` but synced with the component's public prop API. When you set a value
via `useProp`, it updates the actual property on the custom element instance,
making it visible to external consumers.

## API

```ts
const [value, setValue] = useProp<T>(propName: string);
```

## Usage

### Basic Pattern

```tsx
import { c, useProp } from "atomico";

const Toggle = c(
    () => {
        const [active, setActive] = useProp<boolean>("active");

        return (
            <host shadowDom>
                <button onclick={() => setActive(!active)}>
                    {active ? "ON" : "OFF"}
                </button>
            </host>
        );
    },
    {
        props: {
            active: {
                type: Boolean,
                reflect: true  // Mirrors to HTML attribute
            }
        }
    }
);
```

### Controlled Input

```tsx
const MyInput = c(
    () => {
        const [value = "", setValue] = useProp<string>("value");

        return (
            <host shadowDom>
                <input
                    value={value}
                    oninput={({ currentTarget }) => {
                        setValue(currentTarget.value);
                    }}
                />
            </host>
        );
    },
    {
        props: {
            value: String
        }
    }
);
```

### With Default Value Destructuring

When a prop may be `undefined` initially, use a default in destructuring:

```ts
const [value = 0, setValue] = useProp<number>("value");
```

### Setter Variants

```ts
// Direct value
setValue(42);

// Functional update (receives current value)
setValue((prev = 0) => prev + 1);

// Reset to null/undefined
setValue(null);
setValue(undefined);
```

### Multiple Prop Types

```ts
// Number
const [count = 0, setCount] = useProp<number>("count");

// Boolean
const [expanded, setExpanded] = useProp<boolean>("expanded");
setExpanded((prev) => !prev);

// Date
const [date, setDate] = useProp<Date>("date");

// Object
const [config, setConfig] = useProp<{ id: number }>("config");
setConfig({ id: config?.id || 0 });

// Callback
const [handler, setHandler] = useProp<(value: number) => number>("handler");
handler && handler(10);

// String with handler
const [, setValueFromHandler] = useProp<string>("value");
const handleChange = (event: Event) => {
    setValueFromHandler(
        (event.currentTarget as HTMLElement).getAttribute("value")
    );
};
```

## ⚠️ Important Rules

1. **Prop must exist**: The prop name passed to `useProp` MUST be declared in
   the component's `props` configuration. Otherwise, a `PropError` is thrown.

2. **useProp vs props parameter**: Use `useProp` when you need to **write**
   prop values from inside the component. Use the `props` function parameter
   when you only need to **read**.

```tsx
// ✅ Read-only access — use props parameter
const MyComponent = c((props) => <host>{props.message}</host>, {
    props: { message: String }
});

// ✅ Read/write access — use useProp
const MyComponent = c(() => {
    const [message, setMessage] = useProp<string>("message");
    return <host>{message}</host>;
}, {
    props: { message: String }
});
```

3. **External visibility**: When `useProp` updates a value, the change is
   reflected on the custom element instance (`element.myProp = newValue`), and
   if `reflect: true`, on the HTML attribute as well.
