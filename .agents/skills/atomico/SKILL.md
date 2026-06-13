---
name: atomico
description: >
  Core entry-point router, orchestrator, and reference manual for all Atomico.js tasks.
  Contains coding standards, API cheat sheets, architectural guidelines, and validation rules.
license: MIT
compatibility: "Atomico >=2.0, TypeScript >=5.0"
metadata:
  category: core
  priority: highest
---

# Atomico.js — Consolidated Development & Validation Guide

Unified reference for building, auditing, and validating Atomico.js web components.

---

## 1. Architectural Philosophy

1. **Modular by Default**: Avoid monolithic files. Split complex views into a `components/` folder.
2. **Reuse First**: Audit existing workspace components before generating new ones.
3. **Prop-Driven Communication**: Pass data down via props, dispatch events up.
4. **Separate Registration**: NEVER call `customElements.define` inside the component file. Centralize all registrations in an index file.

```tsx
// components/index.ts ← the ONLY place where elements are registered
import { MyCounter } from "./my-counter.js";
customElements.define("my-counter", MyCounter);
```

---

## 2. Component Template

Every Atomico component is defined with `c()` and **must** return a `<host>` root element.

```tsx
import { c, useProp, css } from "atomico";

export const MyCounter = c(({ label }) => {
    const [value, setValue] = useProp<number>("value");
    return (
        <host shadowDom>
            <button onclick={() => setValue(value + 1)}>
                {label}: {value}
            </button>
        </host>
    );
}, {
    props: {
        label: { type: String, value: () => "Increment" },
        size:  { type: String, reflect: true, value: (): "normal" | "small" => "normal" },
        value: { type: Number, value: () => 0 }
    },
    styles: css`
        :host { --font-size: 1em; }
        :host([size="small"]) { --font-size: .5em; }
    `
});
```

---

## 3. Props

### Declaration syntax

Use the simplest form that satisfies the requirement:

```tsx
props: {
    // ✅ Shorthand: no default, no reflect
    label: String,

    // ✅ Config object: only when a default value is needed
    count: { type: Number, value: () => 0 },

    // ✅ Reflect: only to control CSS via attribute selectors
    variant: { type: String, reflect: true, value: (): "primary" | "danger" => "primary" }
}
```

**❌ Forbidden:**
```tsx
props: {
    name: { type: String },           // ❌ Verbose config with no default or reflect — use shorthand
    count: { type: Number, value: 0 } // ❌ Static value — must be a factory callback
}
// ❌ Manual type on destructured render argument:
// ({ label }: { label: string }) => ...  ← Atomico infers types automatically from props block
```

### Arrays & Objects — strict return-type annotation

Without an explicit return type, TypeScript resolves `Array` to `never[]` and `Object` to `{}`.
Annotate the factory return type to guarantee correct inference in TSX:

```tsx
interface Option { value: string; label: string; }
interface Config { theme: "light" | "dark"; debug: boolean; }

props: {
    // ✅ Return type annotation on the factory — inferred as Option[] in TSX
    options: { type: Array,  value: (): Option[] => [] },
    config:  { type: Object, value: (): Config  => ({ theme: "light", debug: false }) }
}
```

### Reflect rules

`reflect: true` is only for **visual / CSS states**. Allowed types: `String`, `Number`, `Boolean`.

```tsx
props: {
    disabled: { type: Boolean, reflect: true },
    variant:  { type: String, reflect: true, value: () => "primary" }
},
styles: css`
    :host([disabled]) { opacity: 0.5; pointer-events: none; }
    :host([variant="danger"]) { background: red; }
`
```

**❌ Never** use `reflect: true` on `Array` or `Object` — it triggers expensive DOM serialization.

---

## 4. State Management

### Decision tree

```
Does the state need to be read from outside (parent / CSS)?
├─ YES → declare it in props
│         └─ Does the child also write to it? → useProp<T>()
│         └─ Read-only?                       → direct destructuring ({ myProp })
└─ NO  → private state
          ├─ Single value (boolean, string…)?      → useState
          └─ Two or more related values?            → useObjectState<T>
```

### Correct patterns

```tsx
// ✅ Read-only prop — direct destructuring, full auto-inference
export const Badge = c(({ label, variant }) => (
    <host shadowDom><span class={variant}>{label}</span></host>
), {
    props: {
        label:   String,
        variant: { type: String, reflect: true, value: () => "info" }
    }
});

// ✅ Internally mutable prop — useProp with explicit generic
export const Counter = c(({ label }) => {
    const [count, setCount] = useProp<number>("count");
    return <host><button onclick={() => setCount(count + 1)}>{label}: {count}</button></host>;
}, {
    props: {
        label: String,
        count: { type: Number, value: () => 0 }
    }
});

// ✅ Grouped private state — useObjectState
export const SearchBar = c(() => {
    const [state, setState] = useObjectState({ query: "", filter: "all" });
    return (
        <host shadowDom>
            <input
                value={state.query}
                oninput={(e) => setState({ query: e.currentTarget.value as string })}
            />
        </host>
    );
});
```

