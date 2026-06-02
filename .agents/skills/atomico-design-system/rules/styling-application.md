# Rule: Styling Application & The 100% Pattern

Directives for applying scoped shadow styles efficiently using Constructable Stylesheets and host-level attributes.

---

## Directives

1. **Shadow DOM Scoping**: To use the `styles` parameter inside `c()`, the component **MUST** return `<host shadowDom>` as the root element. Styles are scoped entirely to the Shadow DOM.
2. **Tagged Template Literal**: Always define component styles using the `css` tagged template literal inside the configuration object. Never pass a raw string.
3. **The 100% Pattern (Decoupling Presentation Logic from JSX)**:
   * **Rule**: Do NOT interpolate class names or inline styles dynamically inside the JSX based on component props/states.
   * **Solution**: Keep JSX clean. Use CSS Custom Properties (variables) on `:host` and map reflected states using `:host([attribute])` selectors to update presentation.

```tsx
import { c, css } from "atomico";

// ✅ CORRECT: 100% Pattern (Clean JSX, styles decoupled using host attributes and CSS variables)
export const AppButton = c(
    () => (
        <host shadowDom>
            <button class="btn">
                <slot></slot>
            </button>
        </host>
    ),
    {
        props: {
            variant: { type: String, value: () => "primary", reflect: true }
        },
        styles: css`
            :host {
                display: inline-block;
                --button-color: black;
                --button-bgcolor: grey;
            }
            /* Map host reflected states directly to CSS custom properties */
            :host([variant="primary"]) {
                --button-bgcolor: #007bff;
                --button-color: white;
            }
            :host([variant="secondary"]) {
                --button-bgcolor: #6c757d;
                --button-color: white;
            }
            .btn {
                background-color: var(--button-bgcolor);
                color: var(--button-color);
                border: none;
                padding: 0.5rem 1rem;
                cursor: pointer;
            }
        `
    }
);
```

```tsx
// ❌ INCORRECT: Avoid dynamic class string interpolation in JSX
export const AppButton = c(({ variant }) => (
    <host shadowDom>
        <button class={`btn ${variant}`}> {/* ❌ Logic coupled in JSX */}
            <slot></slot>
        </button>
    </host>
), {
    props: { variant: String },
    styles: css`
        .primary { background-color: #007bff; }
        .secondary { background-color: #6c757d; }
    `
});
```
