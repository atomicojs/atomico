import { setPrototype, transformValue } from "./set-prototype.js";
import { createHooks } from "../hooks/create-hooks.js";
import { render } from "../render.js";
export { Any } from "./set-prototype.js";

/**
 * Class to extend for lifecycle assignment
 * @param {any} component - Function to transform into customElement
 * @param {Base} [Base] - Class to extend for lifecycle assignment
 */
export function c(component, Base = HTMLElement) {
    /**
     * @type {import("./set-prototype").Attrs}
     */
    const attrs = {};
    /**
     * @type {import("./set-prototype").Values}
     */
    const values = {};

    const { props } = component;

    const Atom = class extends Base {
        constructor() {
            super();
            this._setup();
            this._render = () => component({ ...this._props });
            for (const prop in values) this[prop] = values[prop];
        }

        async _setup() {
            // _setup only continues if _props has not been defined
            if (this._props) return;

            this._props = {};

            this.mounted = new Promise((resolve) => (this.mount = resolve));

            this.unmounted = new Promise((resolve) => (this.unmount = resolve));

            this.symbolId = Symbol();

            let hooks = createHooks(() => this.update(), this);

            let prevent;

            this.update = () => {
                if (!prevent) {
                    prevent = true;
                    let error = () => {
                        prevent = false;
                    };
                    this.updated = this.mounted
                        .then(() => {
                            render(
                                hooks.load(this._render),
                                this,
                                this.symbolId
                            );
                            prevent = false;
                            return hooks.cleanEffects();
                        }, error)
                        .then((cleanEffect) => {
                            cleanEffect && cleanEffect();
                        }, error);
                }
                return this.updated;
            };

            this.update();

            await this.unmounted;

            hooks.cleanEffects(true)();
        }
        connectedCallback() {
            this.mount();
        }
        async disconnectedCallback() {
            // The webcomponent will only resolve disconnected if it is
            // actually disconnected of the document, otherwise it will keep the record.
            await this.mounted;
            !this.isConnected && this.unmount();
        }
        /**
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

        static get observedAttributes() {
            // See if there is an observedAttributes declaration to match with the current one
            // @ts-ignore
            let superAttrs = super.observedAttributes || [];
            for (let prop in props) {
                setPrototype(
                    Element.prototype,
                    prop,
                    props[prop],
                    attrs,
                    values
                );
            }
            return Object.keys(attrs).concat(superAttrs);
        }
    };

    return Atom;
}

/**
 * @typedef {typeof HTMLElement} Base
 */

/**
 * @typedef {Object} Context
 * @property {(value:any)=>void} mount
 * @property {(value:any)=>void} unmount
 * @property {Promise<void>} mounted
 * @property {Promise<void>} unmounted
 * @property {Promise<void>} updated
 * @property {()=>Promise<void>} update
 * @property {Object<string,any>} _props
 * @property {string} [_ignoreAttr]
 * @property {symbol} [symbolId]  - symbolId allows to obtain the symbol id that stores the state of the virtual-dom
 */

/**
 * @typedef { ReturnType<c> } Atom
 */

/**
 * @typedef { InstanceType< Atom > & {_ignoreAttr?: string } } AtomThis
 */
