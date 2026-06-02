# Rule: Props Declaration & Events

Pragmatic guidelines for defining properties, reflecting attributes, typing references, and managing unidirectional and bidirectional communication in Atomico.

---

## 1. Property Syntax Selection (Shorthand vs Default Factories)

According to the complexity and design objectives of each property, select the appropriate syntax configuration:

1. **Shorthand Type Direct (`message: String`)**: Use this direct type definition by default for simple read-only properties that do not require an initial default state and do not need to reflect as attributes. This keeps the component definition clean and readable.
2. **Configuration Object with Factory Callback (`value: () => defaultValue`)**: Use a configuration object *exclusively* when the property requires an initial default state or attribute reflection (`reflect: true`). In this case, **`value` must strictly be an arrow-function factory callback** returning the value.

### ❌ Incorrect
```tsx
props: {
    // ❌ BAD: Raw static values used as defaults in configuration objects
    name: { type: String, value: "User Name" },
    counter: { type: Number, value: 0 },
    // ❌ BAD: Over-verbose configuration for a simple prop without default state or reflect
    message: { type: String }
}
```

### ✅ Correct
```tsx
props: {
    // ✅ GOOD: Direct shorthand type for simple read-only props
    message: String,
    
    // ✅ GOOD: Configuration object using factory callback for default states
    name: { type: String, value: () => "User Name" },
    counter: { type: Number, value: () => 0, reflect: true },
    tags: { type: Array, value: () => [] }
}
```

---

## 2. Reflected Props for CSS Styling

Setting `reflect: true` is used specifically to **control component styling and visual states via CSS**. When reflected, the property maps directly to an HTML attribute on the host element, allowing the use of highly efficient CSS attribute selectors.

* **Design Purpose**: Always reflect properties (such as `show`, `disabled`, `active`, or `variant`) when they represent a visual state that should trigger styling rules.
* **Reflected Types**: Allowed exclusively for simple serializable types (`String`, `Number`, `Boolean`).
* **Complex Types**: Setting `reflect: true` is strictly prohibited for `Array` or `Object` types to prevent expensive DOM serialization.

```tsx
import { c, css } from "atomico";

export const Alert = c(
    () => <host shadowDom>Alert Box</host>,
    {
        props: {
            variant: {
                type: String,
                reflect: true,
                value: () => "primary" // ✅ OK: String reflected for styling variants
            },
            show: {
                type: Boolean,
                reflect: true,
                value: () => false // ✅ OK: Boolean reflected for state toggling
            }
        },
        // Sincronización con selectores CSS en el host:
        styles: css`
            :host { display: none; }
            :host([show]) { display: block; }
            :host([variant="danger"]) { color: red; }
        `
    }
);
```
---

## 3. TypeScript: Inferencia y Ref Tipado (`useRef`)

Atomico provides native support for component constructor types to type references inside hooks.

* **useRef Typing**: Use `useRef<typeof Component>()` directly. There is no need for `InstanceType<typeof Component>` or using `any`.

```tsx
import { c, useRef } from "atomico";
import { MyButton } from "./my-button.js";

export const MyForm = c(() => {
    // ✅ CORRECT: Type inference directly from constructor typeof
    const buttonRef = useRef<typeof MyButton>(null);

    return (
        <host>
            <MyButton ref={buttonRef} />
        </host>
    );
});
```

---

## 4. Communication: Unidirectional vs Bidirectional

We distinguish between two clear, non-overlapping communication patterns:

### 1. `event<Detail>()` — Unidirectional Notification (Fire and Forget)
Use `event()` inside `props` to notify parent elements that an action occurred. The child dispatches the event and continues execution without expecting a return value.

* **Payload Mapping**: Calling `props.action(payload)` automatically wraps `payload` inside `event.detail` in standard CustomEvents. The parent reads it via `event.detail`.
* **🛑 Naming Rule**: NEVER prefix event props with "on" (e.g. use `search: event()`, NOT `onSearch`). Atomico's JSX mapping automatically prepends "on" for listeners (e.g. `<MyComp onsearch={...} />`).

```tsx
export const ActionButton = c(
    (props) => {
        // Calling props.action(payload) dispatches CustomEvent with detail = payload
        return <host><button onclick={() => props.action({ id: 42 })}>Fire</button></host>;
    },
    {
        props: {
            action: event<{ id: number }>({ bubbles: true, composed: true })
        }
    }
);
```

### 2. `callback<Fn>()` — Bidirectional Delegated Logic (Request-Response)
Use `callback()` strictly to delegate custom logic to the parent where the child **expects a response** (e.g., async validation or custom data filtering). The flow blocks and awaits the returned value.

* **🛑 Naming Rule**: NEVER prefix callback props with "on" (e.g. use `save: callback()`, NOT `onSave`). Atomico interprets any prop starting with "on" as a native event subscription.

```tsx
export const TextEditor = c(
    (props) => {
        const handleSave = async () => {
            if (props.save) {
                // Await returned value from parent logic
                const success = await props.save(props.content);
                if (success) console.log("Saved!");
            }
        };
        return <host><button onclick={handleSave}>Save</button></host>;
    },
    {
        props: {
            content: { type: String, value: () => "" },
            save: callback<(content: string) => Promise<boolean>>()
        }
    }
);
```

---

## 5. TypeScript: Strict Complex Property Typings (Arrays & Objects)

By default, declaring a property with `type: Array` and a factory like `value: () => []` resolves the TypeScript type to `never[]`. Similarly, `type: Object` with `value: () => ({})` resolves to an empty object `{}`.

To enforce exact typings in TSX, you **MUST** use explicit type assertions (`as Type`) inside the arrow-function factory of the property definition.

### ❌ Incorrect (TSX Typing Errors)
```tsx
props: {
    // ❌ BAD: Resolves to never[] inside TSX
    options: { type: Array, value: () => [] },
    
    // ❌ BAD: Resolves to {} instead of structured interface
    config: { type: Object, value: () => ({}) }
}
```

### ✅ Correct (Perfect TSX Type Inference)
```tsx
interface SelectOption {
    value: string;
    label: string;
}

interface AppConfig {
    theme: "light" | "dark";
    debug: boolean;
}

props: {
    // ✅ GOOD: TypeScript infers options as SelectOption[]
    options: { type: Array, value: () => [] as SelectOption[] },
    
    // ✅ GOOD: TypeScript infers config as AppConfig
    config: { type: Object, value: () => ({}) as AppConfig }
}
```

