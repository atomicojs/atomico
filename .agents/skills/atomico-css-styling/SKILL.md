---
name: atomico-css-styling
description: >
  Use the css tagged template literal and adoptedStyleSheets for styling Atomico
  components. Triggers when the user needs to style web components, use CSS
  custom properties, create themeable components, or understand how Atomico
  manages stylesheets. Do NOT trigger for external CSS frameworks unless
  combined with Atomico's css utility.
license: MIT
compatibility: "Atomico >=1.79, browsers with adoptedStyleSheets support"
metadata:
  category: core
  priority: medium
---

# CSS & Styling

## `css` Tagged Template

Creates and caches `CSSStyleSheet` objects using the browser's
`adoptedStyleSheets` API for optimal performance.

### Basic Usage

```tsx
import { c, css } from "atomico";

const MyComponent = c(
    () => (
        <host shadowDom>
            <h1>Styled component</h1>
        </host>
    ),
    {
        styles: css`
            :host {
                display: block;
                padding: 1rem;
                font-family: system-ui;
            }
            h1 {
                color: #333;
                margin: 0;
            }
        `
    }
);
```

### How It Works

1. `css` receives a template literal and produces a `CSSStyleSheet`
2. Sheets are cached by CSS text — identical styles share one instance
3. Sheets are applied to the component's `shadowRoot.adoptedStyleSheets`
4. Styles are only applied after the first non-suspended render

### Interpolation

```tsx
const primaryColor = "#3b82f6";

const styles = css`
    :host {
        --primary: ${primaryColor};
        color: var(--primary);
    }
`;
```

### Multiple Style Sheets

The `styles` option can be an array for composing shared styles:

```tsx
const baseStyles = css`
    :host { display: block; box-sizing: border-box; }
`;

const themeStyles = css`
    :host { --bg: #fff; --fg: #111; }
`;

const MyComponent = c(
    () => <host shadowDom>content</host>,
    {
        styles: [baseStyles, themeStyles, css`
            h1 { color: var(--fg); }
        `]
    }
);
```

---

## CSS Custom Properties (Theming)

Custom properties pierce shadow DOM boundaries, making them the primary
mechanism for theming Atomico components.

### Define in Component

```tsx
const MyCard = c(
    () => <host shadowDom><slot /></host>,
    {
        styles: css`
            :host {
                --card-bg: #f0f0f9;
                --card-border: #dcdce1;
                --card-radius: 0.5rem;
            }
            :host([active]) {
                --card-bg: #a3ebd4;
                --card-border: #6ee2c9;
            }
            :host {
                background: var(--card-bg);
                border: 1px solid var(--card-border);
                border-radius: var(--card-radius);
                padding: 1rem;
            }
        `
    }
);
```

### Override from Outside

```css
/* Page CSS can override custom properties */
my-card {
    --card-bg: #1a1a2e;
    --card-border: #16213e;
}
```

---

## Common Patterns

### `:host` Selector

```css
/* Default state */
:host { display: block; }

/* Attribute-based state */
:host([active]) { background: green; }
:host([disabled]) { opacity: 0.5; pointer-events: none; }

/* Context-based state */
:host(:hover) { transform: scale(1.02); }
:host(:focus-within) { outline: 2px solid blue; }
```

### `::slotted` Pseudo-Element

```css
/* Style slotted children (one level deep) */
::slotted(*) { margin: 0.5rem; }
::slotted(h1) { font-size: 2rem; }
::slotted([slot="header"]) { font-weight: bold; }
```

### `:host-context` (Limited Support)

```css
/* Style based on ancestor */
:host-context(.dark-theme) {
    --bg: #1a1a2e;
}
```

---

## ⚠️ Important Notes

1. **Shadow DOM required**: `css` and `styles` only work with `shadowDom`
   enabled. Without shadow DOM, use regular page CSS.

2. **CSSStyleSheet caching**: Identical CSS text produces the same sheet
   instance. This is memory-efficient for shared base styles.

3. **No `<style>` tags**: Atomico uses `adoptedStyleSheets` exclusively.
   Avoid injecting `<style>` elements manually.

4. **Specificity**: Shadow DOM CSS is scoped. Styles don't leak out, and
   external styles don't leak in (except custom properties).
