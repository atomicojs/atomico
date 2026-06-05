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
                reflect: true // ✅ GOOD: Boolean naturally defaults to false when the attribute is absent
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

* **useRef Typing**: Use `useRef<typeof Component>()` directly without passing `null` as a parameter. There is no need for `InstanceType<typeof Component>` or using `any`. Atomico does not clear references on unmount, so `null` initialization is redundant.

```tsx
import { c, useRef } from "atomico";
import { MyButton } from "./my-button.js";

export const MyForm = c(() => {
    // ✅ CORRECT: Type inference directly from constructor typeof, parameterless
    const buttonRef = useRef<typeof MyButton>();

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

* **🛑 No Void Callbacks Rule**: A callback **must never** return `void` or `undefined` (e.g., `save: callback<(data: FormState) => void>()` is incorrect). If a callback does not return a value to the child component or serves as a fire-and-forget notification, it is unobserved and **MUST** be declared as an `event()` instead.
* **🛑 Naming Rule**: NEVER prefix callback props with "on" (e.g. use `save: callback()`, NOT `onSave`). Atomico interprets any prop starting with "on" as a native event subscription.

```tsx
export const TextEditor = c(
    ({ content, save }) => {
        return (
            <host shadowDom>
                {/* ✅ GOOD: Inline handler, utilizing destructured callback */}
                <button
                    onclick={async () => {
                        if (save) {
                            // Await returned value from parent logic
                            const success = await save(content);
                            if (success) console.log("Saved!");
                        }
                    }}
                >
                    Save
                </button>
            </host>
        );
    },
    {
        props: {
            content: { type: String, value: () => "" },
            save: callback<(content: string) => Promise<boolean>>()
        }
    }
);
```

### 3. Shadow DOM Boundary & Non-Composed Native Events (e.g. `change`, `submit`)
Standard browser events like `change` (triggered by `<select>`, `<input type="checkbox">`, `<input type="radio">`) and `submit` are configured natively as `bubbles: true` but `composed: false`. This means they **cannot cross the Shadow DOM boundary** to reach parent components.

* **🛑 Shadow DOM Event Block**: If a custom component wraps a native input/select that triggers a `change` event, and the custom component is rendered inside Shadow DOM, any parent listening to it (e.g., `<ui-select onchange={...} />`) will **never** receive the native event because it is blocked at the Shadow DOM boundary.
* **Rule**: You **MUST** define a custom event (e.g., `change: event()`) with `{ bubbles: true, composed: true }` in the custom component's `props` configuration. The component must catch the native `onchange` internally and explicitly dispatch the custom event:

```tsx
export const UiSelect = c(
    ({ change, options }) => {
        return (
            <host shadowDom>
                {/* Catch native event and dispatch custom event */}
                <select onchange={(e) => change(e.currentTarget.value)}>
                    {options.map(o => <option value={o.value}>{o.label}</option>)}
                </select>
            </host>
        );
    },
    {
        props: {
            options: { type: Array, value: () => [] as Option[] },
            change: event<string>({ bubbles: true, composed: true })
        }
    }
);
```

---

## 5. TypeScript: Strict Complex Property Typings (Arrays & Objects)

By default, declaring a property with `type: Array` and a factory like `value: () => []` resolves the TypeScript type to `never[]`. Similarly, `type: Object` with `value: () => ({})` resolves to an empty object `{}`.

To enforce exact typings in TSX, you **MUST** declare the return type on the arrow-function factory explicitly (e.g. `value: (): Type => ...`). This guarantees type safety at the source. Use type assertions (`as Type`) only as a fallback.

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
    // ✅ RECOMMENDED: TypeScript infers options as SelectOption[] via return type annotation
    options: { type: Array, value: (): SelectOption[] => [] },
    
    // ✅ RECOMMENDED: TypeScript infers config as AppConfig via return type annotation
    config: { type: Object, value: (): AppConfig => ({ theme: "light", debug: false }) }
}
```

---

## 6. JSX Inline Handlers & Native Event Propagation

To achieve highly maintainable code and prevent unnecessary type assertions or event loop bugs, follow these two strict guidelines:

### 1. Inline JSX Event Handlers (Automatic Type Inference)
Unless an event handler function is shared across multiple different tags, **NEVER extract it to a standalone helper function** (like `const handleInput = (e: any) => ...`).
*   **Why**: When written **inline directly within the JSX attribute** (`oninput={(e) => setValue(e.currentTarget.value)}`), Atomico's JSX engine automatically infers the precise event type and ensures that `e.currentTarget` points to the native DOM element instance (e.g., `HTMLInputElement`) with **full autocompletado and zero manual castings or `any` declarations**.
*   **LLM Standalone Handler Anti-Pattern**: Standalone LLM generation patterns frequently attempt to isolate single-use callbacks into separate local constants (e.g. `const handleInput = (e: any) => ...`) and then assign them to JSX attributes (e.g., `oninput={handleInput}`). This is a **strict code quality violation**. The Validator must audit and reject this pattern because it bypasses Atomico's automatic type inference and forces the developer to write manual castings or type overrides. All single-use event handlers must reside inline inside the JSX template.

### 2. Do NOT Re-dispatch Nativing Bubbling Events
Standard browser events (like `input`, `change`, `click`, `submit`) already bubble and propagate naturally through the DOM tree.
*   **Antipatrón**: Creating custom events (e.g., `useEvent("input")`) and dispatching them upon capturing native events (like mapping `oninput` to a CustomEvent).
*   **Why**: Doing so causes a double propagation bug (listeners receive the event twice), pollutes the event targets, and introduces latency or loops in parent component state updates. Just let the native event bubble up!

### ❌ Incorrect: Extracted handlers with `any` and redundant custom events
```tsx
export const MyInput = c(() => {
    const [value, setValue] = useProp("value");
    // ❌ BAD: Creating a redundant custom event for input
    const dispatchInput = useEvent("input");

    // ❌ BAD: Extracted handler forcing use of any and disabling auto-inference
    const handleInput = (e: any) => {
        const val = e.currentTarget.value;
        setValue(val);
        dispatchInput(val); // ❌ BAD: Redundant dispatching
    };

    return <host><input value={value} oninput={handleInput} /></host>;
});
```

### ✅ Correct: Inline handlers with zero type annotations & native propagation
```tsx
export const MyInput = c(() => {
    const [value, setValue] = useProp("value");

    return (
        <host shadowDom>
            {/* ✅ GOOD: Inline handler, zero manual types needed, input bubbles naturally */}
            <input
                value={value}
                oninput={(e) => {
                    const val = e.currentTarget.value; // ✅ Auto-inferred HTMLInputElement
                    setValue(val);
                }}
            />
        </host>
    );
});
```


