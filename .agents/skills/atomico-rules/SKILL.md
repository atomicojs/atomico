---
name: atomico-rules
description: >
  Specialized Validator skill to enforce TypeScript strictness, render performance optimization, DOM security, and correct state bindings in Atomico.
  Triggers during validation phases, code auditing, error resolution, or pre-delivery inspections.
license: MIT
compatibility: "Atomico >=2.0, TypeScript >=5.0"
metadata:
  category: lint-rules
  priority: high
---

# Atomico Quality Assurance & Type Validation Rules (Validator Role)

Strict guidelines and checklists to audit written components, prevent rendering loops, and enforce compile-time type safety under TypeScript strict mode.

## 1. Explicit Typing & Prohibiting `any`

*   **Rule**: The `any` type is strictly forbidden. All state values, hook arguments, and return types must be fully declared or inferred.
*   **State Typings**: Always type state declarations explicitly if they are not automatically resolved by default factories.
    *   *Correct*: `const [index, setIndex] = useProp<number>("index");`
    *   *Incorrect*: `const [index] = useProp("index");` (resolves to type `any`).
*   **Atomico JSX Type Coercion & Casting**: When JSX attributes or event properties cannot be precisely resolved by the compiler, you **MUST** force them to the expected type to prevent `TS2322`/`TS2345`/`TS2352` errors:
    *   *Input Value*: Force input `value={...}` to `string | undefined` using `String(val)` or `val as string` if it's a union.
    *   *Event Value*: Force `e.currentTarget.value` (typed as `string | number`) to string via `String(e.currentTarget.value)` or `e.currentTarget.value as string` before updating string-only states.
    *   *Form Target*: Cast `e.target` to `HTMLFormElement` by going through `unknown` first: `e.target as unknown as HTMLFormElement`.

---

## 2. Destructuring Props for Read-Only Operations

*   **Rule**: If a declared property is only read during the rendering phase, you MUST destructure it directly from the first argument of the component function. Never import or invoke `useProp` for read-only values.
*   **Prohibition of parameter defaults in destructured arguments**: Never declare default values directly in the destructuring parameter list of the component render function (e.g. `({ name = "Guest" }) => ...`). This is an antipattern because it bypasses the element initialization and is not registered on the Custom Element prototype. Default values MUST strictly be defined in the component's `props` configuration block using the `value` arrow factory.
*   **Prohibition of manual parameter typing**: Never manually type the destructured props argument of the render callback function (e.g., `({ filter }: { filter: string }) => ...`). This is a **strict validation failure**. Atomico automatically infers the render callback's argument type based on the component's `props` configuration block. Manual type annotations are redundant, override this auto-inference, and create sync maintenance issues.
*   **Why**: It leverages TypeScript auto-inference, prevents compiler overrides, registers the properties on the custom element prototype, and keeps the code clean.
*   **Use `useProp` strictly** when the component needs to **mutate / write** to the property from the inside (e.g., a text-input updating its internal value state).

*   **❌ Antipattern (Verbose and untyped read-only):**
    ```tsx
    export const UserCard = c(() => {
        const [name] = useProp("name");
        return <host>{name}</host>;
    });
    ```

*   **✅ Pattern (Direct destructuring):**
    ```tsx
    export const UserCard = c(
        ({ name }) => {
            return <host>{name}</host>;
        },
        {
            props: {
                name: { type: String, value: () => "Guest" }
            }
        }
    );
    ```

---

## 3. Reference Safety (`useRef`) and Strict Null Guards

Under strict null checks (`"strict": true` in `tsconfig.json`), properties of elements obtained via refs can trigger compilation errors because `ref.current` may initially be `undefined`.
*   **Rule**: Always wrap operations accessing `ref.current` inside a guard statement check.
*   **No Redundant `null`**: Do **not** declare references with `null` (e.g., `useRef<T | null>(null)`). Atomico does not clear DOM references (it only overwrites them). Declaring `useRef<T>()` without parameters naturally types `ref.current` as `T | undefined`, avoiding unnecessary verbosity.

