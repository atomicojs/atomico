import { isFunction } from "../utils";
/**
 * Alias for null
 */
export const Any = null;

/**
 * This class allows to keep the prop system associated with
 * Atomico indifferent to the rest of the core, with the
 * intention of its abstraction for other libraries
 */
export class BaseElement extends HTMLElement {
    constructor() {
        super();
        this._create();
    }
    /**
     * starts the queue to execute the update method,
     * This method defines the property this.prevent
     * and this.updated
     */
    async _update() {
        if (!this._prevent) {
            this._prevent = true;
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
         * method in charge of starting the class and then calling this.create
         * and after this._update
         */
        this.prototype._create = function () {
            this._attrs = {}; // index associating attribute to a component property
            this._props = {}; // groups the real values of the properties worked by the component

            init.forEach((fn) => fn(this)); // Allows external access to the component instance

            this.mounted = new Promise((resolve) => (this.mount = resolve)); // it is solved when connectedCallback is called
            this.unmounted = new Promise((resolve) => (this.unmount = resolve)); // it is solved when disconnectedCallback is called

            if (this.create) this.create();

            this._update();
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

export const dispatchEvent = (node, type, customEventInit) =>
    node.dispatchEvent(
        new CustomEvent(
            type,
            typeof customEventInit == "object" ? customEventInit : null
        )
    );

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
 * @param {*} type
 * @param {string} attr
 * @param {*} value
 */
const reflectValue = (context, type, attr, value) =>
    value == null
        ? context.removeAttribute(attr)
        : context.setAttribute(
              attr,
              typeof value == "object"
                  ? JSON.stringify(value)
                  : type == Boolean
                  ? ""
                  : value
          );
/**
 * Constructs the setter and getter of the associated property
 * only if it is not defined in the prototype
 * @param {*} proto
 * @param {string} prop
 * @param {*} schema
 * @param {string[]} attrs
 * @param {Function[]} init
 */
function setProxy(proto, prop, schema, attrs, init) {
    if (!(prop in proto)) {
        let { type, reflect, event, value, attr = getAttr(prop) } =
            typeof schema == "object" && schema != Any
                ? schema
                : { type: schema };

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
 * @param {*} type
 * @param {*} value
 * @returns {{error?:boolean,value:*}}
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
