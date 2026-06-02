import { c, css, useProp, useEvent } from "atomico";

export const UiSelect = c(
    () => {
        const [value, setValue] = useProp("value");
        const [options] = useProp("options");
        const [label] = useProp("label");
        const [required] = useProp("required");

        const dispatchChange = useEvent("change", { bubbles: true });

        const handleChange = (e: Event & { currentTarget: HTMLSelectElement }) => {
            const val = e.currentTarget.value;
            setValue(val);
            dispatchChange(val);
        };

        return (
            <host shadowDom>
                <div class="select-container">
                    {label && <label class="label">{label}{required && <span class="required">*</span>}</label>}
                    <div class="select-wrapper">
                        <select
                            class="select-field"
                            value={value}
                            required={required}
                            onchange={handleChange}
                        >
                            {options.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                        <svg class="select-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </div>
                </div>
            </host>
        );
    },
    {
        props: {
            value: { type: String, value: () => "" },
            options: { type: Array, value: () => [] },
            label: { type: String, value: () => "" },
            required: { type: Boolean, value: () => false, reflect: true }
        },
        styles: css`
            :host {
                display: block;
                width: 100%;
            }
            .select-container {
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
            .select-wrapper {
                position: relative;
                width: 100%;
            }
            .select-field {
                font-family: inherit;
                font-size: 0.875rem;
                padding: 0.625rem 2rem 0.625rem 0.875rem;
                border: 1px solid #d1d5db;
                border-radius: 8px;
                background-color: #ffffff;
                color: #1f2937;
                outline: none;
                width: 100%;
                appearance: none;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
            }
            .select-field:focus {
                border-color: #2563eb;
                box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
            }
            .select-icon {
                position: absolute;
                right: 0.75rem;
                top: 50%;
                transform: translateY(-50%);
                width: 1rem;
                height: 1rem;
                color: #6b7280;
                pointer-events: none;
                transition: transform 0.2s ease;
            }
            .select-field:focus + .select-icon {
                color: #2563eb;
            }
        `
    }
);
