import { ELEMENT_PROPS, ELEMENT_IGNORE_ATTR } from "../constants";
import { createHookCollection } from "../hooks";
import { render } from "../render/render";
import {
    formatType,
    setAttr,
    propToAttr,
    attrToProp,
    dispatchEvent
} from "./utils";

import { isFunction } from "../utils";
import { createElement } from "../vnode";

export class Element extends HTMLElement {
    constructor() {
        super();
        /**
         * identifier to store the virtual-dom state,
         * this is unique between instances of the
         * component to securely consider the host status
         */
        let id = Symbol("vnode");

        let {
            constructor: { view, initialize, catch: renderCatch }
        } = this;
        let length = initialize.length;
        let prevent;
        let unmount;

        view = view.bind(this);

        this[ELEMENT_PROPS] = {};

        let beforeUpdateDom = () =>
            hooks.load(view, { ...this[ELEMENT_PROPS] });

        let updateDom = virtualDom => render(virtualDom, this, id);

        let rerenderCatch = error => {
            prevent = false;
            renderCatch(error);
        };

        this.update = () => {
            if (unmount) return;
            let rendered = this.rendered;
            if (!prevent) {
                rendered = this.mounted
                    .then(beforeUpdateDom)
                    .then(updateDom)
                    .then(() => (prevent = false))
                    .then(hooks.updated);

                prevent = true;
                rendered.catch(rerenderCatch);
            }

            return (this.rendered = rendered);
        };

        let hooks = createHookCollection(this.update, this);
        /**
         * creates a collection of microtask
         * associated with the mounted of the component
         */
        this.mounted = new Promise(
            resolve =>
                (this.mount = () => {
                    // allows the reuse of the component when it is unmounted and mounted
                    if (unmount == true) {
                        unmount = false;
                        this.mounted = this.update();
                    }
                    resolve();
                })
        );
        /**
         * creates a collection of microtask
         * associated with the unmounted of the component
         */
        this.unmounted = new Promise(
            resolve =>
                (this.unmount = () => {
                    unmount = true;
                    resolve();
                })
        ).then(hooks.unmount);

        this.update();

        while (length--) initialize[length](this);
    }
    connectedCallback() {
        this.mount();
    }
    disconnectedCallback() {
        this.unmount();
    }
    attributeChangedCallback(attr, oldValue, value) {
        if (attr === this[ELEMENT_IGNORE_ATTR] || oldValue === value) return;
        this[attrToProp(attr)] = value;
    }
    static get observedAttributes() {
        let { props, prototype } = this;
        this.initialize = []; //allows subscribers to be added to the web-component constructor
        if (!props) return [];
        return Object.keys(props).map(prop => {
            let attr = propToAttr(prop);
            let config = props[prop];
            /**
             * @namespace
             * @property {any} type
             * @property {boolean} reflect
             * @property {value} any
             * @property {(boolean|Object)} dispatchEvent
             */
            let schema = config.name ? { type: config } : config;

            if (!(prop in prototype)) {
                Object.defineProperty(prototype, prop, {
                    set(nextValue) {
                        let { value, error } = formatType(
                            nextValue,
                            schema.type
                        );
                        let prevValue = this[ELEMENT_PROPS][prop];

                        if (error && value != null) {
                            throw `the observable [${prop}] must be of the type [${schema.type.name}]`;
                        }

                        if (value == prevValue) return;
                        if (schema.type == Function) {
                            if (prevValue && value == prevValue.base) {
                                return;
                            }
                            let base = value;
                            value = value.bind(this);
                            value.base = base;
                        }

                        if (schema.reflect) {
                            // the default properties are only reflected once the web-component is mounted
                            this.mounted.then(() => {
                                this[ELEMENT_IGNORE_ATTR] = attr; //update is prevented
                                setAttr(
                                    this,
                                    attr,
                                    schema.type == Boolean && !value
                                        ? null
                                        : value //
                                );
                                this[ELEMENT_IGNORE_ATTR] = false; // an upcoming update is allowed
                            });
                        }

                        this[ELEMENT_PROPS][prop] = value;
                        let rendered = this.update();
                        if (schema.dispatchEvent) {
                            rendered.then(() =>
                                dispatchEvent(
                                    this,
                                    schema.dispatchEvent.type || prop,
                                    schema.dispatchEvent
                                )
                            );
                        }
                    },
                    get() {
                        return this[ELEMENT_PROPS][prop];
                    }
                });
            }
            // externally allows access to the component, to initialize the value of the props
            if ("value" in schema)
                this.initialize.push(self => (self[prop] = schema.value));
            return attr;
        });
    }
}

/**
 * register the component, be it a class or function
 * @param {string} nodeType
 * @param {Function} component
 * @return {Function} returns a jsx component
 */
export function customElement(nodeType, component) {
    if (isFunction(nodeType)) {
        component = nodeType;
        let CustomElement = class extends Element {};
        CustomElement.view = component;
        CustomElement.props = component.props;
        CustomElement.catch = component.catch || console.error;
        return CustomElement;
    } else {
        customElements.define(
            nodeType,
            component instanceof Element ? component : customElement(component)
        );

        return props => createElement(nodeType, props);
    }
}
