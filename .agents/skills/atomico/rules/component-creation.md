# Component Creation

Properly initializing an Atomico component is critical for types, instances, and Virtual DOM rendering.

## `c(render, config)` Function and Export

**Always wrap your component in the `c()` function using the inline `c(render, config)` signature, and export the generated instance.**

When using JSX, you must use the exported instance (e.g. `<Button />`) rather than the string tag name (`<my-button />`) to preserve TypeScript types and ensure Atomico knows the exact constructor being rendered.

### ❌ Incorrect

```tsx
import { c } from "atomico";

function Button() {
    return <host>Click me</host>;
}

// ❌ BAD: Not exporting the instance, and defining properties outside c()
Button.props = { variant: String };
customElements.define("my-button", c(Button));
```

### ✅ Correct

```tsx
import { c } from "atomico";

// ✅ GOOD: Inline config and exporting the instance
export const MyButton = c(
    ({ variant }) => {
        return <host>Click me</host>;
    },
    {
        props: { variant: String }
    }
);

// Register the custom element
customElements.define("my-button", MyButton);
```

## The `<host>` Root Element

**Every Atomico component must return `<host>` as its root element in the JSX render function.**

The `<host>` tag represents the Custom Element itself. Returning a `<div>` or a `<Fragment>` as the root will cause rendering errors.

### ❌ Incorrect

```tsx
import { c } from "atomico";

export const ProfileComponent = c(() => {
    // ❌ BAD: Returning a div as the root element
    return (
        <div class="profile">
            <h1>User</h1>
        </div>
    );
});
```

### ✅ Correct

```tsx
import { c } from "atomico";

export const ProfileComponent = c(() => {
    // ✅ GOOD: Returning <host> as the root element
    return (
        <host>
            <div class="profile">
                <h1>User</h1>
            </div>
        </host>
    );
});
```
