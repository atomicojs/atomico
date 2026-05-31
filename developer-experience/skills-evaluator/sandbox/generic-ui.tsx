import { c, css } from "atomico";

export const UserProfileCard = c(
    ({ name, role }) => {
        return (
            <host shadowDom>
                <div class="card">
                    <div class="avatar-container">
                        <div class="avatar">
                            {name ? name.charAt(0).toUpperCase() : "U"}
                        </div>
                    </div>
                    <div class="info">
                        <h2 class="name">{name}</h2>
                        <p class="role">{role}</p>
                    </div>
                </div>
            </host>
        );
    },
    {
        props: {
            name: { type: String, value: () => "Guest" },
            role: { type: String, value: () => "Visitor" }
        },
        styles: css`
            :host {
                display: block;
                font-family: 'Inter', system-ui, sans-serif;
                --card-bg: #ffffff;
                --card-text: #1f2937;
                --card-subtext: #6b7280;
                --avatar-grad: linear-gradient(135deg, #818cf8, #6366f1);
                --card-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
                --card-hover-shadow: 0 20px 25px -5px rgba(99, 102, 241, 0.1), 0 10px 10px -6px rgba(99, 102, 241, 0.05);
                --card-border: 1px solid rgba(243, 244, 246, 1);
                max-width: 320px;
            }

            .card {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 2rem 1.5rem;
                background: var(--card-bg);
                border: var(--card-border);
                border-radius: 16px;
                box-shadow: var(--card-shadow);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                cursor: pointer;
            }

            .card:hover {
                transform: translateY(-5px);
                box-shadow: var(--card-hover-shadow);
                border-color: rgba(99, 102, 241, 0.2);
            }

            .avatar-container {
                margin-bottom: 1.25rem;
                position: relative;
            }

            .avatar {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 72px;
                height: 72px;
                font-size: 1.75rem;
                font-weight: 700;
                color: #ffffff;
                background: var(--avatar-grad);
                border-radius: 50%;
                box-shadow: 0 4px 10px rgba(99, 102, 241, 0.3);
            }

            .info {
                text-align: center;
            }

            .name {
                margin: 0 0 0.35rem 0;
                font-size: 1.25rem;
                font-weight: 700;
                color: var(--card-text);
            }

            .role {
                margin: 0;
                font-size: 0.9rem;
                font-weight: 500;
                color: var(--card-subtext);
                text-transform: uppercase;
                letter-spacing: 0.05em;
            }
        `
    }
);

customElements.define("user-profile-card", UserProfileCard);