**❌ Forbidden:**
```tsx
// ❌ useProp for read-only — use direct destructuring instead
const [label] = useProp("label");

// ❌ Multiple useState for related values — use useObjectState
const [query, setQuery]   = useState("");
const [filter, setFilter] = useState("all");

// ❌ useMemo on small lists — direct computation is cheaper
const filtered = useMemo(() => items.filter(isActive), [items]);
// ✅ Correct:
const filtered = items.filter(isActive);
const done     = items.length - filtered.length; // math deduction, no second iteration
```

---

## 5. Events & Callbacks

### `event<Detail>()` — Fire-and-Forget (no response expected)

```tsx
export const ActionButton = c((props) => (
    <host>
        <button onclick={() => props.action({ id: 42 })}>Fire</button>
    </host>
), {
    props: {
        // ✅ No "on" prefix — Atomico maps it as "onaction" automatically in JSX
        action: event<{ id: number }>({ bubbles: true, composed: true })
    }
});
```

> **Shadow DOM boundary rule**: Native events like `change` and `submit` have `composed: false`
> and **cannot cross the Shadow DOM boundary**. Always declare a custom `event()` with
> `{ bubbles: true, composed: true }` and dispatch it explicitly.

```tsx
export const UiSelect = c(({ change, options }) => (
    <host shadowDom>
        <select onchange={(e) => change(e.currentTarget.value as string)}>
            {options.map(o => <option value={o.value}>{o.label}</option>)}
        </select>
    </host>
), {
    props: {
        options: { type: Array, value: (): { value: string; label: string }[] => [] },
        change:  event<string>({ bubbles: true, composed: true })
    }
});
```

### `callback<Fn>()` — Request-Response (child awaits a return value)

```tsx
export const TextEditor = c(({ content, save }) => (
    <host shadowDom>
        <button onclick={async () => {
            if (save) {
                const ok = await save(content);
                if (ok) console.log("Saved!");
            }
        }}>
            Save
        </button>
    </host>
), {
    props: {
        content: { type: String, value: () => "" },
        // ✅ callback MUST return a value — if no return is needed, use event() instead
        save: callback<(content: string) => Promise<boolean>>()
    }
});
```

### `useEvent` — when event is dispatched from a custom hook

```tsx
export const UiInput = c(() => {
    const [value, setValue] = useProp<string>("value");
    const dispatchChange = useEvent("change", { bubbles: true, composed: true });
    return (
        <host shadowDom>
            <input
                value={value}
                oninput={({ currentTarget }) => {
                    setValue(currentTarget.value as string);
                    dispatchChange();
                }}
            />
        </host>
    );
}, { props: { value: String } });
```

**❌ Forbidden:**
```tsx
// ❌ "on" prefix in event or callback name
props: { onChange: event() }  // Atomico treats "on*" props as native event subscriptions

// ❌ callback returning void — use event() instead
props: { save: callback<() => void>() }

// ❌ Re-dispatching native events that already bubble
const dispatchInput = useEvent("input"); // "input" already bubbles → causes double-fire
```

---

## 6. JSX Handlers — Always Inline

The TSX compiler automatically infers the event target type when handlers are **inline**.
Never extract single-use handlers into standalone constants.

```tsx
// ✅ Inline: e.currentTarget typed as HTMLInputElement automatically — zero manual castings
<input oninput={(e) => setState({ query: e.currentTarget.value as string })} />

// ❌ Extracted: forces `any`, breaks auto-inference
const handleInput = (e: any) => setState({ query: e.currentTarget.value });
<input oninput={handleInput} />
```

> **Rule**: Single-use handlers go inline. Extract only if the **exact same function** is
> shared across multiple elements.

### `useRef` — no null initialization

```tsx
// ✅ Parameterless — typed as T | undefined, no null needed
const inputRef = useRef<HTMLInputElement>();
if (inputRef.current) inputRef.current.focus(); // guard is mandatory

// ✅ Reference to another Atomico constructor
const btnRef = useRef<typeof MyButton>();
```

### `useListener` — prefer over manual addEventListener

```tsx
// ✅ Automatic cleanup on unmount, no useEffect boilerplate needed
useListener(containerRef, "keydown", (e) => {
    if (e.key === "Enter") handleSubmit();
});

// ❌ Manual addEventListener inside useEffect
useEffect(() => {
    const el = containerRef.current;
    el?.addEventListener("keydown", handler);
    return () => el?.removeEventListener("keydown", handler);
}, []);
```

### JSX type coercions

Atomico JSX maps attribute values differently from standard React/DOM types:

```tsx
// ❌ TS2345: currentTarget.value is string | number in Atomico JSX
oninput={(e) => setState({ title: e.currentTarget.value })}
// ✅ Force to string:
oninput={(e) => setState({ title: e.currentTarget.value as string })}

// ❌ TS2322: input value may be string | number
<input value={form.count} />
// ✅ Force to string:
<input value={String(form.count)} />

// ❌ TS2352: e.target is DOMFormElements, not HTMLFormElement
const form = e.target as HTMLFormElement;
// ✅ Pass through unknown:
const form = e.target as unknown as HTMLFormElement;
```

---

## 7. JSX Composition — PascalCase Constructors

When a child component's constructor is imported in the file, **always** use it as a PascalCase tag:

```tsx
import { TodoItem } from "./todo-item.js";

// ✅ Imported constructor → PascalCase → automatic prop types & autocompletion
<TodoItem title="Task" completed={false} />

// ❌ String tag bypasses type checking entirely
<todo-item title="Task" />
```

> **Fallback**: kebab-case string tags are allowed **only** when the constructor is not
> accessible in the current file (native HTML elements, globally registered third-party elements).

---

## 8. API Reference

| Export | When to use | Link |
| :--- | :--- | :--- |
| `c` | Define the component constructor | — |
| `css` | Encapsulated Shadow DOM styles | [1-properties.md](./examples/1-properties.md) |
| `useProp<T>` | Read **and write** a prop from inside the component | [1-properties.md](./examples/1-properties.md) |
| `useState` | Single ephemeral private state (one boolean/string toggle) | [2-states.md](./examples/2-states.md) |
| `useObjectState<T>` | Grouped private state (2+ related values) | [2-states.md](./examples/2-states.md) |
| `event<D>` | Fire-and-Forget notification to parent (no response) | [7-communication.md](./examples/7-communication.md) |
| `callback<Fn>` | Delegate logic to parent and await a return value | [1-properties.md](./examples/1-properties.md) |
| `useEvent` | Dispatch a CustomEvent from a custom hook | [7-communication.md](./examples/7-communication.md) |
| `useListener` | Imperative DOM event subscription with auto-cleanup | [8-hooks.md](./examples/8-hooks.md) |
| `useRef<T>` | Persistent reference to a DOM node or constructor | [8-hooks.md](./examples/8-hooks.md) |
| `useEffect` | Async side effect after render/paint | — |
| `useMemo` | Cache expensive computations (not small lists) | [8-hooks.md](./examples/8-hooks.md) |
| `useSlot` | Track elements assigned to a `<slot>` | [6-slots.md](./examples/6-slots.md) |
| `useNodes` | Observe Light DOM children via MutationObserver | [6-slots.md](./examples/6-slots.md) |
| `useParent` | Traverse DOM ancestors (optionally crossing Shadow DOM) | [8-hooks.md](./examples/8-hooks.md) |
| `useInternals` | Access `ElementInternals` for form-associated elements | [3-forms.md](./examples/3-forms.md) |
| `useFormProps` | Sync `name` & `value` with parent `FormData` | [3-forms.md](./examples/3-forms.md) |
| `useFormValidity` | Native browser constraint validation | [3-forms.md](./examples/3-forms.md) |
| `usePromise` | Promise controlled by this component | [5-async.md](./examples/5-async.md) |
| `useAsync` | Promise controlled by the parent element | [5-async.md](./examples/5-async.md) |
| `useSuspense` | Suspend render until a promise resolves | [5-async.md](./examples/5-async.md) |
| `useHost` | Direct reference to the component's host element | [8-hooks.md](./examples/8-hooks.md) |
| `useUpdate` | Force an imperative re-render | [8-hooks.md](./examples/8-hooks.md) |

---

## 9. Validation Pipeline

Before marking any task as complete, run this two-phase audit:

### Phase 1 — Semantic Linter (read the source files, check textually)

| # | Check | Reject if… |
|---|---|---|
| 1 | PascalCase constructors in JSX | imported constructor used as `<kebab-case />` |
| 2 | Inline single-use handlers | handler extracted to a local `const handleX = ...` variable |
| 3 | No void callbacks | `callback<() => void>()` found in props |
| 4 | No manual prop types | `({ x }: { x: string }) =>` found in render signature |
| 5 | useListener over addEventListener | manual `addEventListener` inside `useEffect` on a ref |

*Fail fast: if any check above fails, report the violation immediately and skip Phase 2.*

### Phase 2 — Compiler Verification

```bash
npx tsc -p tsconfig.json --noEmit --noErrorTruncation > tmp/tsc-errors.log 2>&1
```

- If no `tsconfig.json` exists, generate a fallback targeting `["src/**/*", "types/**/*"]`.
- Open `tmp/tsc-errors.log` and send the complete, non-truncated error list to the Developer.
- The Developer ↔ Validator feedback loop is **capped at 3 iterations**. Escalate to the user if unresolved.
