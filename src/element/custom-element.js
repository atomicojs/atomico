import { setPrototype } from "./set-prototype.js";
import { setup } from "./setup.js";
export { Any } from "./set-prototype.js";
/**
 *
 * @param {any} component
 * @param {Base} [Base]
 */
export function c(component, Base = HTMLElement) {
    /**
     * @type {Object<string,string>}
     */
    let attrs = {};
    /**
     * @type {Object<string,string>}
     */
    let values = {};

    let { props } = component;

    class Element extends Base {
        /**
         * @this BaseContext
         */
        constructor() {
            super();

            this._props = {};

            this.mounted = new Promise((resolve) => (this.mount = resolve));

            this.unmounted = new Promise((resolve) => (this.unmount = resolve));

            setup(this, component);

            for (let prop in values) this[prop] = values[prop];

            this.update();
        }
        connectedCallback() {
            this.mount();
        }
        disconnectedCallback() {
            this.unmount();
        }
        /**
         * @this BaseContext
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

/**
 * @typedef {typeof HTMLElement} Base
 */

/**
 * @typedef {Object} Context
 * @property {()=>void} mount
 * @property {()=>void} unmount
 * @property {Promise<void>} mounted
 * @property {Promise<void>} unmounted
 * @property {Promise<void>} updated
 * @property {()=>Promise<void>} update
 * @property {Object<string,any>} _props
 * @property {string} [_ignoreAttr]
 */

/**
 * @typedef {HTMLElement & Context} BaseContext
 */
