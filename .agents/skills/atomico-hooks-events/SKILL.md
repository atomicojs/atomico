---
name: atomico-hooks-events
description: >
  Use useEvent and useListener hooks for custom event dispatching and DOM event
  listening. Triggers when the user needs to dispatch custom events from a
  component, listen to events on referenced elements, or implement pub/sub
  communication between web components. Also covers the event() prop helper.
license: MIT
compatibility: "Atomico >=1.79"
metadata:
  category: hooks
  priority: high
---

# Event Hooks

## `useEvent` — Dispatch Custom Events

Creates a dispatcher function that fires a `CustomEvent` from the host element.
The dispatcher is cached across renders for the same event type.

### API

```ts
const dispatch = useEvent<DetailType>(type: string, eventInit?: EventInit);
```

### Basic Usage

```tsx
import { c, useEvent } from "atomico";

const MyButton = c(() => {
    const dispatch = useEvent<{ action: string }>("myAction", {
        bubbles: true,
        composed: true  // Crosses shadow DOM boundaries
    });

    return (
        <host>
            <button onclick={() => dispatch({ action: "clicked" })}>
                Click me
            </button>
        </host>
    );
});
```

### Consuming Events in JSX

When using constructor instances in JSX, event listeners use the `on` prefix:

```tsx
<MyButton
    onmyAction={({ detail }) => {
        console.log(detail.action);  // "clicked" — fully typed!
    }}
/>
```

### useEvent with Event Props

If the host element has a prop matching the event type, `useEvent` will call
that prop directly instead of dispatching a DOM event. This enables the
**event()** prop pattern:

```tsx
const MyChild = c(
    (props) => {
        // This calls props.change() if defined, otherwise dispatches event
        const dispatch = useEvent("change");
        return (
            <host>
                <button onclick={() => dispatch({ id: 1 })}>Fire</button>
            </host>
        );
    },
    {
        props: {
            change: event<{ id: number }>({ bubbles: true })
        }
    }
);
```

---

## `useListener` — Listen to DOM Events

Attaches an event listener to a ref'd element. The listener is automatically
cleaned up when the component unmounts or the ref changes.

### API

```ts
useListener(ref, eventType, handler, options?);
```

### Usage

```tsx
import { c, useRef, useListener } from "atomico";

const MyComponent = c(() => {
    const buttonRef = useRef<HTMLButtonElement>();

    useListener(buttonRef, "click", (event) => {
        console.log("Button clicked!", event);
    });

    return (
        <host shadowDom>
            <button ref={buttonRef}>Click me</button>
        </host>
    );
});
```

### Listening to External Elements

```tsx
const MyComponent = c(() => {
    const host = useHost();

    // Listen to events on the host element itself
    useListener(host, "customEvent", (event) => {
        console.log("Received:", event.detail);
    });

    return <host shadowDom><slot /></host>;
});
```

### Key Characteristics

1. **Ref-based**: Always requires a `ref` object, not a direct DOM node
2. **Auto-cleanup**: Removes the listener when component unmounts
3. **Latest handler**: Always calls the most recent handler function (uses an
   internal ref to avoid stale closures)
4. **Layout-phase**: Attaches in `useLayoutEffect` timing, so it's available
   before `useEffect` runs

---

## `event()` — Prop-Based Event Declaration

> See also: [atomico-component skill](../atomico-component/SKILL.md)

The `event()` helper creates a prop that acts as both an event dispatcher inside
the component and a `CustomEvent` listener for external consumers.

```tsx
import { c, event } from "atomico";

const MyComponent = c(
    (props) => (
        <host>
            <button onclick={() => props.myEvent({ id: 42 })}>
                Fire event
            </button>
        </host>
    ),
    {
        props: {
            myEvent: event<{ id: number }>({
                bubbles: true,
                composed: true
            })
        }
    }
);

// External: listen via on-prefix
<MyComponent onmyEvent={({ detail }) => detail.id} />;

// Imperative: call directly on instance
const el = new MyComponent();
el.myEvent({ id: 42 });
```

> **🛑 CRITICAL NAMING RULE**: NEVER prefix an `event()` prop with "on" (e.g., `onSearch`). Atomico's JSX mapping automatically prepends "on" for listeners. If you define a prop as `onSearch`, JSX will expect `<Component ononSearch={...} />`. Always name the base action (e.g., `search: event()`).

---

## `callback()` — Delegated Logic Prop

The `callback()` helper creates a `Function`-type prop for delegating logic
from child to parent. Unlike events, callbacks return values.

```tsx
import { c, callback } from "atomico";

const MyEditor = c(
    (props) => {
        // Parent provides the processing logic
        if (props.processMarkdown) {
            const result = props.processMarkdown();
        }
        return <host />;
    },
    {
        props: {
            processMarkdown: callback<() => Promise<string>>()
        }
    }
);

// Parent provides implementation
<MyEditor processMarkdown={() => Promise.resolve("# Rendered")} />;
```
