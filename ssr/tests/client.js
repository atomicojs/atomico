import { c, html, css, useProp, useEvent, useHost } from "../../core.js";

const useDispatchHydrate = () => {
    const host = useHost();
    const dispatch = useEvent("hydrate", { bubbles: true, composed: true });

    return () => dispatch(host.current);
};

function component() {
    const dispatchEvent = useDispatchHydrate();
    dispatchEvent();
    return html`<host shadowDom>
        ${1} ${2} ${3}
        <button>ok</button>
        <${Component3} />
        <${Component2} count=${10} />
    </host>`;
}

component.styles = css`
    :host {
        color: red;
        width: 200px;
        display: block;
        border: 1px solid red;
    }
`;

component.props = {
    range: {
        type: Number,
        value: 100,
    },
};

customElements.define("my-component", c(component));

function component2() {
    const dispatchEvent = useDispatchHydrate();
    dispatchEvent();
    const [count, setCount] = useProp("count");
    return html`<host>
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
    const dispatchEvent = useDispatchHydrate();
    dispatchEvent();
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
};

const Component3 = c(component3, HTMLAnchorElement);

customElements.define("my-component-3", Component3, { extends: "a" });
