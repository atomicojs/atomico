import { render } from "../render.js";
import { createHooks } from "../hooks/create-hooks.js";
import { setPrototype } from "./set-prototype.js";
export { Any } from "./set-prototype.js";
/**
 *
 * @param {any} component
 * @param {typeof HTMLElement} [Base]
 */
export function c(component, Base = HTMLElement) {
    /**
     * @type {Object.<string,string>}
     */
    let attrs = {};
    /**
     * @type {Object.<string,string>}
     */
    let values = {};

    let { props } = component;

    class Element extends Base {
        constructor() {
            super();

            this._ignoreAttr = null;
            /**
             * Stores the state of the values that will be consumed by this._update
             * @type {Object.<string,any>}
             */
            this._props = {};
            /**
             * Promise that will be when connectedCallback is executed
             * @type {Promise<null>}
             */
            this.mounted = new Promise((resolve) => (this.mount = resolve));
            /**
             * Promise that will be when disconnectedCallback is executed
             * @type {Promise<null>}
             */
            this.unmounted = new Promise((resolve) => (this.unmount = resolve));

            for (let prop in values) this[prop] = values[prop];

            this._setup();

            this._update();
        }
        async _setup() {
            let id = Symbol();
            let hooks = createHooks(() => this._update(), this);

            this.update = () => {
                render(hooks.load(component, { ...this._props }), this, id);
                this.updated.then(hooks.updated);
            };

            await this.unmounted;

            hooks.updated(true);
        }
        async _update() {
            if (!this._prevent) {
                this._prevent = true;
                /**@type {()=>void} */
                let resolveUpdate;
                this.updated = new Promise(
                    (resolve) => (resolveUpdate = resolve)
                );

                await this.mounted;

                this.update();

                this._prevent = false;

                resolveUpdate();
            }
        }

        connectedCallback() {
            this.mount();
        }
        disconnectedCallback() {
            this.unmount();
        }
        /**
         *
         * @param {string} attr
         * @param {(string|null)} oldValue
         * @param {(string|null)} value
         */
        attributeChangedCallback(attr, oldValue, value) {
            if (attr === this._ignoreAttr || oldValue === value) return;
            // Choose the property name to send the update
            this[attrs[attr]] = value;
        }
    }

    for (let prop in props) {
        setPrototype(Element.prototype, prop, props[prop], attrs, values);
    }

    Element.observedAttributes = Object.keys(attrs);

    return Element;
}
