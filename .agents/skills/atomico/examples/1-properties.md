# Property Definition Guide

This guide demonstrates how to declare properties in Atomico, reflect attributes for CSS styling, and configure events and callbacks.

## 1. Property Typings & Syntaxes

Atomico supports two property declaration formats:

1. **Shorthand Type Definition**: Used for simple read-only parameters without default values or reflection.
2. **Configuration Object with Arrow Factory**: Used for properties requiring initial default states or custom behaviors (like attribute reflection).

```tsx
import { c } from "atomico";

interface UserProfile {
    id: string;
    role: "Admin" | "Member";
}

export const PropertyShowcase = c(
    ({ title, count, tags, profile }) => {
        return (
            <host shadowDom>
                <h1>{title}</h1>
                <p>Count: {count}</p>
                <p>Profile: {profile?.role}</p>
            </host>
        );
    },
    {
        props: {
            // ✅ Shorthand definition (read-only, no default state)
            title: String,

            // ✅ Configuration object with Arrow Function Factory
            count: { type: Number, value: () => 0 },

            // ✅ Typed array using explicit return type annotation on the factory
            tags: { type: Array, value: (): string[] => [] },

            // ✅ Typed object using explicit return type annotation on the factory
            profile: {
                type: Object,
                value: (): UserProfile => ({ id: "0", role: "Member" })
            }
        }
    }
);
```

---

## 2. Reflected Properties for CSS Styling

Reflecting properties (`reflect: true`) maps the property value directly to an HTML attribute on the host element. This allows you to apply styling rules using CSS attribute selectors.

> [!IMPORTANT]
> Reflecting attributes is strictly limited to primitive types (`String`, `Number`, `Boolean`). Do NOT reflect `Object` or `Array` types.

```tsx
import { c, css } from "atomico";

export const StyledCard = c(
    () => (
        <host shadowDom>
            <slot />
        </host>
    ),
    {
        props: {
            theme: { type: String, value: () => "light", reflect: true },
            active: { type: Boolean, reflect: true }
        },
        styles: css`
            :host {
                display: block;
                padding: 1rem;
                border-radius: 8px;
                transition: background 0.3s ease;
            }

            /* ✅ Style target via attribute selector mapped from active property */
            :host([active]) {
                border: 2px solid var(--primary, #6366f1);
            }

            /* ✅ Variant styling based on theme attribute */
            :host([theme="dark"]) {
                background: #1e293b;
                color: #f8fafc;
            }
            :host([theme="light"]) {
                background: #f1f5f9;
                color: #0f172a;
            }
        `
    }
);
```

---

## 3. Custom Events & Bidirectional Callbacks

We distinguish between two communication paradigms:

1. **`event<Detail>()`**: Unidirectional fire-and-forget notification to the parent. Custom events bubbled through the DOM.
2. **`callback<Fn>()`**: Bidirectional delegated logic. The child requests a response or blocks execution awaiting the parent's return value.

> [!WARNING]
> Never prefix event or callback properties with "on" (e.g. use `select`, not `onSelect`). Atomico JSX automatically prefixes event listeners with "on" (e.g., `<my-comp onselect={...} />`).

```tsx
import { c, event, callback } from "atomico";

export const InteractiveButton = c(
    ({ triggerEvent, validateAction }) => {
        return (
            <host shadowDom>
                {/* ✅ GOOD: Inline handler utilizing destructured event and callback */}
                <button
                    onclick={async () => {
                        // 1. Unidirectional CustomEvent dispatching
                        triggerEvent({ timestamp: Date.now() });

                        // 2. Bidirectional callback await response
                        if (validateAction) {
                            const isAllowed = await validateAction("UserAction");
                            if (isAllowed) {
                                console.log("Action validated successfully by parent!");
                            }
                        }
                    }}
                >
                    Execute
                </button>
            </host>
        );
    },
    {
        props: {
            // ✅ CustomEvent dispatching (bubbly & composed)
            triggerEvent: event<{ timestamp: number }>({
                bubbles: true,
                composed: true
            }),

            // ✅ Awaitable callback interface
            validateAction:
                callback<(action: string) => Promise<boolean> | boolean>()
        }
    }
);
```