*   **❌ Antipattern (Unchecked access):**
    ```tsx
    const inputRef = useRef<HTMLInputElement>();
    const triggerFocus = () => {
        inputRef.current.focus(); // ❌ Compile Error: Object is possibly undefined
    };
    ```

*   **✅ Pattern (Guarded focus):**
    ```tsx
    const inputRef = useRef<HTMLInputElement>(); // ✅ Clean, parameterless initialization
    const triggerFocus = () => {
        if (inputRef.current) {
            inputRef.current.focus(); // ✅ Safe
        }
    };
    ```

---

## 4. Event & Callback Boundaries (Fire-and-Forget vs. Request-Response)

1.  **Inline Handlers**: Write event handlers inline directly inside JSX properties (e.g. `oninput={(e) => setValue(e.currentTarget.value)}`) unless the function is shared across multiple elements. This lets the TSX compiler automatically infer target element properties (e.g., `e.currentTarget` as `HTMLInputElement`) with zero type casting.
2.  **LLM Constant-Isolation Prevention**: Standard LLM generation patterns frequently extract event handlers to local variables (e.g., `const handleInput = (e: any) => ...` or `const handleClick = ...`) and map them as callbacks in JSX (e.g., `<input oninput={handleInput} />`). This is a **strict validation failure**. It forces unnecessary manual casting or `any` typing, which breaks the compiler's native type inference. The Validator MUST reject any single-use handler that is not defined inline inside the JSX template.
3.  **No Double Propagation**: Do NOT capture native bubbling events (like `input`, `change`, `click`, or `submit`) and dispatch them again via custom events (`useEvent`), as this causes double trigger errors in parents. Let standard events propagate naturally.
4.  **No Void Callbacks**: Callbacks must *never* return `void` or `undefined` (e.g., `save: callback<(data: FormState) => void>()` is a violation). Any unobserved action or fire-and-forget notification that does not expect a response back from the parent must be declared as `event()` instead of `callback()`.
5.  **Shadow DOM Event Boundary & Non-Composed Events**: Native browser events like `change` (emitted by `<select>`, `<input type="checkbox">`, `<input type="radio">`) and `submit` have `composed: false`. When wrapping these elements inside Shadow DOM, the events cannot cross the shadow boundary. To propagate these events to parents, you **MUST** declare and dispatch a custom event (e.g., `change: event()`) configured with `{ bubbles: true, composed: true }` in the component's `props` block.
6.  **Prefer `useListener` for Imperative Subscriptions**: Avoid writing manual `addEventListener`/`removeEventListener` bindings inside `useEffect` for element references. You **MUST** use the native `useListener(ref, eventName, handler)` hook to manage event subscriptions and cleanup cleanly.

---

## 5. Form-Friendly Custom Buttons

In HTML forms, custom buttons inside Shadow DOM do not submit parents natively.
*   **Rule**: A button component placed inside a form that acts as a submit trigger MUST configure `form: true`, call `useInternals()`, and request form submission explicitly:
    ```tsx
    export const UiButton = c(() => {
        const internals = useInternals();
        return (
            <host 
                onclick={() => {
                    internals.form?.requestSubmit();
                }}
            >
                Submit
            </host>
        );
    }, { form: true });
    ```

---

## 6. Two-Phase Validation Pipeline & Compiler Rules

To ensure strict code quality, the Validator agent MUST follow a mandatory two-phase audit workflow prior to completing the audit phase:

