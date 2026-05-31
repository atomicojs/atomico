# Rule: Component Creation & Setup

Pragmatic guidelines for initializing standard Custom Elements and form-associated components using Atomico.

---

## 1. Signature & Exports

Always wrap components using the inline `c(render, config)` signature, and export the generated instance directly.

* **Composition Rule**: Always instantiate child components in JSX using their **Constructor class name** (e.g. `<MyButton />`) rather than string tag names (e.g. `<my-button />`) to inherit TypeScript prop typings.

```tsx
import { c } from "atomico";

// ✅ CORRECT: Inline c() setup and direct instance export
export const MyButton = c(
    ({ variant }) => <host>Click me</host>,
    {
        props: { variant: String }
    }
);

customElements.define("my-button", MyButton);
```

```tsx
// ❌ INCORRECT: Avoid defining props outside c() or exporting raw functions
function Button() { return <host>Click me</host>; }
Button.props = { variant: String }; // ❌ Too verbose / Loose typing
```

---

## 2. Root Element: `<host>`

Every component render function **MUST return a single `<host>` root element**.

* **Why**: The `<host>` tag represents the Custom Element itself. Returning a `<div>` or a React-style `<Fragment>` (`<>`) at the root will cause VDOM rendering errors.

```tsx
// ✅ CORRECT
export const Card = c(() => (
    <host>
        <div class="card-body">Content</div>
    </host>
));
```

```tsx
// ❌ INCORRECT
export const Card = c(() => (
    <div class="card-body">Content</div> // ❌ Fatal: Missing <host> root
));
```

---

## 3. Form-Associated Components

To make a component participate natively in HTML `<form>` submits, validations, and resets:

1. **Activate internal engine**: Set `form: true` in the configuration object of `c()`.
2. **Handle Focus Delegation**: Always set `delegatesFocus: true` inside `shadowDom` configuration on the `<host>` root.
3. **Declare standard props**: Define `name` and `value` in the `props` config.

```tsx
import { c } from "atomico";

export const MyFormInput = c(
    ({ name }) => {
        return (
            <host shadowDom={{ delegatesFocus: true }}>
                <input name={name} />
            </host>
        );
    },
    {
        form: true, // 👈 Required for ElementInternals
        props: {
            name: String,
            value: String
        }
    }
);

customElements.define("my-form-input", MyFormInput);
```
