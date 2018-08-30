import { getMethods, getEvents, getProps } from "./utils";
import { diff } from "./vdom/diff";
import { concat, h } from "./vdom/vdom";

export class Component {
    constructor(root) {
        this.root = root;
        this.props = {};
        this.state = {};
        let _prev = [];
        this.setState = (state = {}) => {
            this.state = { ...this.state, ...state };
            let render = concat([this.render()]);
            diff(this.root, _prev, render);
            _prev = render;
        };
    }
    onMount() {}
    onUpdate() {}
    onUnmount() {}
    onRender(event) {
        this.setState();
    }
    render() {}
}

export function register(tagName, Root) {
    let _props = Root.props || [],
        _events = getEvents(Root);
    customElements.define(
        tagName,
        class extends HTMLElement {
            constructor() {
                super();
                this.autorun();
                this.root = new Root(this);
            }
            static get observedAttributes() {
                return _props;
            }
            autorun() {
                _events.forEach(({ type, method }) => {
                    this.addEventListener(
                        type,
                        event => {
                            this.root[method](event);
                            if (event.defaultPrevented) return;
                            if (type === "update") {
                                this.root.props = {
                                    ...this.root.props,
                                    ...event.detail
                                };
                            }
                            if (!/^(render|unmount)$/.test(type))
                                this.dispatch("render");
                        },
                        true
                    );
                });
            }
            connectedCallback() {
                this.dispatch("mount");
            }
            disconnectedCallback() {
                this.dispatch("unmount");
            }
            attributeChangedCallback(index, prev, next) {
                this.dispatch("update", getProps(_props, { [index]: next }));
            }
            dispatch(type, detail) {
                this.dispatchEvent(
                    new CustomEvent(type, {
                        cancelable: true,
                        detail
                    })
                );
            }
        }
    );
}
