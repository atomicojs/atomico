# Styling Application

Atomico uses the `css` tagged template literal to parse and cache styles efficiently using Constructable Stylesheets.

> [!IMPORTANT]
> **Requirement**: To use the `styles` configuration parameter in Atomico, your component MUST return `<host shadowDom>` as the root element. Styles are scoped entirely to the Shadow DOM.

## CSS Template Literal

**Always use the `css` tagged template literal** to define component styles inside the inline configuration object. Do not pass a raw string.

## Decoupling Logic from JSX (The 100% Pattern)

Atomico strongly encourages abstracting representation entirely into the CSS via Shadow DOM, rather than interpolating strings for classes in the JSX. 

Use CSS Custom Properties (variables) and `:host([attribute])` selectors to change internal styles based on the component's public state, instead of adding logic to the JSX.

### ❌ Suboptimal (80% Pattern - Avoid)

Coupling the logic into the JSX using dynamic classes.

```tsx
import { c, css, event } from "atomico";

export const AppButton = c(
  ({ variant, clickButton }) => {
    return (
      <host shadowDom>
        {/* ❌ Suboptimal: Logic mixed into JSX via class interpolation */}
        <button class={`btn ${variant}`} onclick={() => clickButton()}>
          <slot></slot>
        </button>
      </host>
    );
  },
  {
    props: {
      variant: { type: String, value: () => "primary", reflect: true },
      clickButton: event({ bubbles: true, composed: true }),
    },
    styles: css`
      :host { display: inline-block; }
      .btn { /* Base styles */ }
      .primary { background-color: #007bff; color: white; }
      .secondary { background-color: #6c757d; color: white; }
    `
  }
);
```

### ✅ Correct (100% Pattern)

Clean JSX. Logic is handled purely by CSS variables mapped to the `:host` state.

```tsx
import { c, css, event } from "atomico";

export const AppButton = c(
  ({ clickButton }) => {
    return (
      <host shadowDom>
        {/* ✅ GOOD: Clean JSX. Styling is decoupled. */}
        <button class="btn" onclick={() => clickButton()}>
          <slot></slot>
        </button>
      </host>
    );
  },
  {
    props: {
      variant: { type: String, value: () => "primary", reflect: true },
      clickButton: event({ bubbles: true, composed: true }),
    },
    styles: css`
      :host {
        display: inline-block;
        --button-color: black;
        --button-bgcolor: grey;
      }
      /* Variants update CSS variables */
      :host([variant="primary"]) {
        --button-bgcolor: #007bff;
        --button-color: white;
      }
      :host([variant="secondary"]) {
        --button-bgcolor: #6c757d;
        --button-color: white;
      }
      .btn {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 0.25rem;
        cursor: pointer;
        font-size: 1rem;
        transition: opacity 0.2s;
        /* The button simply consumes the variables */
        background-color: var(--button-bgcolor);
        color: var(--button-color);
      }
      .btn:hover {
        opacity: 0.8;
      }
    `
  }
);

customElements.define("app-button", AppButton);
```
