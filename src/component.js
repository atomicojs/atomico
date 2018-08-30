import { root } from "./vdom/dom";
import { diff } from "./vdom/diff";
import { concat } from "./vdom/vdom";
import { getProps } from "./utils";
export default class extends HTMLElement {
    constructor() {
        super();
        this.autorun();
    }
    static get observedAttributes() {
        return this.props || [];
    }
    autorun() {
        this.state = {};
        this.props = { children: [] };
        this._props = this.constructor.props || [];
        this._render = [];

        let block = true;
        ["create", "mount", "unmount", "receiveProp", "receiveChildren"].map(
            type => {
                let method = type.replace(
                    /\w/,
                    letter => "on" + letter.toUpperCase()
                );
                this.addEventListener(type, event => {
                    if (event.type !== type) return;

                    if (type === "mount") {
                        this.props = getProps(this._props, this);
                        block = false;
                    }
                    if (block) return;
                    if (this[method]) this[method](event);

                    if (event.defaultPrevented) return;
                    if (type === "receiveProp") {
                        this.props = { ...this.props, ...event.detail };
                    }
                    if (type === "receiveChildren") {
                        this.props.children = event.detail;
                    }
                    this.setState({});
                });
            }
        );
    }
    connectedCallback() {
        this.dispatch("mount");
    }
    disconnectedCallback() {
        this.dispatch("unmount");
    }
    attributeChangedCallback(index, prev, next) {
        if (prev === next) return;
        this.dispatch("receiveProp", getProps([index], { [index]: next }));
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
