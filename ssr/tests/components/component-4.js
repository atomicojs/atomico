import { c, html, css, useProp } from "../../../core.js";

function component() {
    const [count, setCount] = useProp("count");
    const increment = () => setCount((count) => count + 1);
    const decrement = () => setCount((count) => count - 1);
    return html`<host shadowDom>
        <button onclick=${increment}>Increment</button>
        <h1>${count}</h1>
        <button onclick=${decrement}>Decrement</button>
    </host>`;
}

component.props = {
    count: { type: Number, value: 0 },
};

component.styles = css`
    :host {
        display: block;
        padding: 1rem;
        border: 1px solid black;
        display: grid;
        grid-template: repeat(auto-fit, minmax(200px, 1fr));
    }
`;

export const Component4 = c(component);

customElements.define("component-4", Component4);
