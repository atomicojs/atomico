import { c, css, useProp, useEvent } from "atomico";

export const UiCheckbox = c(
    () => {
        const [checked, setChecked] = useProp("checked");
        const [disabled] = useProp("disabled");
        const dispatchChange = useEvent("change", { bubbles: true });

        const handleToggle = (e: Event) => {
            if (disabled) return;
            const nextChecked = !checked;
            setChecked(nextChecked);
            dispatchChange(nextChecked);
        };

        return (
            <host shadowDom onclick={handleToggle}>
                <div class="checkbox-wrapper">
                    <div class="box">
                        <svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </div>
                    <span class="label">
                        <slot />
                    </span>
                </div>
            </host>
        );
    },
    {
        props: {
            checked: { type: Boolean, value: () => false, reflect: true },
            disabled: { type: Boolean, value: () => false, reflect: true }
        },
        styles: css`
            :host {
                display: inline-block;
                cursor: pointer;
                user-select: none;
            }
            :host([disabled]) {
                cursor: not-allowed;
                opacity: 0.5;
            }
            .checkbox-wrapper {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            .box {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 1.25rem;
                height: 1.25rem;
                border: 2px solid #d1d5db;
                border-radius: 4px;
                background-color: #ffffff;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .check-icon {
                width: 0.75rem;
                height: 0.75rem;
                color: #ffffff;
                transform: scale(0);
                transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            :host([checked]) .box {
                background-color: #2563eb;
                border-color: #2563eb;
                box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
            }
            :host([checked]) .check-icon {
                transform: scale(1);
            }
            :host(:hover:not([disabled])) .box {
                border-color: #2563eb;
            }
            .label {
                font-size: 0.875rem;
                color: #374151;
            }
        `
    }
);
