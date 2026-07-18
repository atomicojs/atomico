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

> **AGENT CONTRACT**: You may not respond to a code generation request
> without completing the Validation Report in §7.
> If any check fails, fix the code before responding — do not report
> failures as acceptable output.

---

## 1. Hello World Component

Every Atomico component is defined with `c()` and **must** return a `<host>` root element.

```tsx
import { c, useProp, css } from "atomico";

export const MyCounter = c(
    ({ label }) => {
        const [value, setValue] = useProp<number>("value");
        return (
            <host shadowDom>
                <button onclick={() => setValue(value + 1)}>
                    {label}: {value}
                </button>
            </host>
        );
    },
    {
        props: {
            label: { type: String, value: () => "Increment" },
            size: {
                type: String,
                reflect: true,
                value: (): "normal" | "small" => "normal"
            },
            value: { type: Number, value: () => 0 }
        },
        styles: css`
            :host {
                --font-size: 1em;
            }
            :host([size="small"]) {
                --font-size: 0.5em;
            }
        `
    }
);
```

---

## 2. Architectural Rules

1. **Modular by Default**: Avoid monolithic files. Split complex views into a `components/` folder.
2. **Reuse First**: Audit existing workspace components before generating new ones.
3. **Prop-Driven Communication**: Pass data down via props, dispatch events up.
4. **Separate Registration**: NEVER call `customElements.define` inside the component file. Centralize all registrations in an index file.

```tsx
// components/index.ts <- the ONLY place where elements are registered
import { MyCounter } from "./my-counter.js";
customElements.define("my-counter", MyCounter);
```

---

## 3. Props

### Type system

```ts
// Valid constructors for the `type:` field in props
type AtomicoPropType =
    | StringConstructor // type: String
    | NumberConstructor // type: Number
    | BooleanConstructor // type: Boolean
    | ArrayConstructor // type: Array  -> requires value: (): T[] => []
    | ObjectConstructor // type: Object -> requires value: (): T => ({...})
    | MapConstructor
    | SetConstructor
    | PromiseConstructor
    | (new (...args: any[]) => HTMLElement); // HTMLElement or any subclass

// Short form - prop without default or reflect
type PropShorthand = AtomicoPropType;

// Long form - prop with default or reflect
interface PropConfig<T> {
    type: AtomicoPropType;
    value?: () => T; // MUST be a factory callback - never a static value
    reflect?: boolean; // only String | Number | Boolean
}
```

### Declaration syntax

Use the simplest form that satisfies the requirement:

```tsx
props: {
    // Shorthand: no default, no reflect
    label: String,

    // Config object: only when a default value is needed
    count: { type: Number, value: () => 0 },

    // Reflect: only to control CSS via attribute selectors
    variant: { type: String, reflect: true, value: (): "primary" | "danger" => "primary" }
}
```

**Forbidden:**

```tsx
props: {
    name: { type: String },           // Verbose config with no default or reflect - use shorthand
    count: { type: Number, value: 0 } // Static value - must be a factory callback
}
// Manual type on destructured render argument:
// ({ label }: { label: string }) => ...  Atomico infers types automatically from props block
```

### Arrays & Objects — strict return-type annotation

Without an explicit return type, TypeScript resolves `Array` to `never[]` and `Object` to `{}`.
Annotate the factory return type to guarantee correct inference in TSX:

```tsx
interface Option { value: string; label: string; }
interface Config { theme: "light" | "dark"; debug: boolean; }

props: {
    // Return type annotation on the factory - inferred as Option[] in TSX
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

Never use `reflect: true` on `Array` or `Object` — it triggers expensive DOM serialization.

### Events & Callbacks

```ts
// event<Detail>() - Fire-and-Forget
// Name WITHOUT "on" prefix. The JSX consumer receives it as "on<propName>"
// Calling props.myEvent(detail) dispatches CustomEvent with event.detail = detail
declare function event<Detail = void>(options?: {
    bubbles?: boolean;
    composed?: boolean;
    cancelable?: boolean;
}): EventDescriptor<Detail>;

// callback<Fn>() - Request-Response
// Fn MUST NOT return void - if no return value is needed, use event() instead
declare function callback<
    Fn extends (...args: any[]) => NonNullable<unknown>
