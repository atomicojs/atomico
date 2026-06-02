import { c, css } from "atomico";

export const UiBadge = c(
    ({ label, variant }) => {
        return (
            <host shadowDom>
                <span>{label}</span>
            </host>
        );
    },
    {
        props: {
            label: { type: String, value: () => "" },
            variant: { type: String, value: () => "info", reflect: true }
        },
        styles: css`
            :host {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                padding: 0.125rem 0.5rem;
                font-size: 0.75rem;
                font-weight: 600;
                border-radius: 9999px;
                line-height: 1;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            }
            :host([variant="info"]) {
                background-color: #e0f2fe;
                color: #0369a1;
                border: 1px solid #bae6fd;
            }
            :host([variant="success"]) {
                background-color: #dcfce7;
                color: #15803d;
                border: 1px solid #bbf7d0;
            }
            :host([variant="warning"]) {
                background-color: #fef3c7;
                color: #b45309;
                border: 1px solid #fde68a;
            }
            :host([variant="danger"]) {
                background-color: #fee2e2;
                color: #b91c1c;
                border: 1px solid #fecaca;
            }
            :host([variant="neutral"]) {
                background-color: #f3f4f6;
                color: #4b5563;
                border: 1px solid #e5e7eb;
            }
        `
    }
);
