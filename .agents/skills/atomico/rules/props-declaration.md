# Props Declaration

Props in Atomico allow your component to receive data and automatically sync state with HTML attributes.

## Factory Defaults for Props

When defining default values in the `props` configuration object, **you must use a factory callback function**, not a static raw value. This prevents memory leaks and unintended sharing of object references across component instances.

### ❌ Incorrect

```tsx
import { c } from "atomico";

export const Profile = c(
    ({ name, role }) => (
        <host>
            {name} - {role}
        </host>
    ),
    {
        props: {
            // ❌ BAD: Raw static values used as defaults
            name: { type: String, value: "User Name" },
            tags: { type: Array, value: [] }
        }
    }
);
```

### ✅ Correct

```tsx
import { c } from "atomico";

export const Profile = c(
    ({ name, role }) => (
        <host>
            {name} - {role}
        </host>
    ),
    {
        props: {
            // ✅ GOOD: Use a callback function returning the default value
            name: { type: String, value: () => "User Name" },
            tags: { type: Array, value: () => [] }
        }
    }
);
```

## Reflected Props and Variants

To make a property observable from the outside as an HTML attribute (which is crucial for styling variants or querying), you must set `reflect: true`.

Types can be `String`, `Number`, `Boolean`, `Array`, `Object`.

```tsx
export const Alert = c(({ variant }) => <host>Alert: {variant}</host>, {
    props: {
        // A common pattern for variants. Reflects to <my-alert variant="error">
        variant: {
            type: String,
            reflect: true,
            value: () => "primary"
        },
        // Booleans are commonly reflected for flags like "disabled" or "active"
        disabled: {
            type: Boolean,
            reflect: true
        }
    }
});
```

## TypeScript: Enforcing Specific Values

Atomico allows capturing the type from the constructor directly in the `props` declaration. This is highly useful for variants or enumerations to ensure that the IDE provides autocompletion and type checking when consuming the component in JSX.

You can use the syntax `Type<"value1" | "value2">` (like `String<"yes"|"no">`) using type assertions or casting depending on your TypeScript setup, but Atomico natively understands it for inference.

```tsx
import { c } from "atomico";

export const Dialog = c(({ status }) => <host>{status}</host>, {
    props: {
        // ✅ GOOD: Capturing specific string types for the prop
        status: {
            type: String,
            value: (): "success" | "warning" | "error" => "success",
            reflect: true
        },

        // Or if using Atomico's utility types (like String<...>):
        message: String<"Si" | "No">
    }
});

## Communication and Events: `event()` and `callback()`

Instead of managing manual DOM CustomEvents or raw callbacks, Atomico provides specific helpers inside the component `props` configuration to handle typings and autocomplete, representing two distinct design patterns.

---

### 1. `event<Detail>(config?)` — Fire and Forget (Unidirectional Notification)

Use `event()` to **notify** parent components that an action occurred. It is strictly **unidirectional and upward**. The child dispatches the event and continues execution without expecting any return value.

* **Definition**:
```tsx
import { c, event } from "atomico";

export const ActionButton = c(
    (props) => {
        return (
            <host>
                {/* Calling the event-prop as a function dispatches the event */}
                <button onclick={() => props.action({ id: 42 })}>Fire Event</button>
            </host>
        );
    },
    {
        props: {
            // Generates a CustomEvent of type "action"
            action: event<{ id: number }>({
                bubbles: true,
                composed: true // Allows crossing Shadow DOM boundaries
            })
        }
    }
);
```

* **Consumption in JSX**: Parents listen to the event using the `on` prefix.
```tsx
// JSX binds to the event with "on" + the prop name
<ActionButton onaction={({ detail }) => console.log(detail.id)} />
```

* **🛑 CRITICAL NAMING RULE**: NEVER prefix an `event()` prop with "on" (e.g., `onSearch`). Atomico's JSX mapping automatically prepends "on" for listeners. If you define a prop as `onSearch`, JSX will expect `<Component ononSearch={...} />`. Always name the base action (e.g., `search: event()`).

---

### 2. `callback<Fn>()` — Request-Response (Bidirectional Delegated Logic)

Use `callback()` strictly to **delegate logic** to a parent component where the child **expects a response** (e.g. data filtering, async validations, or custom processors). The execution flow halts and awaits the returned value from the parent.

* **Definition**:
```tsx
import { c, callback } from "atomico";

export const TextEditor = c(
    (props) => {
        const handleSave = async () => {
            if (props.save) {
                // Execute parent logic and await its value
                const success = await props.save(props.content);
                if (success) console.log("Saved successfully!");
            }
        };
        return <host shadowDom><button onclick={handleSave}>Save</button></host>;
    },
    {
        props: {
            content: String,
            save: callback<(content: string) => Promise<boolean>>()
        }
    }
);
```

* **Consumption in JSX**:
```tsx
<TextEditor 
    content="Hello" 
    save={async (text) => {
        await saveToServer(text);
        return true;
    }} 
/>
```

* **🛑 CRITICAL CALLBACK NAMING RULE**: NEVER prefix a `callback()` prop with "on" (e.g., `onSave`). Atomico's JSX parser interprets any prop starting with "on" (like `onSave`) as a native DOM event listener subscription (listening to a `Save` event). Always use clean, action-oriented names like `save: callback()`, `filter: callback()`, or `customFilter: callback()`.
```
