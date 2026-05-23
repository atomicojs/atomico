# Example: Todo App

A component handling array rendering and event dispatching.

```tsx
import { c, css, useProp, useEvent } from "atomico";

export const TodoList = c(
    ({ title }) => {
        const [tasks, setTasks] = useProp("tasks");
        const dispatchAdd = useEvent("add-task", { bubbles: true });

        const onFormSubmit = (e) => {
            e.preventDefault();
            const input = e.target.elements.task;
            const newTask = { id: Date.now(), text: input.value, done: false };
            
            // Dispatch event for parents to listen to
            dispatchAdd(newTask);
            
            // Update internal state
            setTasks([...tasks, newTask]);
            input.value = "";
        };

        const toggleTask = (id) => {
            setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
        };

        return (
            <host shadowDom>
                <h2>{title}</h2>
                <form onsubmit={onFormSubmit}>
                    <input name="task" required />
                    <button type="submit">Add</button>
                </form>
                <ul>
                    {tasks.map(task => (
                        <li key={task.id} class={task.done ? "done" : ""}>
                            <input 
                                type="checkbox" 
                                checked={task.done} 
                                onchange={() => toggleTask(task.id)} 
                            />
                            {task.text}
                        </li>
                    ))}
                </ul>
            </host>
        );
    },
    {
        props: {
            title: { type: String, value: () => "My Tasks" },
            tasks: { type: Array, value: () => [] }
        },
        styles: css`
            :host { display: block; }
            .done { text-decoration: line-through; color: gray; }
        `
    }
);

customElements.define("todo-list", TodoList);
```
