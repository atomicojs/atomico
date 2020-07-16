import { isFunction, isObject } from "../utils";
/** @type {Any} */
export const Any = null;

/**
 * This class allows to keep the prop system associated with
 * Atomico indifferent to the rest of the core, with the
 * intention of its abstraction for other libraries
 */
export class BaseElement extends HTMLElement {
    constructor() {
        super();
        /**
         * Group aliases as an attribute and then reflect the effect on the prop
         * @type {Object.<string,string>}
         */
        this._attrs = {};
        /**
         * Stores the state of the values that will be consumed by this._update
         * @type {Object.<string,string>}
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
        /**
         * This function is created in observed Attributes, and allows access to the scope
         * that groups the default values for the instance of the customElement.
         */
        this._values();

        this.setup();

        this._update();
    }
    /**
     * Method to be used to consume prop changes
     */
    update() {}
    /**
     * Method to associate connection and disconnection effects of the custom Element
     */
    setup() {}
    /**
     * starts the queue to execute the update method,
     * This method defines the property this._prevent
     * and this.updated
     */
    async _update() {
        if (!this._prevent) {
            this._prevent = true;
            /**@type {()=>void} */
            let resolveUpdate;
            this.updated = new Promise((resolve) => (resolveUpdate = resolve));

            await this.mounted;

            this._prevent = false;

            this.update();

            resolveUpdate();
        }
    }
    static get observedAttributes() {
        let { props = {} } = this;
        let init = [];
        let attrs = [];

        for (let prop in props)
            setProxy(this.prototype, prop, props[prop], attrs, init);
        /**
         *
         * Method used to load values onto the component instance
         */
        this.prototype._values = function () {
            init.forEach((fn) => fn(this));
        };

        return attrs;
    }
    attributeChangedCallback(attr, oldValue, value) {
        if (attr === this._ignoreAttr || oldValue === value) return;
        // Choose the property name to send the update
        this[this._attrs[attr]] = value;
    }
    connectedCallback() {
        this.mount();
    }
    disconnectedCallback() {
        this.unmount();
    }
}

export const dispatchEvent = (node, { type, ...eventInit }) =>
    node.dispatchEvent(new CustomEvent(type, eventInit));

const TRUE_VALUES = [true, 1, "", "1", "true"]; // values considered as valid booleans

const NOT_CALLABLE = [Function, Any]; // values that are not executable when defining the property

/**
 * Transform a Camel Case string to a Kebab case
 * @param {string} prop
 * @returns {string}
 */
const getAttr = (prop) => prop.replace(/([A-Z])/g, "-$1").toLowerCase();

/**
 * reflects an attribute value of the given element as context
 * @param {Element} context
 * @param {Type} type
 * @param {string} attr
 * @param {any} value
 */
const reflectValue = (context, type, attr, value) =>
    value == null || (type == Boolean && !value)
        ? context.removeAttribute(attr)
        : context.setAttribute(
              attr,
              isObject(value)
                  ? JSON.stringify(value)
                  : type == Boolean
                  ? ""
                  : value
          );
/**
 * Constructs the setter and getter of the associated property
 * only if it is not defined in the prototype
 * @param {HTMLElement} proto
 * @param {string} prop
 * @param {Type|Schema} schema
 * @param {string[]} attrs
 * @param {Function[]} init
 */
function setProxy(proto, prop, schema, attrs, init) {
    if (!(prop in proto)) {
        schema = isObject(schema) && schema != Any ? schema : { type: schema };
        let { type, reflect, event, value, attr = getAttr(prop) } = schema;

        let isCallable = !NOT_CALLABLE.includes(type);

        attrs.push(attr);

        function set(newValue) {
            let oldValue = this[prop];

            let { error, value } = filterValue(
                type,
                isCallable && isFunction(newValue)
                    ? newValue(oldValue)
                    : newValue
            );

            if (error && value != null) {
                throw `The value defined for prop '${prop}' must be of type '${type.name}'`;
            }

            if (oldValue == value) return;

            this._props[prop] = value;

            this._update();

            this.updated.then(() => {
                if (event) dispatchEvent(this, event);

                if (reflect) {
                    this._ignoreAttr = attr;
                    reflectValue(this, type, attr, this[prop]);
                    this._ignoreAttr = null;
                }
            });
        }

        Object.defineProperty(proto, prop, {
            set,
            get() {
                return this._props[prop];
            },
        });

        init.push((context) => {
            if (value != null) context[prop] = value;
            context._attrs[attr] = prop;
        });
    }
}
/**
 * Filter the values based on their type
 * @param {Type} type
 * @param {any} value
 * @returns {{error?:boolean,value:any}}
 */
function filterValue(type, value) {
    if (type == Any) return { value };

    try {
        if (type == Boolean) {
            value = TRUE_VALUES.includes(value);
        } else if (typeof value == "string") {
            value =
                type == Number
                    ? Number(value)
                    : type == Object || type == Array
                    ? JSON.parse(value)
                    : value;
        }
        if ({}.toString.call(value) == `[object ${type.name}]`) {
            return { value, error: type == Number && Number.isNaN(value) };
        }
    } catch (e) {}

    return { value, error: true };
}
/**
 * Type any, used to avoid type validation.
 * @typedef {null} Any
 */

/**
 * Types recommended by Atomico.
 * @typedef {String|Number|Function|Array|Object|Promise|Boolean|Any} Type
 */

/**
 * Declare the structure of the event to be used by customEvent
 * @typedef {Object} Event
 * @property {boolean} [bubbles] - indicating whether the event bubbles. The default is false.
 * @property {boolean} [cancelable] - indicating whether the event can be cancelled. The default is false.
 * @property {boolean} [composed] - indicating whether the event will trigger listeners outside of a shadow root.
 * @property {any} [detail] - adds the detail property to the information of the emitted event
 */

/**
 * Declarative structure for creating properties, attributes and side effects
 * associated with customElement.
 * ```js
 * MyComponent.props = {
 *  propString : { type: String, reflec:true, event:{ type: "change", bubles:true } }
 * }
 * ```
 * @typedef {Object} Schema
 * @property {Type} type - Declare the type of data to work
 * @property {string} [attr] - Allows to custumize the name as an attribute
 * @property {boolean} [reflect] - Reflects the value of the property as an attribute
 * @property {Event} [event] - Dispatches an event every time the property changes
 * @property {any} [value] - default value to associate as property when instantiating the customElement
 */