>(): Fn | undefined;
```

```tsx
export const ActionButton = c(
    (props) => (
        <host>
            <button onclick={() => props.action({ id: 42 })}>Fire</button>
        </host>
    ),
    {
        props: {
            // No "on" prefix - Atomico maps it as "onaction" automatically in JSX
            action: event<{ id: number }>({ bubbles: true, composed: true })
        }
    }
);
```

> **Shadow DOM boundary rule**: Native events like `change` and `submit` have `composed: false`
> and **cannot cross the Shadow DOM boundary**. Always declare a custom `event()` with
> `{ bubbles: true, composed: true }` and dispatch it explicitly.

```tsx
export const UiSelect = c(
    ({ change, options }) => (
        <host shadowDom>
            <select onchange={(e) => change(e.currentTarget.value as string)}>
                {options.map((o) => (
                    <option value={o.value}>{o.label}</option>
                ))}
            </select>
        </host>
    ),
    {
        props: {
            options: {
                type: Array,
                value: (): { value: string; label: string }[] => []
            },
            change: event<string>({ bubbles: true, composed: true })
        }
    }
);
```

```tsx
export const TextEditor = c(
    ({ content, save }) => (
        <host shadowDom>
            <button
                onclick={async () => {
                    if (save) {
                        const ok = await save(content);
                        if (ok) console.log("Saved!");
                    }
                }}
            >
                Save
            </button>
        </host>
    ),
    {
        props: {
            content: { type: String, value: () => "" },
            // callback MUST return a value - if no return is needed, use event() instead
            save: callback<(content: string) => Promise<boolean>>()
        }
    }
);
```

**Forbidden:**

```tsx
// "on" prefix in event or callback name
props: {
    onChange: event();
} // Atomico treats "on*" props as native event subscriptions

// callback returning void - use event() instead
props: {
    save: callback<() => void>();
}

// Re-dispatching native events that already bubble
const dispatchInput = useEvent("input"); // "input" already bubbles causes double-fire
```

---

## 4. State Management

```ts
// Signature reference
declare function useProp<T>(name: string): [T, (val: T) => void];
declare function useState<T>(init: T | (() => T)): [T, (val: T) => void];
declare function useObjectState<T extends object>(
    init: T
): [T, (partial: Partial<T>) => void];
```

### Decision tree

```
Does the state need to be read from outside (parent / CSS)?
+- YES -> declare it in props
|         +- Does the child also write to it? -> useProp<T>()
|         +- Read-only?                       -> direct destructuring ({ myProp })
+- NO  -> private state
          +- Single value (boolean, string)?      -> useState
          +- Two or more related values?          -> useObjectState<T>
```

### Correct patterns

```tsx
// Read-only prop - direct destructuring, full auto-inference
export const Badge = c(
    ({ label, variant }) => (
        <host shadowDom>
            <span class={variant}>{label}</span>
        </host>
    ),
    {
        props: {
            label: String,
            variant: { type: String, reflect: true, value: () => "info" }
        }
    }
);

// Internally mutable prop - useProp with explicit generic
export const Counter = c(
    ({ label }) => {
        const [count, setCount] = useProp<number>("count");
        return (
            <host>
                <button onclick={() => setCount(count + 1)}>
                    {label}: {count}
                </button>
            </host>
        );
    },
    {
        props: {
            label: String,
            count: { type: Number, value: () => 0 }
        }
    }
);

// Grouped private state - useObjectState
export const SearchBar = c(() => {
    const [state, setState] = useObjectState({ query: "", filter: "all" });
    return (
        <host shadowDom>
            <input
                value={state.query}
                oninput={(e) =>
                    setState({ query: e.currentTarget.value as string })
                }
            />
        </host>
    );
});
```

**Forbidden:**

```tsx
// useProp for read-only - use direct destructuring instead
const [label] = useProp("label");

// Multiple useState for related values - use useObjectState
const [query, setQuery] = useState("");
const [filter, setFilter] = useState("all");

