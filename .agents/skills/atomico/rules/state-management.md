# Rule: State Management (useProp vs useState)

Guidelines for managing reactive state in Atomico Web Components.

---

## Directives

1. **`useProp("name")` (Public State)**:
   * **When to use**: For any state that must be accessible externally as a property, synchronized with an HTML attribute (`reflect: true`), or controlled by a parent.
   * **Rule**: The prop name passed to `useProp` MUST be declared in the component's `props` configuration.
2. **`useState(init)` (Private State)**:
   * **When to use**: Strictly for transient, internal UI state that does not need to be observed, modified, or accessed from the outside.

```tsx
import { c, useProp } from "atomico";

// ✅ CORRECT: Public state handled via useProp & reflected to attribute
export const Toggle = c(
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
                reflect: true,
                value: () => false
            }
        }
    }
);
```

```tsx
// ❌ INCORRECT: Avoid useState for public attributes/properties
export const Toggle = c(() => {
    const [active, setActive] = useState(false); // ❌ Private state hidden from parent/HTML attributes
    return <host>...</host>;
});
```
