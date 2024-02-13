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
 * @type {import("component").C}
 */
export const c = (component, base) => {
    /**
     * @type {import("./set-prototype.js").Attrs}
     */
    const attrs = {};
    /**
     * @type {import("./set-prototype.js").Values}
     */
    const values = {};

    const { props, styles, name, render: componentWithRender } = component;

    const componentRender = componentWithRender || component;

    const className = (name[0] || "").toUpperCase() + name.slice(1);
    /**
     * @todo Discover a more aesthetic solution at the type level
     * TS tries to set local class rules, these should be ignored
     * @type {any}
     */
    const ctx = {
        [className]: class extends (base || HTMLElement) {
            constructor() {
                super();
                this._setup();
                this._render = () => componentRender({ ...this._props });
                for (const prop in values) this[prop] = values[prop];
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

                /**
                 * @type {Node}
                 */
                let lastParentMount;

                /**
                 * @type {Node}
                 */
                let lastParentUnmount;

                this.mounted = new Promise(
                    (resolve) =>
                        (this.mount = () => {
                            resolve();
                            if (lastParentMount != this.parentNode) {
                                this.update();
                                lastParentMount = this.parentNode;
                            }
                        })
                );

                this.unmounted = new Promise(
                    (resolve) =>
                        (this.unmount = () => {
                            resolve();
                            /**
                             * to recycle the node, its cycle must be closed and
                             * the cycle depends on the parent to preserve the
                             * state in case the nodes move within the same
                             * parent as a result of the use of keys
                             */
                            lastParentUnmount =
                                lastParentUnmount || lastParentMount;
                            if (
                                lastParentUnmount != lastParentMount ||
                                !this.isConnected
                            ) {
                                hooks.cleanEffects(true)()();
                                lastParentUnmount = lastParentMount;
                            }
                        })
                );

                this.symbolId = this.symbolId || Symbol();

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
                                        result.render(
                                            this,
                                            this.symbolId,
                                            hydrate
                                        );

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
            async disconnectedCallback() {
                //@ts-ignore
                super.disconnectedCallback && super.disconnectedCallback();
                // The webcomponent will only resolve disconnected if it is
                // actually disconnected of the document, otherwise it will keep the record.

                await this.mounted;

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
                    setPrototype(
                        this.prototype,
                        prop,
                        props[prop],
                        attrs,
                        values
                    );
                }
                return Object.keys(attrs).concat(superAttrs);
            }
        }
    };

    return ctx[className];
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