// useMemo on small lists - direct computation is cheaper
const filtered = useMemo(() => items.filter(isActive), [items]);
// Correct:
const filtered = items.filter(isActive);
const done = items.length - filtered.length; // math deduction, no second iteration
```

---

## 5. JSX

### Handlers — Always Inline

The TSX compiler automatically infers the event target type when handlers are **inline**.

```ts
// With inline handler, Atomico JSX infers automatically:
// oninput  -> e: { currentTarget: HTMLInputElement }
// onchange -> e: { currentTarget: HTMLSelectElement }
// e.currentTarget.value -> string | number  requires `as string` when passing to setState
```

```tsx
// Inline: e.currentTarget typed as HTMLInputElement - zero manual castings
<input oninput={(e) => setState({ query: e.currentTarget.value as string })} />;

// Extracted: forces `any`, breaks auto-inference
const handleInput = (e: any) => setState({ query: e.currentTarget.value });
<input oninput={handleInput} />;
```

> **Rule**: Single-use handlers go inline. Extract only if the **exact same function** is
> shared across multiple elements.

### `useRef` — no null initialization

```ts
declare function useRef<T>(): { current: T | undefined };
```

```tsx
// Parameterless - typed as T | undefined, no null needed
const inputRef = useRef<HTMLInputElement>();
if (inputRef.current) inputRef.current.focus(); // guard is mandatory

// Reference to another Atomico constructor
const btnRef = useRef<typeof MyButton>();
```

### `useListener` — prefer over manual addEventListener

```tsx
// Automatic cleanup on unmount, no useEffect boilerplate needed
useListener(containerRef, "keydown", (e) => {
    if (e.key === "Enter") handleSubmit();
});

// Manual addEventListener inside useEffect - forbidden
useEffect(() => {
    const el = containerRef.current;
    el?.addEventListener("keydown", handler);
    return () => el?.removeEventListener("keydown", handler);
}, []);
```

### JSX type coercions

Atomico JSX maps attribute values differently from standard React/DOM types:

```tsx
// TS2345: currentTarget.value is string | number in Atomico JSX
oninput={(e) => setState({ title: e.currentTarget.value })}
// Force to string:
oninput={(e) => setState({ title: e.currentTarget.value as string })}

// TS2322: input value may be string | number
<input value={form.count} />
// Force to string:
<input value={String(form.count)} />

// TS2352: e.target is DOMFormElements, not HTMLFormElement
const form = e.target as HTMLFormElement;
// Pass through unknown:
const form = e.target as unknown as HTMLFormElement;
```

### Composition — PascalCase Constructors

When a child component's constructor is imported in the file, **always** use it as a PascalCase tag:

```tsx
import { TodoItem } from "./todo-item.js";

// Imported constructor -> PascalCase -> automatic prop types and autocompletion
<TodoItem title="Task" completed={false} />

