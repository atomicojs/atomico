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

## 4. JSX Inline Event Handlers & Native Event Bubbling

1.  **Inline Handlers**: Write event handlers inline directly inside JSX properties (e.g. `oninput={(e) => setValue(e.currentTarget.value)}`) unless the function is shared across multiple elements. This lets the TSX compiler automatically infer target element properties (e.g., `e.currentTarget` as `HTMLInputElement`) with zero type casting.
2.  **LLM Constant-Isolation Prevention**: Standard LLM generation patterns frequently extract event handlers to local variables (e.g., `const handleInput = (e: any) => ...` or `const handleClick = ...`) and map them as callbacks in JSX (e.g., `<input oninput={handleInput} />`). This is a **strict validation failure**. It forces unnecessary manual casting or `any` typing, which breaks the compiler's native type inference. The Validator MUST reject any single-use handler that is not defined inline inside the JSX template.
3.  **No Double Propagation**: Do NOT capture native bubbling events (like `input`, `change`, `click`, or `submit`) and dispatch them again via custom events (`useEvent`), as this causes double trigger errors in parents. Let standard events propagate naturally.

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

## 6. Strict TypeScript Verification Command

To ensure all types are strictly checked and prevent silent compile-time regressions:
*   **Mandatory Verification**: The Validator agent MUST explicitly run the type checking command inside the target package directory prior to completing the audit phase.
*   **Execution Workflow**:
    1.  **Analyze Available Configuration**: Detect if a `tsconfig.json` file is present in the workspace/package directory.
    2.  **Execute Type Check**:
        - **If a config exists**: Run verification using `npx tsc --noEmit` (or the workspace's designated check script like `npm run test:ts`), ensuring `"strict": true` is enforced.
        - **If no config exists**:
            1. **Create the `tsconfig.json`**: Generate a `tsconfig.json` file in the package root directory.
            2. **Point to Sources**: Configure the `"include"` array to target the Atomico component source directories (e.g. `["src/**/*", "types/**/*"]` or other source paths), **not** sandbox directories.
            3. **Compiler Template**: Populate the file with a strict default configuration:
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
            4. **Add test script**: Update the `package.json` file to inject or update the scripts section with:
               `"test:ts": "tsc --noEmit"`
            5. **Verify**: Run `npm run test:ts` to verify the source code and compile-time type safety.
*   **Zero Diagnostics Policy**: Any compilation error, type warning, or implicit `any` diagnostics emitted by the compiler represents an immediate audit failure, and the logs must be sent back to the Developer agent.

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
