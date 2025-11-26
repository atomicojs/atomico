import { c, css, event } from "atomico";

export const TodoTask = c(
    ({ checked, message, changeTask }) => {
        return (
            <host shadowDom>
                <label
                    class="checked"
                    onchange={(event) => {
                        const target = event.target as HTMLInputElement;
                        changeTask(target.checked);
                    }}
                >
                    <input type="checkbox" checked={checked} />
                    <span>{message}</span>
                </label>
            </host>
        );
    },
    {
        props: {
            changeTask: event<boolean>({
                bubbles: true,
                composed: true
            }),
            message: String,
            checked: {
                type: Boolean,
                reflect: true
            }
        },
        styles: css`
            :host {
                --background: #f0f0f9;
                --border: #dcdce1;
            }
            :host([checked]) {
                --background: #a3ebd4ff;
                --border: #6ee2c9ff;
            }
            label {
                display: block;
                background: var(--background);
                border: 1px solid var(--border);
                padding: 1rem;
                border-radius: 0.5rem;
                cursor: pointer;
            }
        `
    }
);

customElements.define("todo-task", TodoTask);
