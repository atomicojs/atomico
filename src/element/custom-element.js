import { createHooks } from "../hooks/create-hooks.js";
import { flat } from "../utils.js";
import { ParseError } from "./errors.js";
import { setPrototype, transformValue } from "./set-prototype.js";
export { Any, event } from "./set-prototype.js";

let ID = 0;
/**
 *
 * @returns {string}
 */
const getId = () => "c" + ID++;

/**
 * @param {import("component").Component} component
 * @param {import("component").ComponentOptions} [options]
 */
export const c = (component, options = {}) => {
    /**
     * @type {import("./set-prototype.js").Attrs}
     */
    const attrs = {};
    /**
     * @type {import("./set-prototype.js").Values}
     */
    const values = {};

    const { props, styles, base = HTMLElement } = options;

    /**
     * @todo Discover a more aesthetic solution at the type level
     * TS tries to set local class rules, these should be ignored
     */
    class AtomicoElement extends base {
        constructor() {
            super();
            this._setup();
            this._render = () => component({ ...this._props });
            for (const prop in values) this[prop] = values[prop];
        }

        async _setup() {
            this._props = {};
            this.symbolId = this.symbolId || Symbol();

            const hooks = createHooks(() => this.update(), this, getId());

            this.cleanEffects = () => hooks.cleanEffects(true)()();

            const mounted = new Promise((resolve) => (this._mount = resolve));

            let prevent;

            let firstRender = true;

            // some DOM emulators don't define dataset

            this.update = () => {
                if (prevent) return;

                prevent = true;

                /**
                 * this.updated is defined at the runtime of the render,
                 * if it fails it is caught by mistake to unlock prevent
                 */
                this.updated = mounted
                    .then(() => {
                        try {
                            const result = hooks.load(this._render);

                            const cleanUseLayoutEffects = hooks.cleanEffects();

                            result &&
                                //@ts-ignore
                                result.render(this, this.symbolId);

                            prevent = false;

                            if (firstRender && !hooks.isSuspense()) {
                                firstRender = false;
                                //@ts-ignore
                                applyStyles(this);
                            }

                            return cleanUseLayoutEffects();
                        } finally {
                            // Remove lock in case of synchronous error
                            prevent = false;
                        }
                    })
                    .then(
                        /**
                         * @param {import("internal/hooks.js").CleanUseEffects} [cleanUseEffect]
                         */
                        (cleanUseEffect) => {
                            cleanUseEffect && cleanUseEffect();
                        }
                    );
            };

            this.update();
        }
        connectedCallback() {
            this._unmount = () => {
                if (
                    !this.isConnected ||
                    this.lastParentNode != this.parentNode
                ) {
                    this.cleanEffects();
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
            // See if there is an observedAttributes declaration to match with the current one
            // @ts-ignore
            const superAttrs = super.observedAttributes || [];
            for (const prop in props) {
                setPrototype(this.prototype, prop, props[prop], attrs, values);
            }
            return Object.keys(attrs).concat(superAttrs);
        }
        static get styles() {
            return [styles];
        }
        static get props() {
            return props;
        }
    }

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
        flat(styles, (value) => {
            if (value) {
                if (value instanceof Element) {
                    shadowRoot.appendChild(value.cloneNode(true));
                } else {
                    sheets.push(value);
                }
            }
        });
        if (sheets.length) shadowRoot.adoptedStyleSheets = sheets;
    }
}
