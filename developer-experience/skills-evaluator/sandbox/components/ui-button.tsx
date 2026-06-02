import { c, css, useInternals, useProp } from "atomico";

export const UiButton = c(
    () => {
        const internals = useInternals();
        const [type] = useProp("type");
        const [disabled] = useProp("disabled");

        const handleClick = (e: Event) => {
            if (disabled) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }
            if (type === "submit" && internals.form) {
                internals.form.requestSubmit();
            }
        };

        return (
            <host shadowDom onclick={handleClick}>
                <button class="btn" disabled={disabled} type={type === "submit" ? "submit" : "button"}>
                    <slot />
                </button>
            </host>
        );
    },
    {
        form: true,
        props: {
            variant: { type: String, value: () => "primary", reflect: true },
            type: { type: String, value: () => "button" },
            disabled: { type: Boolean, value: () => false, reflect: true }
        },
        styles: css`
            :host {
                display: inline-block;
                cursor: pointer;
            }
            :host([disabled]) {
                cursor: not-allowed;
                pointer-events: none;
            }
            .btn {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 100%;
                padding: 0.625rem 1.25rem;
                font-family: inherit;
                font-size: 0.875rem;
                font-weight: 500;
                border-radius: 8px;
                border: 1px solid transparent;
                background-color: var(--btn-bg, #2563eb);
                color: var(--btn-color, #ffffff);
                outline: none;
                cursor: inherit;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
            }
            .btn:hover {
                background-color: var(--btn-hover-bg, #1d4ed8);
                transform: translateY(-1px);
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            }
            .btn:active {
                transform: translateY(0);
                box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
            }
            .btn:focus-visible {
                ring: 2px solid var(--btn-ring, #93c5fd);
                outline: 2px solid transparent;
                outline-offset: 2px;
            }
            
            :host([variant="primary"]) {
                --btn-bg: #2563eb;
                --btn-hover-bg: #1d4ed8;
                --btn-color: #ffffff;
                --btn-ring: #93c5fd;
            }
            :host([variant="secondary"]) {
                --btn-bg: #f3f4f6;
                --btn-hover-bg: #e5e7eb;
                --btn-color: #1f2937;
                --btn-ring: #d1d5db;
                border: 1px solid #e5e7eb;
            }
            :host([variant="danger"]) {
                --btn-bg: #dc2626;
                --btn-hover-bg: #b91c1c;
                --btn-color: #ffffff;
                --btn-ring: #fca5a5;
            }
            :host([variant="success"]) {
                --btn-bg: #16a34a;
                --btn-hover-bg: #15803d;
                --btn-color: #ffffff;
                --btn-ring: #86efac;
            }
            :host([disabled]) .btn {
                background-color: #e5e7eb;
                color: #9ca3af;
                border-color: #e5e7eb;
                box-shadow: none;
                transform: none;
            }
        `
    }
);
