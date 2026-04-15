# 🤖 AI Agent Central Instructions for Atomico

> **CRITICAL DIRECTIVE:** You are assisting in an **Atomico.js** project. Atomico is a library for creating Web Components using functional patterns and JSX, but its internal mechanics and APIs differ significantly from React, Vue, or vanilla Web Components. **DO NOT rely on your pre-trained knowledge to infer Atomico syntax or practices.**

Before writing any component, hook, context, or style logic for Atomico, you are **STRICTLY REQUIRED** to read this file and consult the specific local skills defined in the `.agents/skills/` directory using your file-reading tools. 

Failing to follow these core instructions will lead to incorrect architectures.

---

## 🛑 Rule 1: Mandatory Skill Consultation
Whenever the user requests you to create or modify code in this project, evaluate which of the following areas it touches. You **MUST** use your `view_file` tool to read the corresponding `SKILL.md` before generating code.

- **Component Creation:** If creating a new Web Component, read `.agents/skills/atomico-component/SKILL.md`.
- **CSS & Styling:** If adding styles or themes, read `.agents/skills/atomico-css-styling/SKILL.md` (NEVER use inline `<style>` tags).
- **State & Hooks:** If managing state or lifecycle, read `.agents/skills/atomico-hooks-core/SKILL.md` or `.agents/skills/atomico-hooks-effects/SKILL.md`.
- **Data Fetching:** If handling promises or async data, read `.agents/skills/atomico-hooks-async/SKILL.md`.
- **DOM & Light/Shadow Transitions:** For DOM manipulation or slot reading, see `.agents/skills/atomico-hooks-dom/SKILL.md`.
- **JSX Composability:** If mapping JSX components, read `.agents/skills/atomico-jsx-patterns/SKILL.md`.
- **Properties & Attributes:** If creating two-way bindings for props, read `.agents/skills/atomico-hooks-props/SKILL.md`.

## 🛑 Rule 2: CSS and Shadow DOM
Atomico renders exclusively mapped with `adoptedStyleSheets` when using Shadow DOM for maximum memory efficiency.
- **NEVER** inject raw `<style>...</style>` tags inside the JSX `<host>`.
- **ALWAYS** use the `css` tagged template literal from `'atomico'` and pass it to the `styles` property in the component configuration object: `c(Render, { styles: css`...` })`. Review the styling skill.

## 🛑 Rule 3: `c()` Execution Context
Atomico Web Components are functional but map directly to Custom Elements. 
- The root of an Atomico component JSX MUST always be the `<host>` tag, which allows modifying the physical bounds of the Web Component.
- Hooks (`useState`, `useEffect`, etc.) in Atomico map to the Web Component `connectedCallback`/`disconnectedCallback` lifecycle, not a fiber tree.

## 🛑 Rule 4: Registration
Every custom element must be explicitly defined using the standard browser API:
`customElements.define("my-element", MyElementConstructor);`

## 🛑 Rule 5: Event Naming and `on` Prefix
Atomico's JSX engine automatically prepends `on` to event listeners. 
- **NEVER** use the `on` prefix when declaring event properties in the `props` object. 
- ❌ Bad: `props: { onSearch: event() }` (Creates an `ononSearch` listener)
- ✅ Good: `props: { search: event() }` (Used in JSX as `<MyComponent onSearch={...} />`)

## 🛑 Rule 6: `useProp` over `event()` for Observable State
If an event is dispatching a value that reflects the state of the component (like an input's value, a boolean toggle, or a search query), **do not use an isolated `event()` dispatcher**. 
Instead, configure a regular prop and use `useProp("propName")`. 
- Using `useProp` gives you a setter. When you call the setter (`setSearch("new query")`), Atomico automatically updates the DOM property on the custom element instance AND dispatches the property observer event natively.
- This allows consumers using the constructor instance to access the value directly from the event target (`onSearch={({currentTarget}) => console.log(currentTarget.search)}`) with full IDE type completion.

## 🛑 Rule 7: Inline JSX Event Handlers over Extracted Functions
Unless a handler is shared across multiple different tags, **NEVER extract it to a standalone function** (like `const handleInput = (e: InputEvent) => ...`). 
- **ALWAYS keep it inline** directly in the JSX (`oninput={({currentTarget}) => ...}`). 
- Atomico is deeply integrated with TypeScript and JSX. By keeping it inline, TypeScript automatically infers the event type and the `currentTarget` from the DOM tag, completely eliminating the need for manual type casting or verbose typing maintenance.

---

**AGENT ACKNOWLEDGEMENT:** If you are an AI reading this file, your next step is to identify the precise `.agents/skills/` required for the user's prompt, open them via your tools, and apply those specialized concepts strictly to your code output.