### Phase 1: Semantic Linter Audit (Textual Check)
Before executing the TypeScript compiler, the Validator **MUST** read the generated source files using the file reading tools and perform a textual comparison check against the checklist of framework-specific antipatterns:
1.  **PascalCase Constructor Tags**: Check all child components instantiated in the JSX template.
    *   **Rule**: If a child component's constructor is imported or exportable within the file (e.g. `import { TodoItem } from "./todo-item.js"`), you **MUST** instantiate it as a PascalCase constructor tag (e.g., `<TodoItem />`).
    *   **Prohibition**: It is **strictly forbidden** to instantiate imported/exportable components as kebab-case string tags (e.g., `<todo-item />`). Using `<todo-item />` breaks TypeScript automatic type inference for the component props and is an immediate audit failure.
    *   **TagName Fallback Exception**: You may use kebab-case string tags (e.g., `<third-party-widget />` or `<ui-select />`) **only** when the component's constructor is not exported or accessible in the current file context (e.g., native elements or globally registered custom elements).
2.  **No Extracted Handlers**: Ensure single-use event handlers are written inline in the JSX (e.g., `oninput={(e) => ...}`). Reject any code that extracts single-use handlers into local variables (e.g. `const handleInput = ...`) which forces manual casting and disables auto-inference.
3.  **No Void Callbacks**: Ensure all declared callbacks in `props` return a value. Reject any `callback` returning `void`.
4.  **No Manual Props Types**: Verify the destructured props argument in the component function is not manually typed (e.g. `({ filter }: { filter: string }) => ...` is forbidden).
5.  **Prefer `useListener`**: Ensure that no manual `addEventListener` or `removeEventListener` calls are used inside `useEffect` on element references.

*If any Phase 1 check fails, the Validator MUST immediately reject the code and report the exact rule violation to the Developer agent, skipping the compiler execution.*

### Phase 2: Compiler Verification
If Phase 1 passes, run type checking using the project's local config and redirect output to a temporary log file:
*   **Execution Command**:
    *   If a `tsconfig.json` file is present, execute:
        `npx tsc -p tsconfig.json --noEmit --noErrorTruncation > tmp/tsc-errors.log 2>&1`
    *   If no `tsconfig.json` exists in the package root:
        1. **Create `tsconfig.json`**: Generate a fallback `tsconfig.json` in the package root directory targeting the sources:
           ```json
           {
               "include": ["src/**/*", "types/**/*"],
               "compilerOptions": {
                   "jsx": "react-jsx",
                   "jsxImportSource": "atomico",
                   "target": "ESNext",
                   "module": "NodeNext",
                   "moduleResolution": "NodeNext",
                   "allowJs": true,
                   "strict": true,
                   "declaration": true,
                   "emitDeclarationOnly": true,
                   "noEmit": true,
                   "lib": ["ESNext", "DOM", "DOM.Iterable"]
               }
           }
           ```
        2. **Run Compiler**: Run the exact same command: `npx tsc -p tsconfig.json --noEmit --noErrorTruncation > tmp/tsc-errors.log 2>&1`.
*   **Zero Diagnostics Policy**:
    *   If the command finishes with a non-zero exit code, it represents an immediate audit failure.
    *   The Validator **MUST** open `tmp/tsc-errors.log` using the read tools, collect the full non-truncated list of errors, and send them back consolidated to the Developer agent. This prevents redundant compilation feedback cycles.

---

## 7. Feedback Loop Containment

*   **Rule**: To prevent infinite agent correction loops, the Validator is allowed to return validation errors to the Developer for refactoring a maximum of **3 times**.
*   **Escalation**: If compile errors or style violations remain unresolved after the third iteration, the Validator must stop, preserve logs, and report the blocking type/runtime error directly to the user.

---

## 8. Strict Quality Rules Index

Detailed check catalogs and antipattern audits:
*   [1. Component Creation & Index Registration](rules/component-creation.md): Centralized register templates, folder boundaries.
*   [2. JSX Patterns & Constructor Tags](rules/jsx-patterns.md): Rules for composing using tag constructor instances.
*   [3. Props Declarations, Ref Typing & Callbacks](rules/props-declaration.md): Standard arrow factory defaults, useRef typings, and event dispatch rules.
*   [4. State Management Optimization](rules/state-management.md): useProp vs useState vs useObjectState, batch rendering rules.
