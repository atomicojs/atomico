import { c, css, event } from "atomico";

export const UiButton = c(
    (props) => {
        return (
            <host shadowDom>
                <button onclick={(e) => {
                    e.stopPropagation();
                    props.action();
                }} class="btn">
                    <slot></slot>
                </button>
            </host>
        );
    },
    {
        props: {
            variant: {
                type: String,
                reflect: true,
                value: () => "primary"
            },
            action: event({ bubbles: true, composed: true })
        },
        styles: css`
            :host {
                display: inline-block;
                --btn-bg: linear-gradient(135deg, #6366f1, #4f46e5);
                --btn-color: #ffffff;
                --btn-border: none;
                --btn-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);
                --btn-hover-bg: linear-gradient(135deg, #4f46e5, #4338ca);
                --btn-hover-shadow: 0 6px 16px rgba(79, 70, 229, 0.35);
                --btn-active-scale: 0.96;
                font-family: 'Inter', system-ui, sans-serif;
            }

            :host([variant="secondary"]) {
                --btn-bg: linear-gradient(135deg, #4b5563, #374151);
                --btn-color: #f3f4f6;
                --btn-shadow: 0 4px 12px rgba(55, 65, 81, 0.2);
                --btn-hover-bg: linear-gradient(135deg, #374151, #1f2937);
                --btn-hover-shadow: 0 6px 16px rgba(55, 65, 81, 0.3);
            }

            :host([variant="danger"]) {
                --btn-bg: linear-gradient(135deg, #ef4444, #dc2626);
                --btn-color: #ffffff;
                --btn-shadow: 0 4px 12px rgba(220, 38, 38, 0.25);
                --btn-hover-bg: linear-gradient(135deg, #dc2626, #b91c1c);
                --btn-hover-shadow: 0 6px 16px rgba(220, 38, 38, 0.35);
            }

            :host([variant="outline"]) {
                --btn-bg: transparent;
                --btn-color: #6366f1;
                --btn-border: 2px solid #6366f1;
                --btn-shadow: none;
                --btn-hover-bg: rgba(99, 102, 241, 0.08);
                --btn-hover-shadow: 0 4px 12px rgba(99, 102, 241, 0.1);
            }

            .btn {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                padding: 0.75rem 1.5rem;
                font-size: 0.95rem;
                font-weight: 600;
                line-height: 1.25;
                color: var(--btn-color);
                background: var(--btn-bg);
                border: var(--btn-border);
                border-radius: 10px;
                cursor: pointer;
                box-shadow: var(--btn-shadow);
                transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                user-select: none;
                outline: none;
            }

            .btn:hover {
                background: var(--btn-hover-bg);
                box-shadow: var(--btn-hover-shadow);
                transform: translateY(-2px);
            }

            .btn:active {
                transform: translateY(0) scale(var(--btn-active-scale));
                box-shadow: var(--btn-shadow);
            }

            .btn:focus-visible {
                outline: 2px solid #818cf8;
                outline-offset: 2px;
            }
        `
    }
);

customElements.define("ui-button", UiButton);
