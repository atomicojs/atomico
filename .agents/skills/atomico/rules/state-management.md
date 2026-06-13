# Rule: State Management (useProp vs useState vs useObjectState)

Guidelines for managing reactive, private, and grouped state in Atomico Web Components.

---

## Directives

1. **Direct Parameter Destructuring (`({ propA, propB }) => { ... }`) (Recommended for Read-Only Props)**:
   *   **When to use**: For any declared property that the component only needs to read during its rendering phase (e.g. counters, static configurations, labels, layout metadata).
   *   **Why**: Atomico automatically injects the resolved properties object as the first parameter of the render function, typed according to the `props` schema. Destructuring it directly is highly aesthetic, keeps code clean, and provides **100% automatic type inference** without any type overrides.
   *   **Prohibition of manual parameter typing**: Never manually type the destructured props argument in the render callback function (e.g., `({ filter }: { filter: string }) => ...`). Adding manual type annotations overrides the auto-inference, duplicates type information, and leads to code maintenance synchronization issues. Let Atomico's typings infer everything from the `props` configuration block.
2. **`useProp("name")` (Interior Settable States)**:
   *   **When to use**: Strictly when the component needs to **mutate/write** the property from the interior (e.g. a custom input updating its `value` property, or inside a custom hook that needs to react to changes).
   *   **Rule**: The prop name passed to `useProp` MUST be declared in the component's `props` configuration.
3. **`useState(init)` (Single Ephemeral State)**:
   *   **When to use**: Strictly for *single*, transient, internal UI state (e.g. `showDropdown: boolean`, `isExpanded: boolean`) that does not need to be observed or accessed from the outside.
4. **`useObjectState(initialObject)` (Grouped / Related States)**:
   *   **When to use**: Mandatory for managing grouped or related states containing *multiple* properties (e.g. `{ filter: string, search: string }`).
   *   **🛑 Antipatrón - useState Redundancy**: NEVER declare multiple separate `useState` hooks to manage related parameters. This creates highly redundant render cycles, pollutes code maintainability, and increases the dependency array complexity in effects. Instead, group them into a single `useObjectState`.
   *   **⚠️ Note (Do NOT use for single properties)**: `useObjectState` is strictly for grouping multiple properties. If you are tracking a *single* state variable (e.g. `isEditing: boolean` or `text: string`), using `useObjectState` is over-engineered and represents a code quality violation. Use `useState` instead (e.g. `useState(false)`).
   *   **Behavior**: In Atomico, `useObjectState` allows partial updates (merging the incoming state payload with the existing keys) and optimizes DOM updates by tracking mutated keys.

---

## Examples

### ❌ Incorrect: Redundant Multiple `useState` declarations
```tsx
import { c, useState } from "atomico";

export const FilterBar = c(() => {
    // ❌ BAD: Highly redundant and unmaintainable state declarations
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [priorityFilter, setPriorityFilter] = useState("All");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [sortBy, setSortBy] = useState("dueDateAsc");

    return (
        <host shadowDom>
            {/* Redundant handlers and multiple rendering dependencies */}
            <input value={searchQuery} oninput={(e) => setSearchQuery(e.currentTarget.value)} />
            <select value={statusFilter} onchange={(e) => setStatusFilter(e.currentTarget.value)}>...</select>
        </host>
    );
});
```

### ✅ Correct: Optimized Grouped State using `useObjectState`
```tsx
import { c, useObjectState } from "atomico";

interface FilterState {
    query: string;
    status: string;
    priority: string;
    category: string;
    sortBy: string;
}

export const FilterBar = c(() => {
    // ✅ GOOD: Single, unified state tracking related parameters
    const [state, setState] = useObjectState<FilterState>({
        query: "",
        status: "All",
        priority: "All",
        category: "All",
        sortBy: "dueDateAsc"
    });

    return (
        <host shadowDom>
            {/* ✅ GOOD: Inline handlers allow automatic Event target typing */}
            <input 
                value={state.query} 
                oninput={(e) => setState({ query: e.currentTarget.value })} 
            />
            <select 
                value={state.status} 
                onchange={(e) => setState({ status: e.currentTarget.value })}
            >
                <option value="All">All</option>
                <option value="Active">Active</option>
            </select>
        </host>
    );
});
```

---

## 5. useMemo vs. Direct Computation Optimization

*   **Rule**: Do not use `useMemo` to cache simple operations on small collections (e.g., filtering lists under 100 items, counting elements, or basic formatting).
*   **Why**: Atomico's `useMemo` allocates state memory, creates temporary closures, allocates dependency arrays, and runs `isEqualArray` comparisons on every single render. If dependencies change on most renders (e.g., task additions/deletions), `useMemo` is recalculated anyway, functioning as pure overhead.
*   **Mathematical/Logical Deduction**: Instead of executing multiple redundant filters inside separate `useMemo` blocks, calculate metrics directly and use mathematical deductions (e.g., calculating `completedCount = total - activeCount` instead of filtering the array twice).
*   **Extension to `useCallback`**: In Atomico's core (`hooks.js`), `useCallback(fn, deps)` is implemented as `useMemo(() => fn, deps)`. It shares the exact same overhead characteristics. Since Atomico's render engine (`render.js`) and `useListener` hook automatically update listener references without re-registering DOM event listeners, you should **never** wrap DOM event handlers in `useCallback`. Doing so creates unnecessary hook states and dependency arrays with zero performance benefits.

### ❌ Incorrect (Over-engineered and high memory churn)
```tsx
const filteredTasks = useMemo(() => {
    if (state.filter === "active") return state.tasks.filter((t) => !t.completed);
    if (state.filter === "completed") return state.tasks.filter((t) => t.completed);
    return state.tasks;
}, [state.tasks, state.filter]);

const activeCount = useMemo(
    () => state.tasks.filter((t) => !t.completed).length,
    [state.tasks]
);

const completedCount = useMemo(
    () => state.tasks.filter((t) => t.completed).length,
    [state.tasks]
);
```

### ✅ Correct (Lightweight direct processing & math deduction)
```tsx
const filteredTasks = state.filter === "active"
    ? state.tasks.filter((t) => !t.completed)
    : state.filter === "completed"
        ? state.tasks.filter((t) => t.completed)
        : state.tasks;

// Deduce completed tasks using total minus active tasks (avoids second iteration)
const activeCount = state.tasks.filter((t) => !t.completed).length;
const completedCount = state.tasks.length - activeCount;
```

---

## Summary of Best Practices
* Use `useProp` for public APIs.
* Use `useState` only for individual, isolated private toggles.
* Use `useObjectState` for any group of two or more related state parameters (like filters, search forms, pagination metrics).
* Avoid `useMemo` for simple operations on small data sets; compute directly and use logical deductions instead.
