import { c, css, useState, useEffect, useEvent, useProp } from "atomico";
import { UiInput } from "./ui-input.js";
import { UiSelect } from "./ui-select.js";
import { UiButton } from "./ui-button.js";

interface Task {
    id?: string;
    title: string;
    description: string;
    category: string;
    priority: "High" | "Medium" | "Low";
    dueDate: string;
    status: "Pending" | "In Progress" | "Completed";
}

export const TaskForm = c(
    ({ task, active }) => {
        const dispatchSubmit = useEvent<Task>("submit-task", { bubbles: true });
        const dispatchClose = useEvent<void>("close", { bubbles: true });

        const t = task as any;

        const [title, setTitle] = useState("");
        const [description, setDescription] = useState("");
        const [category, setCategory] = useState("Personal");
        const [priority, setPriority] = useState<"High" | "Medium" | "Low">("Low");
        const [dueDate, setDueDate] = useState("");
        const [status, setStatus] = useState<"Pending" | "In Progress" | "Completed">("Pending");

        // Sync local state when task prop changes
        useEffect(() => {
            if (t && t.id) {
                setTitle(t.title || "");
                setDescription(t.description || "");
                setCategory(t.category || "Personal");
                setPriority(t.priority || "Low");
                setDueDate(t.dueDate || "");
                setStatus(t.status || "Pending");
            } else {
                setTitle("");
                setDescription("");
                setCategory("Personal");
                setPriority("Low");
                setDueDate("");
                setStatus("Pending");
            }
        }, [t]);

        const handleSubmit = (e: Event) => {
            e.preventDefault();
            if (!title.trim()) return;

            dispatchSubmit({
                id: t?.id,
                title,
                description,
                category,
                priority,
                dueDate,
                status
            });
        };

        const categoryOptions = [
            { value: "Work", label: "Work" },
            { value: "Personal", label: "Personal" },
            { value: "Shopping", label: "Shopping" },
            { value: "Urgent", label: "Urgent" }
        ];

        const priorityOptions = [
            { value: "High", label: "High" },
            { value: "Medium", label: "Medium" },
            { value: "Low", label: "Low" }
        ];

        const statusOptions = [
            { value: "Pending", label: "Pending" },
            { value: "In Progress", label: "In Progress" },
            { value: "Completed", label: "Completed" }
        ];

        const isEditing = t && t.id;


        return (
            <host shadowDom>
                <div class="backdrop" onclick={() => dispatchClose()}></div>
                <div class="modal">
                    <div class="modal-header">
                        <h2>{isEditing ? "Edit Task" : "Create New Task"}</h2>
                        <button class="close-btn" onclick={() => dispatchClose()}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>

                    <form onsubmit={handleSubmit} class="form-body">
                        <UiInput
                            label="Task Title"
                            placeholder="Enter task name..."
                            value={title}
                            required
                            oninput={(e: any) => setTitle(e.detail)}
                        />

                        <div class="form-field">
                            <label class="field-label">Description</label>
                            <textarea
                                class="textarea-field"
                                placeholder="Add some notes about this task..."
                                value={description}
                                oninput={(e: Event & { currentTarget: HTMLTextAreaElement }) => setDescription(e.currentTarget.value)}
                            />
                        </div>

                        <div class="form-row">
                            <UiSelect
                                label="Category"
                                value={category}
                                options={categoryOptions}
                                onchange={(e: any) => setCategory(e.detail)}
                            />

                            <UiSelect
                                label="Priority"
                                value={priority}
                                options={priorityOptions}
                                onchange={(e: any) => setPriority(e.detail)}
                            />
                        </div>

                        <div class="form-row">
                            <UiInput
                                label="Due Date"
                                type="date"
                                value={dueDate}
                                oninput={(e: any) => setDueDate(e.detail)}
                            />

                            {isEditing && (
                                <UiSelect
                                    label="Status"
                                    value={status}
                                    options={statusOptions}
                                    onchange={(e: any) => setStatus(e.detail)}
                                />
                            )}
                        </div>

                        <div class="form-actions">
                            <UiButton type="button" variant="secondary" onclick={() => dispatchClose()}>
                                Cancel
                            </UiButton>
                            <UiButton type="submit" variant="primary">
                                {isEditing ? "Save Changes" : "Create Task"}
                            </UiButton>
                        </div>
                    </form>
                </div>
            </host>
        );
    },
    {
        props: {
            task: { type: Object, value: () => ({}) },
            active: { type: Boolean, value: () => false, reflect: true }
        },
        styles: css`
            :host {
                display: none;
                position: fixed;
                inset: 0;
                z-index: 100;
                align-items: center;
                justify-content: center;
                padding: 1.5rem;
            }
            :host([active]) {
                display: flex;
            }
            .backdrop {
                position: absolute;
                inset: 0;
                background-color: rgba(15, 23, 42, 0.4);
                backdrop-filter: blur(8px);
                transition: all 0.3s ease;
            }
            .modal {
                position: relative;
                width: 100%;
                max-width: 520px;
                background: #ffffff;
                border-radius: 20px;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                border: 1px solid #f1f5f9;
                display: flex;
                flex-direction: column;
                z-index: 101;
                animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            }
            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(20px) scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1.25rem 1.5rem;
                border-bottom: 1px solid #f1f5f9;
            }
            h2 {
                margin: 0;
                font-size: 1.25rem;
                font-weight: 700;
                color: #0f172a;
            }
            .close-btn {
                background: none;
                border: none;
                padding: 0.375rem;
                border-radius: 50%;
                color: #64748b;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
            }
            .close-btn:hover {
                background-color: #f1f5f9;
                color: #0f172a;
            }
            .close-btn svg {
                width: 1.25rem;
                height: 1.25rem;
            }
            .form-body {
                padding: 1.5rem;
                display: flex;
                flex-direction: column;
                gap: 1.25rem;
            }
            .form-field {
                display: flex;
                flex-direction: column;
                gap: 0.375rem;
            }
            .field-label {
                font-size: 0.8125rem;
                font-weight: 600;
                color: #4b5563;
            }
            .textarea-field {
                font-family: inherit;
                font-size: 0.875rem;
                padding: 0.625rem 0.875rem;
                border: 1px solid #d1d5db;
                border-radius: 8px;
                background-color: #ffffff;
                color: #1f2937;
                outline: none;
                min-height: 100px;
                resize: vertical;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
            }
            .textarea-field:focus {
                border-color: #2563eb;
                box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
            }
            .form-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1rem;
            }
            @media (max-width: 480px) {
                .form-row {
                    grid-template-columns: 1fr;
                }
            }
            .form-actions {
                display: flex;
                justify-content: flex-end;
                gap: 0.75rem;
                margin-top: 0.5rem;
            }
        `
    }
);
