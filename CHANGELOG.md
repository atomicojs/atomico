# Changelog

All notable changes to this project will be documented in this file.

## [2.2.0] - 2026-07-18

### Added
- **`type<T>()` Casting Helper**: Added the runtime helper and export of `type(value)` in core and typings to support explicit type casting for custom element properties.
- **`useObjectState` Hook**: Introduced `useObjectState` to manage grouped local states with partial updates and shallow property comparisons, reducing rendering overhead.
- **`SYMBOL_EVENT` Branding**: Added internal `SYMBOL_EVENT` marker to the dispatchers created by `event()`.

### Changed
- **Compiler Compatibility (TypeScript 7.0/6.0)**: Migrated `types/tsconfig.json` compiler options to target `NodeNext` module resolution and added `"ignoreDeprecations": "6.0"`. Removed deprecated `"baseUrl": "./"`.
- **`useEvent` Brand Verification**: Updated `useEvent` to verify if a property/method on the custom element is an actual event dispatcher created by `event()` via the `SYMBOL_EVENT` brand check before calling it, preventing runtime crashes.
- **`usePromise` Default Behavior**: Configured the `autorun` option to default to `true` when options are supplied as an object.
- **`useListener` Type Signature**: Changed the event listener argument type from `(event: unknown) => any` to `(event: any) => any` to restore ergonomics for specific handler types (like `MouseEvent`) under strict compiler checks.

### Optimized
- **TS Server Performance & Memory Usage**: Replaced the expensive global constructor resolution mapping over `globalThis` with abstract new type constructor constraints (`Types = Type<abstract new (...args: any[]) => any>`), eliminating infinite loops and hangs in the IDE.
- **JSX Tag Performance (`DOMCleanKeys`)**: Substituted dynamic template literal patterns in `DOMCleanKeys` with a flat `Exclude` statement over native DOM prototypes, preventing costly string wildcards for 150+ HTML/SVG elements.
- **Default Config Fallbacks**: Removed default type parameter constraints on component initialization in `types/component.d.ts` to ensure components without configurations default strictly to `SchemaComponentGenericConfig` (with empty props `{}`) rather than wide `PropTypes`, resolving type degradation on `currentTarget`.

---

## Agent Skills Model Upgrades (Advantages of the New Model)

In this release, we consolidated the workspace instruction set under `.agents/skills/` by replacing 14 separate, fragmented sub-skills with a single unified, structured **`atomico`** skill directory.

This restructuring offers major advantages for agentic coding and developer guidance:

1. **Drastically Reduced Context Overhead**:
   Instead of loading multiple redundant agent skill definitions (which polluted the context window and consumed large token budgets), a single router skill manages all references.
2. **Modular Directory Structure**:
   Reference guides and coding standards are organized into clean subdirectories (`/rules` and `/examples`). The agent only indexes what is necessary when it needs it, keeping prompt sizes minimal and reasoning speed fast.
3. **Unified Validation Pipeline**:
   The validation checks and testing scripts (Phase 1 Semantic Lints and Phase 2 Compiler Verification) are centralized in one document, enforcing a strict contract for all code generation.
4. **Improved Maintenance and Discoverability**:
   Developers can easily update and discover workspace guidelines in one central folder rather than maintaining fragmented skill packages.
