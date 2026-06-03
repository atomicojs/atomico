---
name: atomico-app
description: >
  Specialized skill for managing application architecture, complex views, modular folder structure, and component abstraction in Atomico.
  Triggers when the user asks to "create app", "create application", "dashboard", "complex view", "modular architecture", "abstrae", or "reutiliza".
license: MIT
compatibility: "Atomico >=2.0, TypeScript >=5.0"
metadata:
  category: app-architecture
  priority: high
---

# Atomico Application Architecture & Abstraction Guide

Specialized reference for designing high-performance modular views, managing component trees, and ensuring maximum code reuse in Atomico applications.

## 1. Search-and-Variant-First Paradigm (Component Reuse)

Before writing any new component file or Custom Element:
1. **Workspace Inspection**: Search the workspace directories (specifically `components/`) for elements with a similar goal.
2. **Reusability / Variant Check**:
   - If a similar component exists, you MUST propose or automatically create a **variation** (e.g., adding a styling variant like `variant="secondary"` or extending its properties) instead of duplicating logic or files.
   - If the user/context allows automatic actions, execute it as a variant. If not, explicitly ask the user if they prefer a variation.

---

## 2. Automated View Abstraction (Modularity by Default)

When tasked with creating a complex view, form, dashboard, or layout:
1. **Never Monolith**: Do NOT write a giant monolithic custom element file containing multiple nested tags or definitions.
2. **Subcomponent Separation**: First, analyze the interface and break it down into clean, single-responsibility subcomponents (e.g. input fields, headers, cards, buttons).
3. **Dedicated Directory**: Place these subcomponents in a dedicated `components/` subfolder (e.g. `components/ui-input.tsx`).
4. **Assembly**: Import the subcomponent constructors and compose them in the main view file (e.g. `todo-app.tsx`).

---

## 3. Specialized State & Tree Traversing Hooks

Use specialized Atomico hooks to manage modular tree communications and optimize complex view states:

* **`useObjectState(initialObject)`**: Mandatory for managing grouped reactive state parameters (e.g. search criteria, filters, sorting status, paginations) in complex app views. **Never declare multiple redundant `useState` hooks.** This optimizes render batches and tracks internal key mutations.
* **`useSlot(ref, filter?)`**: Tracks slotted children assigned inside a `<slot>` (ideal for compound components like lists or sliders).
* **`useParent(target, cross?)`**: Traverses ancestor elements. Set `cross=true` to cross Shadow DOM boundaries (ideal for child components searching for a parent form or context provider).
* **`usePromise(cb, deps?)`**: Manually tracks async states (result, pending, fulfilled, rejected) cleanly in the component.


```tsx
import { c, useRef, useSlot, useParent } from "atomico";

export const UiListItem = c(() => {
    // Traverse parent list element across shadow boundaries
    const parentList = useParent("ui-list", true);

    return <host shadowDom><li><slot /></li></host>;
});
```

---

## 4. Architectural Delegation Flow (Planning & Guard Pipeline)

When designing complex dashboard architectures, layouts, or modular page views, the main agent MUST NOT dive into straight coding. Follow this sequence of hidden planning:

1.  **Architecture Subagent Generation**: Proactively define and execute a `component-architect` subagent via `define_subagent`. Task it with scanning files under `components/` and generating the structural composition plan (identifying reusable components vs styling variants).
2.  **Implementation Verification**: Once the code is written, delegate the validation of types and performance to a `typescript-guard` subagent. Ensure it runs compile verification (`tsc --noEmit`), checks state grouping, and refactors components for type precision.

