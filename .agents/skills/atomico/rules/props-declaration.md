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
```
