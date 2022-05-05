import { html, c, useProp } from "../../../core.js";

function component() {
    const [count, setCount] = useProp("count");
    return html`<host>
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
    data: Object,
};

export const Component3 = c(component, HTMLAnchorElement);

customElements.define("component-3", Component3, { extends: "a" });
