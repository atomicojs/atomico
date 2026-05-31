import { c, css, useProp } from "atomico";

export const CustomInput = c(
    () => {
        const [value = "", setValue] = useProp("value");

        return (
            <host shadowDom>
                <div class="input-wrapper">
                    <input
                        type="text"
                        value={value}
                        oninput={({ currentTarget }) => setValue(currentTarget.value)}
                        placeholder="Enter text..."
                        class="input-field"
                    />
                </div>
            </host>
        );
    },
    {
        props: {
            value: {
                type: String,
                reflect: true,
                value: () => ""
            }
        },
        styles: css`
            :host {
                display: block;
                font-family: 'Inter', system-ui, sans-serif;
                --input-bg: #f9fafb;
                --input-border: #d1d5db;
                --input-focus-border: #6366f1;
                --input-focus-ring: rgba(99, 102, 241, 0.15);
                --input-text: #111827;
                --input-placeholder: #9ca3af;
                width: 100%;
                max-width: 320px;
            }

            .input-wrapper {
                position: relative;
                width: 100%;
            }

            .input-field {
                width: 100%;
                padding: 0.75rem 1rem;
                font-size: 0.95rem;
                font-family: inherit;
                color: var(--input-text);
                background-color: var(--input-bg);
                border: 1.5px solid var(--input-border);
                border-radius: 10px;
                outline: none;
                transition: all 0.2s ease-in-out;
                box-sizing: border-box;
            }

            .input-field::placeholder {
                color: var(--input-placeholder);
            }

            .input-field:focus {
                border-color: var(--input-focus-border);
                background-color: #ffffff;
                box-shadow: 0 0 0 4px var(--input-focus-ring);
            }

            .input-field:hover:not(:focus) {
                border-color: #9ca3af;
            }
        `
    }
);

customElements.define("custom-input", CustomInput);
