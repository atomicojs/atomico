import { c, css, useProp, useRef } from "atomico";
import { TodoForm } from "./todo-form.js";
import { TodoTask } from "./todo-task.js";
interface Task {
    checked: boolean;
    message: string;
}

const MyTodo = c(
    () => {
        const [task, setTask] = useProp<Task[]>("task");
        const ref = useRef<typeof TodoForm>()
        ref.current.createTask("test")
        return (
            <host shadowDom>
                <TodoForm
                    oncreateTask={({ detail }) => {
                        setTask([...task, { checked: false, message: detail }]);
                    }}
                />
                {task.map((currentItem, index) => (
                    <TodoTask
                        message={currentItem.message}
                        checked={currentItem.checked}
                        onchangeTask={({ detail }) => {
                            setTask(
                                task.map((item, itemIndex) =>
                                    itemIndex === index
                                        ? { ...item, checked: detail }
                                        : item
                                )
                            );
                        }}
                    />
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
            }
        },
        styles: css`
            :host {
                display: grid;
                gap: 0.5rem;
            }
        `
    }
);

customElements.define("todo-app", MyTodo);
