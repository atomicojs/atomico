# State Management

State management in Atomico Web Components differs slightly from React due to the DOM standard of reflecting states to HTML attributes.

## `useProp` vs `useState`

Atomico favors standardizing the experience with native DOM nodes (like an `<input>` reflecting its `value`). 

- Use **`useProp`** for states that should be exposed to the outside world, bound to a property/attribute, or controlled by a parent component.
- Use **`useState`** strictly and only for ephemeral internal states that are not meant to be accessed or observed from the outside.

### ❌ Incorrect

```tsx
import { c, useState } from "atomico";

export const Toggle = c(
    () => {
        // ❌ BAD: Using useState for a state that should be public/reflected
        const [active, setActive] = useState(false);
    
        return (
            <host shadowDom>
                <button onclick={() => setActive(!active)}>
                    {active ? "ON" : "OFF"}
                </button>
            </host>
        );
    }
);
// ❌ BAD: State is completely hidden from the outside HTML
```

### ✅ Correct

```tsx
import { c, useProp } from "atomico";

export const Toggle = c(
    () => {
        // ✅ GOOD: Using useProp linked to the "active" property
        const [active, setActive] = useProp("active");
    
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
                reflect: true, // State changes will reflect as the [active] HTML attribute
                value: () => false
            }
        }
    }
);
```
