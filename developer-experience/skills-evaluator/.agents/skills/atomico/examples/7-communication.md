# Event Communication Guide

This guide covers dispatching CustomEvents inside components and details when to dispatch events vs when to rely on native event bubbling.

## 1. Dispatching CustomEvents (`useEvent`)

Use `useEvent` to define and dispatch a custom DOM event that can bubble up to parents.

```tsx
import { c, useEvent } from "atomico";

export const NotificationTrigger = c(() => {
    // 1. Declare the custom event with bubbles and composed true
    const dispatchAlert = useEvent<{ message: string }>("alert-sent", {
        bubbles: true,
        composed: true
    });

    return (
        <host shadowDom>
            {/* ✅ GOOD: Inline handler utilizing dispatch event */}
            <button onclick={() => dispatchAlert({ message: "Task completed successfully!" })}>
                Send Alert
            </button>
        </host>
    );
});
```

---

## 2. When to Dispatch vs When to Bubbles (Best Practices)

To keep your code clean and prevent event loops, follow these guidelines:

### Case A: Do NOT Re-dispatch Native Bubbling Events
Standard input and form events (like `input`, `change`, `click`, `submit`) bubble naturally through the Shadow DOM. Re-dispatching these events creates double propagation bugs.

*   **❌ Antipattern (Re-dispatching `input` events):**
    ```tsx
    export const BadInput = c(() => {
        const [value, setValue] = useProp("value");
        const dispatchInput = useEvent("input"); // ❌ Avoid: 'input' already bubbles

        const handleInput = (e: any) => {
            setValue(e.currentTarget.value);
            dispatchInput(e.currentTarget.value); // ❌ Duplicate event dispatch!
        };

        return <host shadowDom><input value={value} oninput={handleInput} /></host>;
    });
    ```

*   **✅ Pattern (Native Bubbling):**
    ```tsx
    export const GoodInput = c(() => {
        const [value, setValue] = useProp("value");

        return (
            <host shadowDom>
                {/* ✅ Let the 'input' event propagate naturally. Just update local state */}
                <input 
                    value={value} 
                    oninput={(e) => setValue(e.currentTarget.value)} 
                />
            </host>
        );
    });
    ```

### Case B: Dispatch for Abstract Domain Events
Only dispatch custom events (`useEvent`) to represent custom component lifecycle events (such as `task-completed`, `dialog-opened`, `theme-changed`) that do not map directly to simple DOM element input changes.
```tsx
export const DialogBox = c(() => {
    const dispatchClose = useEvent("dialog-close", { bubbles: true });

    return (
        <host shadowDom>
            <div class="overlay">
                <button onclick={() => dispatchClose()}>Close Dialog</button>
            </div>
        </host>
    );
});
```
