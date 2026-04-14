---
name: atomico-context
description: >
  Use Atomico's context system: createContext, useContext, useProvider.
  Triggers when the user needs to share state or dependencies across nested web
  components without prop-drilling, implement theme providers, or pass
  configuration down a component tree. Works across shadow DOM boundaries via
  events, not React-style fiber context.
license: MIT
compatibility: "Atomico >=1.79"
metadata:
  category: core
  priority: medium
---

# Context System

Atomico's context system works across shadow DOM boundaries using Custom Events
for communication. It is conceptually similar to React Context but designed
for web component composition.

## `createContext` — Define a Context

Creates a context object with a default value. The context itself is a web
component that wraps content and provides values to descendants.

### API

```ts
const MyContext = createContext<T>(defaultValue: T);
```

### Usage

```tsx
import { c, createContext, useContext, css } from "atomico";

// Create context with default value
const ThemeContext = createContext({ name: "Atomico" });

// Register the context as a custom element
customElements.define("theme-context", ThemeContext);
```

---

## `useContext` — Consume a Context Value

Reads the current value from the nearest ancestor context provider.

### API

```ts
const value = useContext(ContextConstructor);
```

### Basic Example

```tsx
import { c, createContext, useContext, css } from "atomico";

const MyContext = createContext({ name: "Atomico" });

const MyComponent = c(
    () => {
        const { name } = useContext(MyContext);

        return (
            <host shadowDom>
                <strong>{name}</strong>
            </host>
        );
    },
    {
        styles: css`:host { display: grid; }`
    }
);

customElements.define("my-context", MyContext);
customElements.define("my-component", MyComponent);
```

### HTML Usage

```html
<my-context value='{"name": "Custom Name"}'>
    <my-component></my-component>
</my-context>
```

---

## `useProvider` — Provide a Context Value

Provides a value for a context to all descendants. This is the lower-level API
used internally by `createContext`.

### API

```ts
useProvider(ContextConstructor, value);
```

### Custom Provider Pattern

```tsx
const AppState = createContext({ count: 0, theme: "dark" });

const AppProvider = c(
    () => {
        const [count, setCount] = useState(0);

        useProvider(AppState, {
            count,
            increment: () => setCount((c) => c + 1)
        });

        return (
            <host shadowDom>
                <slot />
            </host>
        );
    }
);
```

---

## Nested Context and Value Override

Contexts can be nested to override values at different tree levels:

```tsx
const MyContext = createContext({ name: "Atomico" });

const MyComponent = c(
    () => {
        const { name } = useContext(MyContext);

        return (
            <host shadowDom>
                <strong>{name}</strong>

                <div>
                    <strong>Dynamic Slot</strong>
                    {/* Override context for slotted children */}
                    <MyContext value={{ name: name + "-x2" }}>
                        <slot />
                    </MyContext>
                </div>

                <div>
                    <strong>Static Slot</strong>
                    <MyContext value={{ name: "Static!" }}>
                        <slot name="static" />
                    </MyContext>
                </div>
            </host>
        );
    },
    {
        styles: css`
            :host { display: grid; }
            div {
                padding: 0 1rem;
                border-left: 1px solid red;
            }
        `
    }
);
```

### HTML for Nested Example

```html
<my-component>
    <!-- Receives "Atomico-x2" from dynamic override -->
    <my-component slot="">
        <!-- Receives "Atomico-x2-x2" — double nesting -->
        <my-component></my-component>
    </my-component>

    <!-- Receives "Static!" from named slot override -->
    <my-component slot="static"></my-component>
</my-component>
```

---

## How It Works Internally

1. **Provider** listens for `ConnectContext` events (bubbles + composed)
2. **Consumer** dispatches `ConnectContext` with context ID and a connect callback
3. Provider intercepts the event, stops propagation, and calls the connect callback
4. Provider dispatches `ChangedValue` events when the value updates
5. Consumer listens for `ChangedValue` on the provider element and re-renders

This event-based mechanism transparently crosses shadow DOM boundaries.

---

## Best Practices

### ✅ Register contexts as custom elements

```ts
customElements.define("my-context", MyContext);
```

### ✅ Use constructor instances in JSX (for type safety)

```tsx
<MyContext value={{ name: "Override" }}>
    <MyConsumer />
</MyContext>
```

### ✅ Default values as fallback

If no provider is found, `useContext` falls back to the default value passed
to `createContext`.

### ❌ Don't mutate context values

Always provide new object references to trigger updates:

```tsx
// ❌ Mutation doesn't trigger update
context.name = "New";

// ✅ New object reference triggers update
useProvider(MyContext, { ...context, name: "New" });
```
