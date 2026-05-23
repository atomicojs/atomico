# JSX Patterns

Atomico's JSX is unique because it directly supports Custom Element constructor instances, bypassing standard string tag names. This provides strict typing and automatic property inheritance.

## Instantiating Components

When composing components, **always use the constructor reference** (e.g., `<MyComponent>`) rather than the string tag name (`<my-component>`).

### ❌ Incorrect

Using string tag names breaks type inference, loses IDE autocomplete for props/events, and prevents the bundler from knowing about the dependency.

```tsx
import { c } from "atomico";
import { MyChild } from "./child.js";

// Ensure custom element is defined somewhere globally (brittle)
// customElements.define("my-child", MyChild);

export const Parent = c(() => {
    return (
        <host shadowDom>
            {/* ❌ BAD: No type inference, no prop validation */}
            <my-child message="Hello"></my-child>
        </host>
    );
});
```

### ✅ Correct

Using the constructor directly. The types defined in `MyChild`'s props config are perfectly inferred in the JSX.

```tsx
import { c } from "atomico";
import { MyChild } from "./child.js";

export const Parent = c(() => {
    return (
        <host shadowDom>
            {/* ✅ GOOD: Types inherited, IDE autocomplete works perfectly */}
            <MyChild message="Hello" />
        </host>
    );
});
```
