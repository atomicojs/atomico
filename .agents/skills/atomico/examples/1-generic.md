# Example: Generic Component

A generic web component summarizing the basics of Atomico 2.0:

```tsx
import { c, css, useProp } from "atomico";

export const UserCard = c(
    ({ name, role }) => {
        const [active, setActive] = useProp("active");

        return (
            <host shadowDom>
                <div class="card">
                    <h2>{name}</h2>
                    <p>{role}</p>
                    <button onclick={() => setActive(!active)}>
                        {active ? "Deactivate" : "Activate"}
                    </button>
                </div>
            </host>
        );
    },
    {
        props: {
            name: { type: String, value: () => "Guest" },
            role: { type: String, value: () => "Visitor" },
            active: { type: Boolean, reflect: true }
        },
        styles: css`
            :host {
                display: block;
                border: 1px solid #ccc;
                padding: 1rem;
                border-radius: 8px;
            }
            :host([active]) {
                border-color: green;
                background: #eaffea;
            }
        `
    }
);

customElements.define("user-card", UserCard);
```
