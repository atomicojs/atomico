import { c, html, useProp } from "../../core.js";

function component() {
    return html`<host>
        ${1} ${2} ${3}
        <button>ok</button>
        <${Component3} data=${{ ok: 1 }} />
        <${Component2} count=${10} />
    </host>`;
}

component.props = {
    range: {
        type: Number,
        value: 100,
    },
};

customElements.define("my-component", c(component));

function component2() {
    const [count, setCount] = useProp("count");
    return html`<host shadowDom>
        <button onclick=${() => setCount(count + 1)}>increment</button>
        <span>${count}</span>
        <button onclick=${() => setCount(count - 1)}>decrement</button>
    </host>`;
}

component2.props = {
    count: {
        type: Number,
        value: 0,
    },
};

const Component2 = c(component2);

customElements.define("my-component-2", Component2);

function component3() {
    const [count, setCount] = useProp("count");
    return html`<host>
        <button onclick=${() => setCount(count + 1)}>increment</button>
        <span>${count}</span>
        <button onclick=${() => setCount(count - 1)}>decrement</button>
    </host>`;
}

component3.props = {
    count: {
        type: Number,
        value: 0,
    },
    data: Object,
};

const Component3 = c(component3, HTMLAnchorElement);

customElements.define("my-component-3", Component3, { extends: "a" });