// String tag bypasses type checking entirely
<todo-item title="Task" />
```

> **Fallback**: kebab-case string tags are allowed **only** when the constructor is not
> accessible in the current file (native HTML elements, globally registered third-party elements).

---

## 6. API Reference

#### `c(render, config): Constructor`

Defines the web component constructor. The render function receives props and must return `<host>`.

---

#### `css: CSSResult` (tagged template)

Tagged template literal for styles encapsulated in Shadow DOM.
-> [example](./examples/1-properties.md)

---

#### `useProp<T>(name: string): [T, (val: T) => void]`

Reads **and writes** a declared prop from inside the component. Use only when the component needs to mutate the value internally.
-> [example](./examples/1-properties.md)

---

#### `useState<T>(init: T | (() => T)): [T, (val: T) => void]`

Single ephemeral private state. Use only for one isolated boolean/string toggle.
-> [example](./examples/2-states.md)

---

#### `useObjectState<T extends object>(init: T): [T, (partial: Partial<T>) => void]`

Grouped private state with partial updates. Use when managing 2+ related values.
-> [example](./examples/2-states.md)

---

#### `event<Detail>(opts?): EventDescriptor<Detail>`

Declares a Fire-and-Forget CustomEvent dispatcher in `props`. Name WITHOUT "on" prefix.
-> [example](./examples/7-communication.md)

---

#### `callback<Fn extends (...args) => NonNullable<unknown>>(): Fn | undefined`

Declares a Request-Response callback prop. `Fn` must never return `void`.
-> [example](./examples/1-properties.md)

---

#### `useEvent<Detail>(name: string, opts?: EventInit): (detail?: Detail) => void`

Dispatches a CustomEvent from within component logic or a custom hook.
-> [example](./examples/7-communication.md)

---

#### `useListener(ref, type: string, callback, opts?: AddEventListenerOptions): void`

Subscribes to DOM events on a ref. Handles cleanup automatically on unmount.
-> [example](./examples/8-hooks.md)

---

#### `useRef<T>(): { current: T | undefined }`

Persistent mutable reference to a DOM node or constructor. No null initialization needed.
-> [example](./examples/8-hooks.md)

---

#### `useEffect(fn: () => void | (() => void), deps?): void`

Executes side effects asynchronously after render/paint.

---

#### `useMemo<T>(fn: () => T, deps: any[]): T`

Caches expensive computations. **Do not use** for simple operations on small collections.
-> [example](./examples/8-hooks.md)

---

#### `useSlot(ref): Element[]`

Tracks elements assigned to a `<slot>`. Triggers re-render on slot changes.
-> [example](./examples/6-slots.md)

---

#### `useNodes(filter?): Node[]`

Observes Light DOM children directly via MutationObserver.
-> [example](./examples/6-slots.md)

---

#### `useParent<T>(target, crossShadow?: boolean): T | undefined`

Traverses DOM ancestors. Set `crossShadow = true` to cross Shadow DOM boundaries.
-> [example](./examples/8-hooks.md)

---

#### `useInternals(): ElementInternals`

Accesses the native `ElementInternals` instance. Requires `form: true` in config.
-> [example](./examples/3-forms.md)

---

#### `useFormProps(): [value, setFormValue]`

Auto-syncs `name` and `value` properties with the parent `FormData`.
-> [example](./examples/3-forms.md)

---

#### `useFormValidity(check: () => string | void, deps?): void`

Integrates native browser constraint validation into form-associated components.
-> [example](./examples/3-forms.md)

---

#### `usePromise<T>(fn: () => Promise<T>, deps?): [T | undefined, "pending" | "fulfilled" | "rejected"]`

Resolves and tracks a local promise. The component owns the async lifecycle.
-> [example](./examples/5-async.md)

---

#### `useAsync<T>(fn, deps?): [T | undefined, "pending" | "fulfilled" | "rejected"]`

Manages async operations controlled by parent elements.
-> [example](./examples/5-async.md)

---

#### `useSuspense(promise: Promise<any>): void`

Suspends rendering until the given promise resolves.
-> [example](./examples/5-async.md)

---

#### `useHost<T>(): { current: T }`

Returns a ref pointing directly to the component's host element.
-> [example](./examples/8-hooks.md)

---

#### `useUpdate(): () => void`

Returns a function that forces an imperative re-render of the element.
-> [example](./examples/8-hooks.md)

---

## 7. Validation Pipeline

> Before marking any task as complete, run this two-phase audit.

### Phase 1 — Semantic Linter (read source files, check textually)

| #   | Check                             | Reject if...                                                |
| --- | --------------------------------- | ----------------------------------------------------------- |
| 1   | PascalCase constructors in JSX    | imported constructor used as kebab-case tag                 |
| 2   | Inline single-use handlers        | handler extracted to a local `const handleX = ...` variable |
| 3   | No void callbacks                 | `callback<() => void>()` found in props                     |
| 4   | No manual prop types              | `({ x }: { x: string }) =>` found in render signature       |
| 5   | useListener over addEventListener | manual `addEventListener` inside `useEffect` on a ref       |

_Fail fast: if any check above fails, report the violation immediately and skip Phase 2._

### Phase 2 — Compiler Verification

```bash
npx tsc -p tsconfig.json --noEmit --noErrorTruncation > tmp/tsc-errors.log 2>&1
```

- If no `tsconfig.json` exists, generate a fallback targeting `["src/**/*", "types/**/*"]`.
- Open `tmp/tsc-errors.log` and send the complete error list to the Developer.
- The Developer and Validator feedback loop is **capped at 3 iterations**. Escalate to the user if unresolved.

### Required Validation Report

After every code generation, append this block to the response:

```
### Validation Report
- [ ] All handlers are inline (no extracted const handleX)
- [ ] Imported constructors use PascalCase in JSX
- [ ] No callback<() => void> in props
- [ ] Array/Object props have return-type annotation
- [ ] tsc: `npx tsc --noEmit` -> PASS / FAIL - [error summary if FAIL]
```
