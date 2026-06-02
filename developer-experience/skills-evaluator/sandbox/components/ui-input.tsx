import { c, css, useProp, useEvent } from "atomico";

export const UiInput = c(
    () => {
        const [value, setValue] = useProp("value");
        const [placeholder] = useProp("placeholder");
        const [type] = useProp("type");
        const [label] = useProp("label");
        const [required] = useProp("required");

        const dispatchInput = useEvent("input", { bubbles: true });

        const handleInput = (e: any) => {
            // const val = e.currentTarget.value;
            // setValue(val);
            // dispatchInput(val);
        };

        return (
            <host shadowDom>
                <div class="input-container">
                    {label && <label class="label">{label}{required && <span class="required">*</span>}</label>}
                    <input
                        class="input-field"
                        type={type}
                        value={value}
                        placeholder={placeholder}
                        required={required}
                        oninput={handleInput}
                    />
                </div>
            </host>
        );
    },
    {
        props: {
            value: { type: String, value: () => "" },
            placeholder: { type: String, value: () => "" },
            type: { type: String, value: () => "text" },
            label: { type: String, value: () => "" },
            required: { type: Boolean, value: () => false, reflect: true }
        },
        styles: css`
            :host {
                display: block;
                width: 100%;
            }
            .input-container {
                display: flex;
                flex-direction: column;
                gap: 0.375rem;
                width: 100%;
            }
            .label {
                font-size: 0.8125rem;
                font-weight: 600;
                color: #4b5563;
                display: flex;
                align-items: center;
                gap: 0.25rem;
            }
            .required {
                color: #dc2626;
            }
            .input-field {
                font-family: inherit;
                font-size: 0.875rem;
                padding: 0.625rem 0.875rem;
                border: 1px solid #d1d5db;
                border-radius: 8px;
                background-color: #ffffff;
                color: #1f2937;
                outline: none;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
            }
            .input-field:focus {
                border-color: #2563eb;
                box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
            }
            .input-field::placeholder {
                color: #9ca3af;
            }
        `
    }
);
