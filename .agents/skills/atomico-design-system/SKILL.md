---
name: atomico-design-system
description: >
  Specialized skill for creating design systems, UI kits, form-associated elements, and themes in Atomico.
  Triggers when the user asks for "design system", "ui kit", "form-associated", "components index", "theme", or "design tokens".
license: MIT
compatibility: "Atomico >=2.0, TypeScript >=5.0"
metadata:
  category: style-form
  priority: high
---

# Atomico Design System & Form Association Guide

Specialized reference for building modular, themeable UI components and form-friendly Custom Elements in Atomico.

## 1. Agnostic Registration & Centralized Index

Component declaration files (e.g. `my-button.tsx`) MUST only declare and export the component instance, keeping it agnostic of global registry naming conflicts.

* **Agnostic Exports**: Only export the generated `c(render, config)` instance. Do NOT call `customElements.define` inside the component file.
* **Centralized Index**: Register all custom elements inside a central index file (`components/index.ts`) that imports the instances and defines them globally.

### Component File (`components/ui-button.tsx`)
```tsx
import { c, css } from "atomico";

// Export ONLY the instance
export const UiButton = c(
    () => <host shadowDom><button><slot /></button></host>,
    {
        props: { variant: { type: String, value: () => "primary", reflect: true } }
    }
);
```

### Central Index File (`components/index.ts`)
```typescript
import { UiButton } from "./ui-button.js";

// Centralized DOM custom element registration
customElements.define("ui-button", UiButton);
```

---

## 2. Form-Friendly Custom Buttons (Form-Associated Buttons)

A standard `<button>` inside a Custom Element's Shadow DOM does **NOT** trigger a parent `<form>`'s submit event natively.

* **Form Association**: To make a custom button submit a parent form natively, you MUST set `form: true` in the component configuration object.
* **RequestSubmit**: Use the `useInternals()` hook to access the native `ElementInternals` object, and call `internals.form?.requestSubmit()` in the button click handler.
* **Event Propagation**: Do NOT use `e.stopPropagation()` in custom button click handlers unless you are intentionally blocking browser submit and executing `requestSubmit()`.

```tsx
import { c, useInternals } from "atomico";

export const UiButton = c(
    () => {
        const internals = useInternals();

        const handleClick = (e: Event) => {
            // Natively submit the associated parent form
            if (internals.form) {
                internals.form.requestSubmit();
            }
        };

        return (
            <host shadowDom onclick={handleClick}>
                <button class="btn">
                    <slot />
                </button>
            </host>
        );
    },
    {
        form: true, // 👈 Required for ElementInternals
        props: {
            variant: { type: String, value: () => "primary", reflect: true }
        }
    }
);
```

---

## 3. Core Design System & CSS Variables

* **Styling Reflectance**: Use `reflect: true` exclusively when the objective is to control visual states or styling variants via CSS selectors (e.g. `:host([disabled])` or `:host([show])`).
* **Design Tokens**: Style components using CSS Custom Properties (CSS variables) to allow clean external overrides and themes.

```tsx
export const AlertBox = c(
    () => <host shadowDom>Alert</host>,
    {
        props: {
            show: { type: Boolean, value: () => false, reflect: true }
        },
        styles: css`
            :host {
                display: none;
                background-color: var(--alert-bg, #f3f4f6);
            }
            :host([show]) {
                display: block;
            }
        `
    }
);
```
