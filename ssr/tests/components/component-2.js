import { html, c, useProp } from "../../../core.js";

function component() {
    const [count, setCount] = useProp("count");
    return html`<host shadowDom>
        <button onclick=${() => setCount(count + 1)}>increment</button>
        <span>${count}</span>
        <button onclick=${() => setCount(count - 1)}>decrement</button>
    </host>`;
}

component.props = {
    count: {
        type: Number,
        value: 0,
    },
};

export const Component2 = c(component);

customElements.define("component-2", Component2);
