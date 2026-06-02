import { c, css, useEvent } from "atomico";
import { UiBadge } from "./ui-badge.js";
import { UiCheckbox } from "./ui-checkbox.js";

interface Task {
    id: string;
    title: string;
    description: string;
    category: string;
    priority: "High" | "Medium" | "Low";
    dueDate: string;
    status: "Pending" | "In Progress" | "Completed";
}

export const TaskItem = c(
    ({ task }) => {
        const dispatchToggle = useEvent<{ id: string; completed: boolean }>("toggle-status", { bubbles: true });
        const dispatchDelete = useEvent<string>("delete-task", { bubbles: true });
        const dispatchEdit = useEvent<Task>("edit-task", { bubbles: true });

        const t = task as Task;

        // Determine priority badge variant
        const priorityVariant = t.priority === "High" ? "danger" : t.priority === "Medium" ? "warning" : "info";

        // Determine status badge variant
        const statusVariant = t.status === "Completed" ? "success" : t.status === "In Progress" ? "info" : "neutral";

        // Determine if task is overdue
        const isOverdue = t.status !== "Completed" && t.dueDate && new Date(t.dueDate) < new Date(new Date().setHours(0,0,0,0));

        const handleCheckboxChange = (e: any) => {
            dispatchToggle({ id: t.id, completed: e.detail });
        };

        const handleNextStatus = () => {
            if (t.status === "Pending") {
                dispatchToggle({ id: t.id, completed: false }); // Will transition to In Progress in parent
            } else if (t.status === "In Progress") {
                dispatchToggle({ id: t.id, completed: true }); // Will transition to Completed
            } else {
                dispatchToggle({ id: t.id, completed: false }); // Reset to Pending
            }
        };

        return (
            <host shadowDom>
                <div class={`task-card ${t.status === "Completed" ? "completed" : ""}`}>
                    <div class="card-header">
                        <div class="tags">
                            <UiBadge label={t.category} variant="neutral" />
                            <UiBadge label={t.priority} variant={priorityVariant} />
                        </div>
                        <div class="actions">
                            <button class="action-btn edit" onclick={() => dispatchEdit(t)} title="Edit Task">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                            </button>
                            <button class="action-btn delete" onclick={() => dispatchDelete(t.id)} title="Delete Task">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div class="card-body">
                        <div class="checkbox-container">
                            <UiCheckbox checked={t.status === "Completed"} onchange={handleCheckboxChange} />
                        </div>
                        <div class="content">
                            <h4 class="title">{t.title}</h4>
                            {t.description && <p class="description">{t.description}</p>}
                        </div>
                    </div>

                    <div class="card-footer">
                        <div class={`due-date ${isOverdue ? "overdue" : ""}`}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            <span>{t.dueDate ? t.dueDate : "No due date"}</span>
                        </div>
                        
                        <div class="status-selector" onclick={handleNextStatus}>
                            <UiBadge label={t.status} variant={statusVariant} />
                        </div>
                    </div>
                </div>
            </host>
        );
    },
    {
        props: {
            task: { type: Object, value: () => ({}) }
        },
        styles: css`
            :host {
                display: block;
                width: 100%;
            }
            .task-card {
                background: #ffffff;
                border-radius: 12px;
                padding: 1rem;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
                border: 1px solid #e5e7eb;
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
                transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
            }
            .task-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04);
                border-color: #d1d5db;
            }
            .task-card.completed {
                background-color: #f9fafb;
                border-color: #e5e7eb;
            }
            .card-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .tags {
                display: flex;
                gap: 0.375rem;
            }
            .actions {
                display: flex;
                gap: 0.25rem;
                opacity: 0;
                transition: opacity 0.2s ease;
            }
            .task-card:hover .actions {
                opacity: 1;
            }
            .action-btn {
                background: none;
                border: none;
                padding: 0.375rem;
                border-radius: 6px;
                color: #6b7280;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
            }
            .action-btn svg {
                width: 0.875rem;
                height: 0.875rem;
            }
            .action-btn.edit:hover {
                background-color: #eff6ff;
                color: #2563eb;
            }
            .action-btn.delete:hover {
                background-color: #fee2e2;
                color: #dc2626;
            }
            .card-body {
                display: flex;
                gap: 0.75rem;
                align-items: flex-start;
            }
            .checkbox-container {
                padding-top: 0.125rem;
                flex-shrink: 0;
            }
            .content {
                display: flex;
                flex-direction: column;
                gap: 0.25rem;
                flex-grow: 1;
            }
            .title {
                margin: 0;
                font-size: 0.9375rem;
                font-weight: 600;
                color: #1f2937;
                transition: all 0.2s ease;
                line-height: 1.4;
            }
            .completed .title {
                text-decoration: line-through;
                color: #9ca3af;
            }
            .description {
                margin: 0;
                font-size: 0.8125rem;
                color: #4b5563;
                line-height: 1.5;
            }
            .completed .description {
                color: #9ca3af;
            }
            .card-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-top: 1px dashed #f3f4f6;
                padding-top: 0.625rem;
                margin-top: 0.25rem;
            }
            .due-date {
                display: flex;
                align-items: center;
                gap: 0.375rem;
                font-size: 0.75rem;
                color: #6b7280;
            }
            .due-date svg {
                width: 0.875rem;
                height: 0.875rem;
            }
            .due-date.overdue {
                color: #dc2626;
                font-weight: 600;
            }
            .status-selector {
                cursor: pointer;
            }
            .status-selector:hover {
                transform: scale(1.05);
            }
        `
    }
);
