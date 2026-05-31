# Rule: JSX Patterns & Composition

Directives for composing Custom Elements in Atomico using typed constructor tags instead of raw string tags.

---

## Component Instantiation

Always instantiate child components in JSX using their **exported Constructor reference** (e.g., `<MyChild />`) instead of string tag names (e.g., `<my-child />`).

* **Why**: String tag names break TSX type inference, bypass IDE autocomplete for props/events, and prevent bundler dependency tree resolution.

```tsx
import { c } from "atomico";
import { MyChild } from "./child.js";

// ✅ CORRECT: Child referenced via its constructor directly (fully typed)
export const Parent = c(() => (
    <host shadowDom>
        <MyChild message="Hello" />
    </host>
));
```

```tsx
// ❌ INCORRECT: Avoid string tags inside JSX composition
export const Parent = c(() => (
    <host shadowDom>
        <my-child message="Hello" /> {/* ❌ No typings or autocomplete */}
    </host>
));
```
