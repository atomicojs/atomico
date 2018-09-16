import { MOUNT, UNMOUNT, RECEIVE_PROPS, ELEMENT } from "./constants";

import { diff } from "./diff";
import { concat } from "./vdom";
import { getProps, root, append } from "./utils";

export default class extends HTMLElement {
    constructor() {
        super();
        this[ELEMENT] = true;
        this.state = {};
        this.slots = {};
        this._props = this.constructor.props || [];
        this._render = [];
        this.props = getProps(this._props, this);
        this.props.children = [];
        this.fragment = document.createDocumentFragment();
        while (this.firstChild) {
            let child = this.firstChild,
                slot = child.getAttribute && child.getAttribute("slot");
            if (slot) {
                this.slots[slot] = child;
            }
            append(this.fragment, child);
            this.props.children.push(child);
        }
        this.livecycle();
    }

    static get observedAttributes() {
        return this.props || [];
    }
    livecycle() {
        let prevent = true;
        this.listeners = [MOUNT, UNMOUNT, RECEIVE_PROPS].map(type => {
            let handler = event => {
                if (event.type !== type) return;

                if (type === MOUNT) {
                    prevent = false;
                }

                if (prevent) return;

                if (this[type]) this[type](event);

                if (event.defaultPrevented) return;

                if (type === RECEIVE_PROPS) {
                    this.props = getProps(
                        Object.keys(event.detail),
                        event.detail,
                        { ...this.props }
                    );
                }
                this.setState({});
            };
            this.addEventListener(type, handler);
            return () => this.removeEventListener(type, handler);
        });
    }
    setAttribute(prop, value) {
        if (this._props.indexOf(prop) > -1) {
            this.attributeChangedCallback(prop, this.props[prop], value);
        } else {
            super.setAttribute(prop, value);
        }
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
