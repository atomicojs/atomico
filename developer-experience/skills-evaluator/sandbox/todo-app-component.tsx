import { c, css, useState, useEffect, useObjectState } from "atomico";
import { DashboardStats } from "./components/dashboard-stats.js";
import { TaskItem } from "./components/task-item.js";
import { TaskForm } from "./components/task-form.js";
import { UiInput } from "./components/ui-input.js";
import { UiSelect } from "./components/ui-select.js";
import { UiButton } from "./components/ui-button.js";

interface Task {
    id: string;
    title: string;
    description: string;
    category: string;
    priority: "High" | "Medium" | "Low";
    dueDate: string;
    status: "Pending" | "In Progress" | "Completed";
}

interface FilterState {
    searchQuery: string;
    statusFilter: string;
    priorityFilter: string;
    categoryFilter: string;
    sortBy: string;
}

const DEFAULT_TASKS: Task[] = [
    {
        id: "1",
        title: "Build elegant Atomico.js application",
        description: "Develop a highly polished, fully functional Task Management Dashboard with Custom Elements.",
        category: "Work",
        priority: "High",
        dueDate: new Date().toISOString().split('T')[0],
        status: "In Progress"
    },
    {
        id: "2",
        title: "Review Design System tokens",
        description: "Check CSS custom property scopes, color palettes, and component responsiveness.",
        category: "Work",
        priority: "Medium",
        dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        status: "Pending"
    },
    {
        id: "3",
        title: "Weekly grocery list items",
        description: "Organic apples, almond milk, whole grain sourdough, and fresh greens.",
        category: "Shopping",
        priority: "Low",
        dueDate: new Date(Date.now() + 172800000).toISOString().split('T')[0],
        status: "Completed"
    }
];

