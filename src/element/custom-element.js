import { createHooks, UNMOUNT } from "../hooks/create-hooks.js";
import {
    FORM_ASSOCIATED,
    FORM_DISABLED,
    FORM_RESET
} from "../hooks/custom-hooks/use-internals.js";
import {
    EFFECT,
    INSERTION_EFFECT,
    LAYOUT_EFFECT
} from "../hooks/use-effect.js";
import { render } from "../render.js";
import { flat } from "../utils.js";
import { ParseError } from "./errors.js";
import { setPrototype, transformValue } from "./set-prototype.js";
export { event, callback } from "./set-prototype.js";

let ID = 0;

/**
 * @type {import("component").C} component
 */
export const c = (component, options) => {
    /**
     * @type {import("./set-prototype.js").Attrs}
     */
    const attrs = {};
    /**
     * @type {import("./set-prototype.js").Values}
     */
    const values = {};

    const { props, styles, form } = {
        props: {},
        ...options
    };

    class AtomicoElement extends HTMLElement {
        static formAssociated = form;
        constructor() {
            super();
            this._setup();
            this._render = () =>
                component(
                    //@ts-ignore
                    { ...this._props }
                );
            for (const prop in values) this[prop] = values[prop];
        }

        async _setup() {
            /**
             * The state of the props persists within the web component instance,
             * allowing it to be removed and reattached while retaining its last known state.
             * NOTE: The effect lifecycle will regenerate on each mount and unmount, except when the parent remains the same.
             */
            this._props = this._props || {};
            /**
             * Retrieves the render ID to always reuse the previously generated view.
             */
            this.symbolId = this.symbolId || Symbol();

            /**
             * The state of the hooks persists within the web component instance,
             * allowing it to be removed and reattached while retaining its last known state.
             * NOTE: The effect lifecycle will regenerate on each mount and unmount, except when the parent remains the same.
             */
            this._hooks =
                this._hooks ||
                createHooks(() => this.update(), this, "c" + ID++);

            /**
             * Defines the connection lifecycle with the parent. This lifecycle changes
             * when the component’s parent changes or when the component is removed.
             */
            let mounted = new Promise((resolve) => (this._mount = resolve));

            /**
             * Optimizes execution under concurrency by using the promise resolution as a marker,
             * allowing another render cycle to occur.
             */
            let prevent;

            let firstRender = true;

            /**
             * Allows invoking a render. It will only initialize once the mounted promise has been resolved,
             * ensuring the component triggers activity only after being connected to the DOM.
             */
            this.update = () => {
                if (prevent) return;

                prevent = true;
                const hooks = this._hooks;
                /**
                 * `this.updated` is the safe way to observe or trigger effects based on the
                 * component’s render cycle, as it will only resolve if everything executes successfully.
                 */
                this.updated = mounted
                    .then(() => {
                        try {
                            const result = hooks.render(this._render);

                            hooks.dispatch(INSERTION_EFFECT);

                            if (result) render(result, this, this.symbolId);

                            prevent = false;

                            if (firstRender && !hooks.isSuspense()) {
                                firstRender = false;
                                //@ts-ignore
                                applyStyles(this);
                            }

                            hooks.dispatch(LAYOUT_EFFECT);
                        } finally {
                            // Remove lock in case of synchronous error
                            prevent = false;
                        }
                    })
                    .then(() => {
                        hooks.dispatch(EFFECT);
                    });
            };

            this.update();
        }
        /***
         * A highly important method, as it allows evaluating the mount and unmount lifecycle.
         * Note that this process, to avoid duplicating effects, verifies that:
         * 1. The parent is different from the one in the previous mount.
         * 2. The node is connected.
         */
        connectedCallback() {
            this._unmount = () => {
                if (
                    !this.isConnected ||
                    this.lastParentNode != this.parentNode
                ) {
                    this._hooks.dispatch(UNMOUNT);
                }
                if (!this.parentNode) this.lastParentNode = this.parentNode;
            };

            if (this.lastParentNode != this.parentNode) {
                this._mount();
                this.update();
            }

            this.lastParentNode = this.parentNode;
        }
        disconnectedCallback() {
            this._unmount();
        }
        /**
         * @this {import("dom").AtomicoThisInternal}
         * @param {string} attr
         * @param {(string|null)} oldValue
         * @param {(string|null)} value
         */
        attributeChangedCallback(attr, oldValue, value) {
            if (attrs[attr]) {
                // _ignoreAttr exists temporarily
                // @ts-ignore
                if (attr === this._ignoreAttr || oldValue === value) return;
                // Choose the property name to send the update
                const { prop, type } = attrs[attr];
                // The following error cannot be caught
                try {
                    this[prop] = transformValue(type, value);
                } catch (e) {
                    throw new ParseError(
                        this,
                        `The value defined as attr '${attr}' cannot be parsed by type '${type.name}'`,
                        value
                    );
                }
            }
        }
        static get observedAttributes() {
            for (const prop in props) {
                setPrototype(this.prototype, prop, props[prop], attrs, values);
            }
            return Object.keys(attrs);
        }
        static get styles() {
            return [styles];
        }
        static get props() {
            return props;
        }
        async formResetCallback() {
            await this.updated;
            this._hooks.dispatch(FORM_RESET);
        }
        async formAssociatedCallback(form) {
            await this.updated;
            this._hooks.dispatch(FORM_ASSOCIATED, form);
        }
        async formDisabledCallback(disabled) {
            await this.updated;
            this._hooks.dispatch(FORM_DISABLED, disabled);
        }
    }

    // @ts-ignore
    return AtomicoElement;
};

/**
 * Attach the css to the shadowDom
 * @param {import("dom").AtomicoThisInternal} host
 */
function applyStyles(host) {
    const { styles } = host.constructor;
    const { shadowRoot } = host;
    if (shadowRoot && styles.length) {
        /**
         * @type {CSSStyleSheet[]}
         */
        const sheets = [];
        flat(styles, (value) => sheets.push(value));
        if (sheets.length) shadowRoot.adoptedStyleSheets = sheets;
    }
}
