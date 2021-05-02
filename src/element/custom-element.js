import { setPrototype, transformValue } from "./set-prototype.js";
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

            setup(this, component);

            for (let prop in values) this[prop] = values[prop];

            this.update();
        }
        /**
         * @this BaseContext
         */
        connectedCallback() {
            this.mount();
        }
        /**
         * @this BaseContext
         */
        async disconnectedCallback() {
            // The webcomponent will only resolve disconnected if it is
            // actually disconnected of the document, otherwise it will keep the record.
            await this.mounted;
            !this.isConnected && this.unmount();
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
            const { prop, type } = attrs[attr];
            this[prop] = transformValue(type, value);
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
 * @typedef {HTMLElement & Context} BaseContext
 */
