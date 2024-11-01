import { c, useProp, css } from "atomico";

interface Task {
    checked: boolean;
    message: string;
}

const MyTodo = c(
    () => {
        const [task, setTask] = useProp<Task[]>("task");
        return (
            <host shadowDom>
                {task.map((currentItem) => (
                    <label
                        class={currentItem.checked ? "checked" : ""}
                        onchange={() => {
                            setTask(
                                task.map((item) =>
                                    item === currentItem
                                        ? {
                                              ...item,
                                              checked: !currentItem.checked
                                          }
                                        : item
                                )
                            );
                        }}
                    >
                        <input type="checkbox" checked={currentItem.checked} />
                        <span>{currentItem.message}</span>
                    </label>
                ))}
            </host>
        );
    },
    {
        props: {
            task: {
                type: Array,
                reflect: true,
                value: (): Task[] => [
                    {
                        checked: true,
                        message: "sample 1!"
                    },
                    {
                        checked: false,
                        message: "sample 2!"
                    }
                ]
            }
        },
        styles: css`
            :host {
                display: grid;
                gap: 0.5rem;
            }
            label {
                display: grid;
                grid-template-columns: 20px 1fr;
                border-radius: 0.25rem;
                padding: 0.5rem;
                box-sizing: border-box;
            }
            .checked {
                border: 1px solid black;
            }
        `
    }
);

customElements.define("atomico-todo", MyTodo);