export const TodoApp = c(
    () => {
        const [tasks, setTasks] = useState<Task[]>(() => {
            try {
                const stored = localStorage.getItem("atomico_tasks");
                return stored ? JSON.parse(stored) : DEFAULT_TASKS;
            } catch {
                return DEFAULT_TASKS;
            }
        });

        // ✅ Grouped filters and sorting options in a single useObjectState hook
        const [filterState, setFilterState] = useObjectState<FilterState>({
            searchQuery: "",
            statusFilter: "All",
            priorityFilter: "All",
            categoryFilter: "All",
            sortBy: "dueDateAsc"
        });

        const [editingTask, setEditingTask] = useState<Task | null>(null);
        const [isFormActive, setIsFormActive] = useState(false);

        // Persist tasks in localStorage
        useEffect(() => {
            localStorage.setItem("atomico_tasks", JSON.stringify(tasks));
        }, [tasks]);

        const handleTaskSubmit = (e: CustomEvent<any>) => {
            const taskData = e.detail;
            if (taskData.id) {
                // Editing existing task
                setTasks(prev => prev.map(t => t.id === taskData.id ? { ...t, ...taskData } : t));
            } else {
                // Creating new task
                const newTask: Task = {
                    ...taskData,
                    id: Date.now().toString(),
                    status: "Pending"
                };
                setTasks(prev => [newTask, ...prev]);
            }
            setIsFormActive(false);
            setEditingTask(null);
        };

        const handleTaskDelete = (e: CustomEvent<string>) => {
            const id = e.detail;
            setTasks(prev => prev.filter(t => t.id !== id));
        };

        const handleTaskToggle = (e: CustomEvent<{ id: string; completed: boolean }>) => {
            const { id, completed } = e.detail;
            setTasks(prev => prev.map(t => {
                if (t.id !== id) return t;
                if (completed) {
                    return { ...t, status: "Completed" };
                } else {
                    // Cycle: Pending -> In Progress -> Completed -> Pending
                    let nextStatus: "Pending" | "In Progress" | "Completed" = "Pending";
                    if (t.status === "Completed") nextStatus = "Pending";
                    else if (t.status === "Pending") nextStatus = "In Progress";
                    else if (t.status === "In Progress") nextStatus = "Completed";
                    return { ...t, status: nextStatus };
                }
            }));
        };

        const handleEditTrigger = (e: CustomEvent<Task>) => {
            setEditingTask(e.detail);
            setIsFormActive(true);
        };

        const handleCreateTrigger = () => {
            setEditingTask(null);
            setIsFormActive(true);
        };

        // Filter computations using filterState properties
        const filteredTasks = tasks.filter(t => {
            const matchesSearch = t.title.toLowerCase().includes(filterState.searchQuery.toLowerCase()) ||
                                  t.description.toLowerCase().includes(filterState.searchQuery.toLowerCase());
            const matchesStatus = filterState.statusFilter === "All" || t.status === filterState.statusFilter;
            const matchesPriority = filterState.priorityFilter === "All" || t.priority === filterState.priorityFilter;
            const matchesCategory = filterState.categoryFilter === "All" || t.category === filterState.categoryFilter;
            return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
        });

        // Sort computations
        const sortedTasks = [...filteredTasks].sort((a, b) => {
            if (filterState.sortBy === "dueDateAsc") {
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
            }
            if (filterState.sortBy === "dueDateDesc") {
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
            }
            if (filterState.sortBy === "priority") {
                const weights = { High: 3, Medium: 2, Low: 1 };
                return weights[b.priority] - weights[a.priority];
            }
            if (filterState.sortBy === "alphabetical") {
                return a.title.localeCompare(b.title);
            }
            return 0;
        });

        // Stats computations
        const totalCount = tasks.length;
        const completedCount = tasks.filter(t => t.status === "Completed").length;
        const inProgressCount = tasks.filter(t => t.status === "In Progress").length;
        const pendingCount = tasks.filter(t => t.status === "Pending").length;

        // Select lists
        const statusOptions = [
            { value: "All", label: "All Statuses" },
            { value: "Pending", label: "Pending" },
            { value: "In Progress", label: "In Progress" },
            { value: "Completed", label: "Completed" }
        ];

        const priorityOptions = [
            { value: "All", label: "All Priorities" },
            { value: "High", label: "High" },
            { value: "Medium", label: "Medium" },
            { value: "Low", label: "Low" }
        ];

        const categoryOptions = [
            { value: "All", label: "All Categories" },
            { value: "Work", label: "Work" },
            { value: "Personal", label: "Personal" },
            { value: "Shopping", label: "Shopping" },
            { value: "Urgent", label: "Urgent" }
        ];

        const sortOptions = [
            { value: "dueDateAsc", label: "Due Date (Oldest)" },
            { value: "dueDateDesc", label: "Due Date (Newest)" },
            { value: "priority", label: "Priority (High to Low)" },
            { value: "alphabetical", label: "Alphabetical" }
        ];

        return (
            <host shadowDom>
                <div class="dashboard-container">
                    <header class="dashboard-header">
                        <div class="header-left">
                            <h1>Task Board</h1>
                            <p class="subtitle">State-of-the-art productivity manager and planner</p>
                        </div>
                        <div class="header-right">
                            <UiButton variant="primary" onclick={handleCreateTrigger}>
                                <svg class="plus-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                                Add Task
                            </UiButton>
                        </div>
                    </header>

                    <section class="stats-section">
                        <DashboardStats
                            total={totalCount}
                            completed={completedCount}
                            inProgress={inProgressCount}
                            pending={pendingCount}
                        />
                    </section>

                    <section class="controls-section">
                        <div class="search-bar">
                            <UiInput
                                placeholder="Search by title or description..."
                                value={filterState.searchQuery}
                                oninput={(e: any) => setFilterState({ searchQuery: e.detail })}
                            />
                        </div>
                        <div class="filters-grid">
                            <UiSelect
                                value={filterState.statusFilter}
                                options={statusOptions}
                                onchange={(e: any) => setFilterState({ statusFilter: e.detail })}
                            />
                            <UiSelect
                                value={filterState.priorityFilter}
                                options={priorityOptions}
                                onchange={(e: any) => setFilterState({ priorityFilter: e.detail })}
                            />
                            <UiSelect
                                value={filterState.categoryFilter}
                                options={categoryOptions}
                                onchange={(e: any) => setFilterState({ categoryFilter: e.detail })}
                            />
                            <UiSelect
                                value={filterState.sortBy}
                                options={sortOptions}
                                onchange={(e: any) => setFilterState({ sortBy: e.detail })}
                            />
                        </div>
                    </section>

                    <section class="tasks-section">
                        {sortedTasks.length > 0 ? (
                            <div class="tasks-grid">
                                {sortedTasks.map(t => (
                                    <TaskItem
                                        key={t.id}
                                        task={t}
                                        ontoggle-status={handleTaskToggle}
                                        ondelete-task={handleTaskDelete}
                                        onedit-task={handleEditTrigger}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div class="empty-state">
                                <div class="empty-illustration">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                        <polyline points="14 2 14 8 20 8"></polyline>
                                        <line x1="9" y1="15" x2="15" y2="15"></line>
                                        <line x1="9" y1="11" x2="15" y2="11"></line>
                                        <line x1="9" y1="19" x2="15" y2="19"></line>
                                    </svg>
                                </div>
                                <h4>No tasks found</h4>
                                <p>Try clearing filters or create a new task to get started.</p>
                                <UiButton variant="secondary" onclick={handleCreateTrigger}>
                                    Create a Task
                                </UiButton>
                            </div>
                        )}
                    </section>

                    <TaskForm
                        active={isFormActive}
                        task={editingTask || {}}
                        onsubmit-task={handleTaskSubmit}
                        onclose={() => {
                            setIsFormActive(false);
                            setEditingTask(null);
                        }}
                    />
                </div>
            </host>
        );
    },
    {
        styles: css`
            :host {
                display: block;
                width: 100%;
                max-width: 1140px;
                margin: 0 auto;
                padding: 2rem 1.5rem;
                box-sizing: border-box;
            }
            .dashboard-container {
                display: flex;
                flex-direction: column;
                gap: 1.75rem;
                width: 100%;
            }
            .dashboard-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid #e2e8f0;
                padding-bottom: 1.25rem;
            }
            @media (max-width: 640px) {
                .dashboard-header {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 1rem;
                }
                .header-right {
                    width: 100%;
                }
            }
            h1 {
                margin: 0;
                font-size: 2.25rem;
                font-weight: 800;
                color: #0f172a;
                letter-spacing: -0.025em;
                background: linear-gradient(135deg, #0f172a 0%, #2563eb 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
            .subtitle {
                margin: 0.375rem 0 0 0;
                font-size: 0.9375rem;
                color: #64748b;
            }
            .plus-icon {
                width: 1.125rem;
                height: 1.125rem;
                margin-right: 0.5rem;
            }
            .stats-section {
                width: 100%;
            }
            .controls-section {
                display: flex;
                flex-direction: column;
                gap: 0.875rem;
                background-color: #ffffff;
                padding: 1.25rem;
                border-radius: 16px;
                border: 1px solid rgba(229, 231, 235, 0.7);
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.01);
            }
            .filters-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 0.75rem;
            }
            @media (max-width: 768px) {
                .filters-grid {
                    grid-template-columns: 1fr 1fr;
                }
            }
            @media (max-width: 480px) {
                .filters-grid {
                    grid-template-columns: 1fr;
                }
            }
            .tasks-section {
                width: 100%;
            }
            .tasks-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                gap: 1.25rem;
            }
            @media (max-width: 480px) {
                .tasks-grid {
                    grid-template-columns: 1fr;
                }
            }
            .empty-state {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 4rem 2rem;
                background-color: #ffffff;
                border-radius: 20px;
                border: 1px dashed #cbd5e1;
                text-align: center;
            }
            .empty-illustration {
                width: 4rem;
                height: 4rem;
                color: #94a3b8;
                margin-bottom: 1.25rem;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: #f8fafc;
                border-radius: 50%;
                padding: 1rem;
            }
            .empty-illustration svg {
                width: 100%;
                height: 100%;
            }
            .empty-state h4 {
                margin: 0;
                font-size: 1.125rem;
                font-weight: 700;
                color: #0f172a;
            }
            .empty-state p {
                margin: 0.5rem 0 1.5rem 0;
                font-size: 0.875rem;
                color: #64748b;
                max-width: 320px;
            }
        `
    }
);
