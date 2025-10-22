import { c, event, useRef } from "atomico";

export const TodoForm = c(
    ({ createTask }) => {
        const ref = useRef<HTMLInputElement>();
        return (
            <host shadowDom>
                <form
                    onsubmit={(event) => {
                        event.preventDefault();
                        const { value } = ref.current;
                        const message = value.trim();
                        if (message) createTask(ref.current.value);
                        event.currentTarget.reset();
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
            </host>
        );
    },
    {
        props: {
            createTask: event<string>()
        }
    }
);

customElements.define("todo-form", TodoForm);
