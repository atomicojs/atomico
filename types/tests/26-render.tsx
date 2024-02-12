import { Host, c } from "core";

export const MyComponent = c({
    render: ({ message, count }): Host<{ onClick: Event }> => (
        <host>
            <h1>{message}</h1>
            <button onClick={count}></button>
        </host>
    ),
    props: {
        message: {
            type: String,
            reflect: true,
            value: (): "Yes" | "No" => "Yes"
        },
        count: {
            type: Number,
            value: 0
        }
    }
});

customElements.define("my-component", MyComponent);
