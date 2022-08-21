import { setPrototype, transformValue } from "./set-prototype.js";
import { createHooks } from "../hooks/create-hooks.js";
export { Any } from "./set-prototype.js";
import { flat, isHydrate } from "../utils.js";

/**
 * @type {import("component").C}
 */
export let c = (component, base) => {
    /**
     * @type {import("./set-prototype").Attrs}
     */
    let attrs = {};
    /**
     * @type {import("./set-prototype").Values}
     */
    let values = {};

    let { props, styles } = component;
    /**
     * @todo Discover a more aesthetic solution at the type level
     * TS tries to set local class rules, these should be ignored
     * @type {any}
     */
    let AtomicoElement = class extends (base || HTMLElement) {
        constructor() {
            super();
            this._setup();
            this._render = () => component({ ...this._props });
            for (let prop in values) this[prop] = values[prop];
        }
        /**
         * @returns {import("core").Sheets}
         */
        static get styles() {
            //@ts-ignore
            return [super.styles, styles];
        }
        async _setup() {
            // _setup only continues if _props has not been defined
            if (this._props) return;

            this._props = {};

            this.mounted = new Promise((resolve) => (this.mount = resolve));
            this.unmounted = new Promise((resolve) => (this.unmount = resolve));

            this.symbolId = this.symbolId || Symbol();

            let hooks = createHooks(() => this.update(), this);

            let prevent;

            let firstRender = true;

            // some DOM emulators don't define dataset
            const hydrate = isHydrate(this);

            this.update = () => {
                if (!prevent) {
                    prevent = true;

                    /**
                     * this.updated is defined at the runtime of the render,
                     * if it fails it is caught by mistake to unlock prevent
                     */
                    this.updated = (this.updated || this.mounted)
                        .then(() => {
                            try {
                                const result = hooks.load(this._render);

                                result &&
                                    result.render(this, this.symbolId, hydrate);

                                prevent = false;

                                if (firstRender) {
                                    firstRender = false;
                                    // @ts-ignore
                                    !hydrate && applyStyles(this);
                                }

                                return hooks.cleanEffects();
                            } finally {
                                // Remove lock in case of synchronous error
                                prevent = false;
                            }
                        })
                        // next tick
                        .then((cleanEffect) => {
                            cleanEffect && cleanEffect();
                        });
                }

                return this.updated;
            };

            this.update();

            await this.unmounted;

            hooks.cleanEffects(true)();
        }
        connectedCallback() {
            this.mount();
            //@ts-ignore
            super.connectedCallback && super.connectedCallback();
        }
        async disconnectedCallback() {
            //@ts-ignore
            super.disconnectedCallback && super.disconnectedCallback();
            // The webcomponent will only resolve disconnected if it is
            // actually disconnected of the document, otherwise it will keep the record.
            await this.mounted;
            !this.isConnected && this.unmount();
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
                let { prop, type } = attrs[attr];
                this[prop] = transformValue(type, value);
            } else {
                // If the attribute does not exist in the scope attrs, the event is sent to super
                // @ts-ignore
                super.attributeChangedCallback(attr, oldValue, value);
            }
        }

        static get props() {
            //@ts-ignore
            return { ...super.props, ...props };
        }

        static get observedAttributes() {
            // See if there is an observedAttributes declaration to match with the current one
            // @ts-ignore
            let superAttrs = super.observedAttributes || [];
            for (let prop in props) {
                setPrototype(this.prototype, prop, props[prop], attrs, values);
            }
            return Object.keys(attrs).concat(superAttrs);
        }
    };

    return AtomicoElement;
};

/**
 * Attach the css to the shadowDom
 * @param {import("dom").AtomicoThisInternal} host
 */
function applyStyles(host) {
    let { styles } = host.constructor;
    let { shadowRoot } = host;
    if (shadowRoot && styles.length) {
        /**
         * @type {CSSStyleSheet[]}
         */
        let sheets = [];
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
