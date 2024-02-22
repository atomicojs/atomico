import { createHooks } from "../hooks/create-hooks.js";
import { flat, isHydrate } from "../utils.js";
import { ParseError } from "./errors.js";
import { setPrototype, transformValue } from "./set-prototype.js";
export { Any, createType } from "./set-prototype.js";

let ID = 0;
/**
 *
 * @param {Element & {dataset?:object}} node
 * @returns {string|number}
 */
const getHydrateId = (node) => {
    const id = (node?.dataset || {})?.hydrate || "";
    if (id) {
        return id;
    } else {
        return "c" + ID++;
    }
};

/**
 * @param {import("component").Component} component
 * @param {CustomElementConstructor| import("component").ComponentOptions} [options]
 */
export const c = (component, options = HTMLElement) => {
    /**
     * @type {import("./set-prototype.js").Attrs}
     */
    const attrs = {};
    /**
     * @type {import("./set-prototype.js").Values}
     */
    const values = {};

    const withBase =
        "prototype" in options && options.prototype instanceof Element;

    const base = withBase
        ? options
        : "base" in options
          ? options.base
          : HTMLElement;

    //@ts-ignore
    const { props, styles } = withBase ? component : options;

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
        /**
         * @returns {import("core").Sheets[]}
         */
        static get styles() {
            //@ts-ignore
            return [super.styles, styles];
        }
        async _setup() {
            // _setup only continues if _props has not been defined
            if (this._props) return;

            this._props = {};

            /**
             * @type {Node}
             */
            let mountParentNode;
            /**
             * @type {Node}
             */
            let unmountParentNode;

            this.mounted = new Promise(
                (resolve) =>
                    (this.mount = () => {
                        resolve();
                        /**
                         * You should always wait if the node has previously been dismounted before mounting to avoid:
                         * 1. Deleting the rendered content by mistake enerated a cleanup effect.
                         * 2. allow a deletion and new inclusion recycling of the node
                         */
                        if (mountParentNode != this.parentNode) {
                            if (unmountParentNode != mountParentNode) {
                                this.unmounted.then(this.update);
                            } else {
                                this.update();
                            }
                        }
                        mountParentNode = this.parentNode;
                    })
            );

            this.unmounted = new Promise(
                (resolve) =>
                    (this.unmount = () => {
                        resolve();
                        if (
                            mountParentNode != this.parentNode ||
                            !this.isConnected
                        ) {
                            hooks.cleanEffects(true)()();
                            unmountParentNode = this.parentNode;
                            mountParentNode = null;
                        }
                    })
            );

            this.symbolId = this.symbolId || Symbol();
            this.symbolIdParent = Symbol();

            const hooks = createHooks(
                () => this.update(),
                this,
                getHydrateId(this)
            );

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

                                const cleanUseLayoutEffects =
                                    hooks.cleanEffects();
                                result &&
                                    //@ts-ignore
                                    result.render(this, this.symbolId, hydrate);

                                prevent = false;

                                if (firstRender && !hooks.isSuspense()) {
                                    firstRender = false;
                                    // @ts-ignore
                                    !hydrate && applyStyles(this);
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
                }

                return this.updated;
            };

            this.update();
        }
        connectedCallback() {
            this.mount();
            //@ts-ignore
            super.connectedCallback && super.connectedCallback();
        }
        disconnectedCallback() {
            //@ts-ignore
            super.disconnectedCallback && super.disconnectedCallback();
            // The webcomponent will only resolve disconnected if it is
            // actually disconnected of the document, otherwise it will keep the record.
            this.unmount();
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
            const superAttrs = super.observedAttributes || [];
            for (const prop in props) {
                setPrototype(this.prototype, prop, props[prop], attrs, values);
            }
            return Object.keys(attrs).concat(superAttrs);
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
