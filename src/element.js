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
        this.props = {};
        this.fragment = document.createDocumentFragment();
        this._props = this.constructor.props || [];
        this._render = [];
        this._mount;
        this.livecycle();
    }
    static get observedAttributes() {
        return this.props || [];
    }
    livecycle() {
        this.listeners = [MOUNT, UNMOUNT, RECEIVE_PROPS].map(type => {
            let handler = event => {
                if (!this._mount) return;

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
            if (this._mount) {
                this.attributeChangedCallback(prop, this.props[prop], value);
            } else {
                getProps([prop], { [prop]: value }, this.props);
            }
        } else {
            super.setAttribute(prop, value);
        }
    }
    /**
     * By default the children and properties are extracted
     * only when the component exists in the document
     * This is required for the component to be read regardless
     * of the load instance
     */
    connectedCallback() {
        this._mount = true;
        this.props = { ...getProps(this._props, this), ...this.props };
        this.props.children = [];
        while (this.firstChild) {
            let child = this.firstChild,
                slot = child.getAttribute && child.getAttribute("slot");
            if (slot) {
                this.slots[slot] = child;
            }
            append(this.fragment, child);
            this.props.children.push(child);
        }
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
