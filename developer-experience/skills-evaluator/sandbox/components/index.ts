import { UiBadge } from "./ui-badge.js";
import { UiButton } from "./ui-button.js";
import { UiCheckbox } from "./ui-checkbox.js";
import { UiInput } from "./ui-input.js";
import { UiSelect } from "./ui-select.js";
import { DashboardStats } from "./dashboard-stats.js";
import { TaskItem } from "./task-item.js";
import { TaskForm } from "./task-form.js";
import { TodoApp } from "../todo-app-component.js";

// Register all custom elements agnostically to avoid conflicts
customElements.define("ui-badge", UiBadge);
customElements.define("ui-button", UiButton);
customElements.define("ui-checkbox", UiCheckbox);
customElements.define("ui-input", UiInput);
customElements.define("ui-select", UiSelect);
customElements.define("dashboard-stats", DashboardStats);
customElements.define("task-item", TaskItem);
customElements.define("task-form", TaskForm);
customElements.define("todo-app", TodoApp);
