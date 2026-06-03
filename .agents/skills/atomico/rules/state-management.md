# Rule: State Management (useProp vs useState vs useObjectState)

Guidelines for managing reactive, private, and grouped state in Atomico Web Components.

---

## Directives

1. **Direct Parameter Destructuring (`({ propA, propB }) => { ... }`) (Recommended for Read-Only Props)**:
   *   **When to use**: For any declared property that the component only needs to read during its rendering phase (e.g. counters, static configurations, labels, layout metadata).
   *   **Why**: Atomico automatically injects the resolved properties object as the first parameter of the render function, typed according to the `props` schema. Destructuring it directly is highly aesthetic, keeps code clean, and provides **100% automatic type inference** without any `any` type overrides.
2. **`useProp("name")` (Interior Settable States)**:
   *   **When to use**: Strictly when the component needs to **mutate/write** the property from the interior (e.g. a custom input updating its `value` property, or inside a custom hook that needs to react to changes).
   *   **Rule**: The prop name passed to `useProp` MUST be declared in the component's `props` configuration.
3. **`useState(init)` (Single Ephemeral State)**:
   *   **When to use**: Strictly for *single*, transient, internal UI state (e.g. `showDropdown: boolean`, `isExpanded: boolean`) that does not need to be observed or accessed from the outside.
4. **`useObjectState(initialObject)` (Grouped / Related States)**:
   *   **When to use**: Mandatory for managing grouped or related states (e.g., search queries, multiple filters, sorting selections, active tab configurations, forms).
   *   **🛑 Antipatrón - useState Redundancy**: NEVER declare multiple separate `useState` hooks to manage related parameters. This creates highly redundant render cycles, pollutes code maintainability, and increases the dependency array complexity in effects. Instead, group them into a single `useObjectState`.
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

    const handleSearch = (e: Event & { currentTarget: HTMLInputElement }) => {
        // ✅ Partial updates are supported natively!
        setState({ query: e.currentTarget.value });
    };

    const handleStatus = (e: Event & { currentTarget: HTMLSelectElement }) => {
        setState({ status: e.currentTarget.value });
    };

    return (
        <host shadowDom>
            <input value={state.query} oninput={handleSearch} />
            <select value={state.status} onchange={handleStatus}>
                <option value="All">All</option>
                <option value="Active">Active</option>
            </select>
        </host>
    );
});
```

---

## Summary of Best Practices
* Use `useProp` for public APIs.
* Use `useState` only for individual, isolated private toggles.
* Use `useObjectState` for any group of two or more related state parameters (like filters, search forms, pagination metrics).
