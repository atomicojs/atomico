# Atomico Evaluation Sandbox (Gemini)

> [!IMPORTANT]
> **Cognitive Directive**: Before initiating any action, tool call, or web search, you are strictly required to read, index, and apply the specialized design and architecture instructions declared in your local `.agents/skills/` directory. Do not perform external scaffolding searches or initializations, as the environment is already pre-configured.

Welcome to the skill evaluation workspace. The goal of this environment is to assess the engineering quality and architecture of custom interfaces built using **Atomico.js**.

## The Task: Keyboard-Centric Nested Task Manager

Build a fully functional, highly polished, and keyboard-driven **Task Management Application (Todo App)** inside the `./src/` directory. The application must prioritize keyboard-only navigation, hierarchy nesting, list reordering, and keyboard-friendly state management.

### Functional Requirements

1.  **Task Creation Form**:
    A form-associated component that registers new tasks with the following data:
    *   **Title** (String, required)
    *   **Description** (String, optional)
    *   **Priority** (Enum: `Low` | `Medium` | `High`)
    *   **Due Date** (Date string, optional)

2.  **Search & Filtering Bar**:
    A top-level control panel to filter the task tree:
    *   **Search Input**: Real-time title/description text filter.
    *   **Priority Filter**: Dropdown/select filter (`All`, `Low`, `Medium`, `High`).
    *   **Date Range Selector**: Filter tasks falling within a start and end date.

3.  **Tree-Structure Task List**:
    A list view displaying tasks with visual indentations to show nested hierarchies (parent-child relationships).
    *   **Checkbox**: Located in the top-right corner of each task item card.

### Keyboard Interaction Rules (Hotkeys)

The core feature of the application is a fully keyboard-navigable list. When the task list is focused, the following interactions must be supported:

*   **ArrowUp / ArrowDown**: Move selection focus up and down the task list items.
*   **ArrowRight**: Indent/nest the currently selected task as a child of the task above it.
*   **ArrowLeft**: Outdent/un-nest the currently selected task, moving it up one level in the hierarchy.
*   **Ctrl + ArrowUp**: Move the selected task card physically upward in the list (reordering the list/tree).
*   **Ctrl + ArrowDown**: Move the selected task card physically downward in the list.
*   **Enter**: Open the selected task for detailed editing or view expansion.
*   **Space** (when a task is selected): Toggle the task's completion status (check/uncheck the top-right checkbox).
*   **Tab**: Standard focus traversal across interactive inputs and buttons. (When focused on a task's checkbox, pressing `Space` toggles completion).

### UI Components & Layout

1.  **Main Layout**: Split layout with the Filter/Search bar at the top, the Task Form on the left/right, and the main hierarchy Task List in the center.
2.  **Visual Selection Indicator**: The active/selected task card must have a distinct styling (e.g., vibrant borders or subtle animations) to guide the user's eye.
3.  **Shortcuts Footer**: A bottom banner/status bar displaying a cheat sheet of keyboard shortcuts (e.g., `[↑↓] Navigate`, `[←→] Nest/Unnest`, `[Ctrl+↑↓] Move`, `[Space] Complete`).

---

## How to Proceed

1.  Analyze this workspace and the available local agents/skills under `.agents/skills/`.
2.  Implement the entire task manager inside the `./src/components/` and `./src/` directories.
3.  Ensure everything works flawlessly without human intervention. Report your final implementation once you are done.
