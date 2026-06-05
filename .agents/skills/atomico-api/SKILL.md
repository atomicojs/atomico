---
name: atomico-api
description: >
  Specialized Developer skill containing syntax guidelines, hooks matrices, and implementation rules for writing Atomico.js web components.
  Triggers when writing component source code, implementing lifecycle hooks, declaring properties, or registering Custom Elements.
license: MIT
compatibility: "Atomico >=2.0, TypeScript >=5.0, JSX via atomico/jsx-runtime"
metadata:
  category: core
  priority: highest
---

# Atomico API & Hook Syntax Guide (Developer Role)

Comprehensive syntax and implementation reference for creating standard Custom Elements using Atomico's functional API.

## 1. The Core Component Pattern

Every Atomico component is defined using `c()` and must return a `<host>` root element.

```tsx
import { c, css } from "atomico";

export const MyCounter = c(
    ({ message }) => {
        return (
            <host shadowDom>
                <h1>{message}</h1>
            </host>
        );
    },
    {
        props: {
            message: { type: String, value: () => "Default Counter" }
        },
        styles: css`
            :host { display: block; }
        `
    }
);
```

---

## 2. API & Hooks Cheat Sheet

Use these reference tables to select the correct hook for managing state, events, DOM queries, and form integrations:

### Core & Custom Hooks
| API / Hook | Signature / Usage | Context & Rules | Example Reference |
| :--- | :--- | :--- | :--- |
| `c(render, config)` | `c((props) => JSX, config)` | Main wrapper to declare the component constructor. | `N/A` |
| `event<Detail>()` | `action: event<{ id: number }>({ bubbles: true })` | Declared in `props` schema. Generates a CustomEvent dispatcher. | [1-properties.md](examples/1-properties.md#3-custom-events--bidirectional-callbacks) |
| `callback<Fn>()` | `filter: callback<(val: string) => boolean>()` | Declared in `props` schema. Used for synchronous/async request-response patterns. | [1-properties.md](examples/1-properties.md#3-custom-events--bidirectional-callbacks) |
| `css` | `css` :host { ... }`` | Tagged template literal for styling inside Shadow DOM. | [1-properties.md](examples/1-properties.md#2-reflected-properties-for-css-styling) |
| `useProp(name)` | `[val, setVal] = useProp<T>("propName")` | Linked to a declared prop. **Strictly for interior-settable/mutable props**. | [1-properties.md](examples/1-properties.md#1-property-typings--syntaxes) |
| `useState(init)` | `[state, setState] = useState(init)` | Local, isolated private state. Only for simple, individual toggles (e.g. `isOpen`). | [2-states.md](examples/2-states.md#1-single-ephemeral-state-usestate) |
| `useObjectState(init)` | `[state, setState] = useObjectState<T>(init)` | Grouped related states. Supports partial updates and eliminates `useState` redundancy. | [2-states.md](examples/2-states.md#2-grouped-related-states-useobjectstate) |
| `useEvent(name, opts)` | `dispatch = useEvent<Detail>(name, opts)` | Dispatched CustomEvent trigger from within code. | [7-communication.md](examples/7-communication.md#1-dispatching-customevents-useevent) |
| `useListener(ref, type, cb, opts?)` | `useListener(ref, "click", (e) => {})` | Subscribes listener to element and handles automatic garbage collection on unmount. | [8-hooks.md](examples/8-hooks.md#1-subscribing-to-dom-events-uselistener) |
| `useRef(init)` | `ref = useRef<T>(init)` | Returns a mutable reference object whose `.current` property persists. | [8-hooks.md](examples/8-hooks.md#2-dom-referencing--tree-traversal-useref-usehost-useparent) |
| `useMemo(fn, deps)` | `val = useMemo(fn, deps)` | Memoizes expensive computations based on dependency changes. | [8-hooks.md](examples/8-hooks.md#3-memoization--value-cache-usememo-usecallback) |
| `useCallback(fn, deps)` | `cb = useCallback(fn, deps)` | Memoizes callback references to prevent unneeded function regeneration. | [8-hooks.md](examples/8-hooks.md#3-memoization--value-cache-usememo-usecallback) |
| `useEffect(fn, deps)` | `useEffect(() => cleanup, deps)` | Triggers asynchronous side effects after paint. | `N/A` |

### DOM & Context Hooks
| Hook | Signature | Behavior | Example Reference |
| :--- | :--- | :--- | :--- |
| `useSlot(ref, filter?)` | `slots = useSlot(ref, el => el instanceof MyItem)` | Tracks assigned elements inside a `<slot>`. | [6-slots.md](examples/6-slots.md#1-tracking-slotted-elements-useslot) |
| `useNodes(filter?)` | `nodes = useNodes(el => el instanceof Element)` | Direct Light DOM children observer via MutationObserver. | [6-slots.md](examples/6-slots.md#2-observing-light-dom-children-usenodes) |
| `useParent(target, cross?)` | `formRef = useParent("form", true)` | Traverses ancestors. Set `cross=true` to cross Shadow DOM boundaries. | [8-hooks.md](examples/8-hooks.md#2-dom-referencing--tree-traversal-useref-usehost-useparent) |

### Form-Associated Hooks
*Requires `form: true` in component configuration.*
| Hook | Signature | Behavior | Example Reference |
| :--- | :--- | :--- | :--- |
| `useInternals()` | `internals = useInternals()` | Accesses the native browser `ElementInternals` instance. | [3-forms.md](examples/3-forms.md#1-custom-form-associated-input) |
| `useFormProps()` | `[val, setVal] = useFormProps()` | Auto-syncs `name` & `value` properties with parent `FormData`. | [3-forms.md](examples/3-forms.md#1-custom-form-associated-input) |
| `useFormValidity(cb, deps)` | `[msg, validity] = useFormValidity(check, deps)` | Integrates native browser constraint validation. | [3-forms.md](examples/3-forms.md#1-custom-form-associated-input) |

---

## 3. Strict Property & Event Rules

### 3.1. Unified Property Factories
When a property requires a default state, you MUST declare it using the configuration object and an arrow-function factory callback: `value: () => defaultValue`. Declaring raw static values (e.g., `value: ""` or `value: 0`) is incorrect.
For simple read-only props without defaults or attribute reflection, use the simple shorthand type directly (e.g. `message: String`).

### 3.2. Strict TypeScript Typing (Arrays & Objects)
To prevent complex properties (such as `Array` or `Object`) from resolving to `never[]` or `{}` in TSX, you MUST use an explicit type assertion (e.g. `as Option[]` or `as Config`) inside the arrow-function default factory callback.
```tsx
props: {
    options: { type: Array, value: () => [] as Option[] }
}
```

### 3.3. JSX Casing & Event Handling
1. **Lowercase Bindings**: Always write JSX event attributes in lowercase (e.g., `onclick={...}`, `onchange={...}`). Do not use React-style camelCase (`onClick`).
2. **Agnostic Registration**: Do NOT call `customElements.define` inside the component file. Keep files pure, and export only the component instance. Centralize all registration inside a components index file (`components/index.ts`).

---

## 4. Reference Examples Index

Practical template files demonstrating how to implement specific features:
*   [1. Properties Definition](examples/1-properties.md): Declarations, default factories, CSS host selectors reflection, and callbacks/events.
*   [2. Component State Management](examples/2-states.md): Contrast between useState and useObjectState.
*   [3. Form Association & Input Validation](examples/3-forms.md): useInternals, useFormProps, useFormValidity, custom buttons form submit.
*   [4. Context Providers & Consumers](examples/4-contexts.md): Provider-consumer pattern using CustomEvents.
*   [5. Asynchronous Operations & Suspense](examples/5-async.md): usePromise, useAsync, useSuspense, and useAbortController.
*   [6. Slot Interactions & DOM Manipulation](examples/6-slots.md): useSlot, useNodes, useRender, and Shadow DOM configurations.
*   [7. Custom Events & Communication Guidelines](examples/7-communication.md): useEvent usage, native bubbling vs custom events dispatch rules.
*   [8. Utility & Advanced Hooks](examples/8-hooks.md): useRef, useMemo, useCallback, useListener, useUpdate, useHost, and useParent.
