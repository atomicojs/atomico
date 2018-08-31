import { MOUNT, UNMOUNT, RECEIVE_PROPS, ELEMENT } from "./constants";

import { diff } from "./diff";
import { concat } from "./vdom";
import { getProps, root } from "./utils";

export default class extends HTMLElement {
    constructor() {
        super();
        this.autorun();
    }
    static get observedAttributes() {
        return this.props || [];
    }
    autorun() {
        this[ELEMENT] = true;
        this.state = {};
        this.props = { children: [] };
        this._props = this.constructor.props || [];
        this._render = [];

        let prevent = true;

        this.listeners = [MOUNT, UNMOUNT, RECEIVE_PROPS].map(type => {
            let handler = event => {
                if (event.type !== type) return;

                if (type === MOUNT) {
                    this.props = { ...getProps(this._props, this) };
                    prevent = false;
                }

                if (prevent) return;

                if (this[type]) this[type](event);

                if (event.defaultPrevented) return;

                if (type === RECEIVE_PROPS) {
                    this.props = { ...this.props, ...event.detail };
                }
                this.setState({});
            };
            this.addEventListener(type, handler);
            return () => this.removeEventListener(type, handler);
        });
    }
    connectedCallback() {
        this.dispatch(MOUNT);
    }
    disconnectedCallback() {
        this.dispatch(UNMOUNT);
        this.listeners.forEach(handler => handler());
    }
    attributeChangedCallback(index, prev, next) {
        if (prev === next) return;
        this.dispatch(RECEIVE_PROPS, getProps([index], { [index]: next }));
    }
    dispatch(type, detail) {
        this.dispatchEvent(
            new CustomEvent(type, {
                cancelable: true,
                detail
            })
        );
    }
    setState(next) {
        if (!next) return;
        this.state = { ...this.state, ...next };
        let render = concat([this.render()]);
        diff(root(this), this._render, render);
        this._render = render;
    }
    render() {}
}
