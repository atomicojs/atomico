import { c, css, event, useRef } from "atomico";

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
            createTask: event<string>({ bubbles: true, composed: true })
        },
        styles: css`
            :host {
            }

            button {
                background: #9cbeff;
                border-radius: 0.5rem;
                padding: 0.5rem 1rem;
                border: none;
                cursor: pointer;
            }
            input {
                padding: 0.5rem;
                border: 1px solid #dcdce1;
                border-radius: 0.5rem;
                margin-right: 1rem;
            }
        `
    }
);

customElements.define("todo-form", TodoForm);
