import { c, css, event, useProp, useRef } from "atomico";
interface Task {
    checked: boolean;
    message: string;
}

const MyTodo = c(
    ({ changeTodo }) => {
        const [task, setTask] = useProp<Task[]>("task");
        const ref = useRef<HTMLInputElement>();

        return (
            <host shadowDom>
                <form
                    onsubmit={(event) => {
                        event.preventDefault();
                        const { value } = ref.current;

                        if (!value) return;

                        setTask([
                            ...task,
                            {
                                checked: false,
                                message: value
                            }
                        ]);

                        event.currentTarget.reset();

                        changeTodo();
                    }}
                >
                    <input
                        ref={ref}
                        type="text"
                        placeholder="Write task"
                        name="rango"
                    />
                    <button>Create task</button>
                </form>
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
                            changeTodo();
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
            },
            changeTodo: event()
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
