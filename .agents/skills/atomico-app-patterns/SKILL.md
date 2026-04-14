---
name: atomico-app-patterns
description: >
  Full application patterns and component composition in Atomico. Triggers when
  the user needs to build a multi-component application, implement parent-child
  communication, manage shared state across components, or structure a web
  component project. Covers real-world patterns like todo apps, forms, and
  component hierarchies.
license: MIT
compatibility: "Atomico >=1.79, TypeScript >=5.0"
metadata:
  category: patterns
  priority: medium
---

# Application Patterns

## Complete Todo App — Component Composition

This example demonstrates the key Atomico patterns for building a real
application with multiple communicating components.

### Component Architecture

```
TodoApp (manages state via useProp)
├── TodoForm (dispatches createTask event)
└── TodoTask[] (dispatches changeTask event, reflects checked state)
```

### TodoForm — Event-Driven Child

```tsx
import { c, css, event, useRef } from "atomico";

export const TodoForm = c(
    ({ createTask }) => {
        const ref = useRef<HTMLInputElement>();
        return (
            <host shadowDom>
                <form
                    onsubmit={(event) => {
                        event.preventDefault();
                        const message = ref.current.value.trim();
                        if (message) createTask(message);
                        event.currentTarget.reset();
                    }}
                >
                    <input ref={ref} type="text" placeholder="Write task" />
                    <button>Create task</button>
                </form>
            </host>
        );
    },
    {
        props: {
            createTask: event<string>({ bubbles: true, composed: true })
        },
        styles: css`
            button {
                background: #9cbeff;
                border-radius: 0.5rem;
                padding: 0.5rem 1rem;
                border: none;
                cursor: pointer;
            }
            input {
                padding: 0.5rem;
                border: 1px solid #dcdce1;
                border-radius: 0.5rem;
                margin-right: 1rem;
            }
        `
    }
);

customElements.define("todo-form", TodoForm);
```

### TodoTask — Stateful Child with Reflection

```tsx
import { c, css, event } from "atomico";

export const TodoTask = c(
    ({ checked, message, changeTask }) => (
        <host shadowDom>
            <label
                onchange={(event) => {
                    changeTask((event.target as HTMLInputElement).checked);
                }}
            >
                <input type="checkbox" checked={checked} />
                <span>{message}</span>
            </label>
        </host>
    ),
    {
        props: {
            changeTask: event<boolean>({ bubbles: true, composed: true }),
            message: String,
            checked: {
                type: Boolean,
                reflect: true  // Mirrors to HTML attribute for CSS styling
            }
        },
        styles: css`
            :host {
                --background: #f0f0f9;
                --border: #dcdce1;
            }
            :host([checked]) {
                --background: #a3ebd4;
                --border: #6ee2c9;
            }
            label {
                display: block;
                background: var(--background);
                border: 1px solid var(--border);
                padding: 1rem;
                border-radius: 0.5rem;
                cursor: pointer;
            }
        `
    }
);

customElements.define("todo-task", TodoTask);
```

### TodoApp — Parent Orchestrator

```tsx
import { c, css, useProp } from "atomico";
import { TodoForm } from "./todo-form.js";
import { TodoTask } from "./todo-task.js";

interface Task {
    checked: boolean;
    message: string;
}

const TodoApp = c(
    () => {
        const [tasks, setTasks] = useProp<Task[]>("task");

        return (
            <host shadowDom>
                {/* ✅ Constructor instance — full type inference */}
                <TodoForm
                    oncreateTask={({ detail }) => {
                        setTasks([...tasks, { checked: false, message: detail }]);
                    }}
                />
                {tasks.map((task, index) => (
                    <TodoTask
                        message={task.message}
                        checked={task.checked}
                        onchangeTask={({ detail }) => {
                            setTasks(
                                tasks.map((item, i) =>
                                    i === index
                                        ? { ...item, checked: detail }
                                        : item
                                )
                            );
                        }}
                    />
                ))}
            </host>
        );
    },
    {
        props: {
            task: {
                type: Array,
                value: (): Task[] => [
                    { checked: true, message: "Sample 1" },
                    { checked: false, message: "Sample 2" }
                ]
            }
        },
        styles: css`:host { display: grid; gap: 0.5rem; }`
    }
);

customElements.define("todo-app", TodoApp);
```

---

## Communication Patterns

### 1. Parent → Child: Props

```tsx
<TodoTask message="Buy groceries" checked={false} />
```

### 2. Child → Parent: Events (via `event()`)

```tsx
// Child declares event prop
props: {
    changeTask: event<boolean>({ bubbles: true, composed: true })
}

// Child fires event
changeTask(true);

// Parent listens via on-prefix
<TodoTask onchangeTask={({ detail }) => handleChange(detail)} />
```

### 3. Cross-Tree: Context

```tsx
const AppState = createContext({ theme: "light" });

// Provider
const App = c(() => {
    useProvider(AppState, { theme: "dark" });
    return <host><slot /></host>;
});

// Consumer (any depth)
const DeepChild = c(() => {
    const { theme } = useContext(AppState);
    return <host>{theme}</host>;
});
```

### 4. Sibling: Via shared parent state

```tsx
const Parent = c(() => {
    const [selected, setSelected] = useState(null);
    return (
        <host>
            <SiblingA onselect={({ detail }) => setSelected(detail)} />
            <SiblingB highlight={selected} />
        </host>
    );
});
```

---

## Project Structure Recommendation

```
my-app/
├── src/
│   ├── components/
│   │   ├── my-button/
│   │   │   ├── my-button.tsx      # Component definition
│   │   │   └── my-button.css.ts   # Styles (optional separate file)
│   │   ├── my-input/
│   │   │   └── my-input.tsx
│   │   └── index.ts               # Re-exports
│   ├── contexts/
│   │   └── app-context.ts         # Shared contexts
│   ├── hooks/
│   │   └── use-api.ts             # Custom hooks
│   └── index.ts                   # App entry, customElements.define
├── package.json
└── tsconfig.json
```

### Key Principles

1. **One component per file** — export the constructor for JSX usage
2. **Register at entry point** — `customElements.define` calls at the app level
3. **Shared styles in separate files** — import and compose in `styles` array
4. **Custom hooks next to components** — or in a shared `hooks/` directory
5. **Contexts as singletons** — define contexts in a `contexts/` directory

---

## TypeScript Configuration

```json
{
    "compilerOptions": {
        "jsx": "react-jsx",
        "jsxImportSource": "atomico",
        "moduleResolution": "bundler",
        "strict": true,
        "target": "ESNext",
        "module": "ESNext"
    }
}
```

---

## Registration Pattern

### ✅ Centralized Registration

```ts
// index.ts — single registration point
import { TodoApp } from "./components/todo-app.js";
import { TodoForm } from "./components/todo-form.js";
import { TodoTask } from "./components/todo-task.js";

customElements.define("todo-app", TodoApp);
customElements.define("todo-form", TodoForm);
customElements.define("todo-task", TodoTask);
```

### ✅ Co-located Registration (also valid)

```ts
// todo-task.tsx — register alongside definition
export const TodoTask = c(/* ... */);
customElements.define("todo-task", TodoTask);
```

Both patterns are valid. Co-located is simpler for small projects; centralized
gives more control over naming and load order.
