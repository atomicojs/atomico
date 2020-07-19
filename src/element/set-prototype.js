import { isObject, isFunction } from "../utils";

/**
 * The Any type avoids the validation of prop types
 * @type {import("./internal").Any}
 **/
export const Any = null;

/**
 * Attributes considered as valid boleanos
 * @type {Array<true|1|""|"1"|"true">}
 **/
const TRUE_VALUES = [true, 1, "", "1", "true"];

/**
 * Constructs the setter and getter of the associated property
 * only if it is not defined in the prototype
 * @param {Object} proto
 * @param {string} prop
 * @param {import("./internal").PropValue} config
 * @param {Object.<string,any>} attrs
 * @param {Object.<string,any>} values
 */
export function setPrototype(proto, prop, config, attrs, values) {
    if (!(prop in proto)) {
        /**@type {import("./internal").Schema} */
        let schema =
            isObject(config) && config != Any ? config : { type: config };

        let { type, reflect, event, value, attr = getAttr(prop) } = schema;

        let isCallable = !(type == Function || type == Any);

        Object.defineProperty(proto, prop, {
            set(newValue) {
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
            },
            get() {
                return this._props[prop];
            },
        });

        if (value != null) {
            values[prop] = value;
        }

        attrs[attr] = prop;
    }
}

/**
 * Dispatch an event
 * @param {Element} node - DOM node to dispatch the event
 * @param {import("./internal").Event} event
 */
export const dispatchEvent = (node, { type, ...eventInit }) =>
    node.dispatchEvent(new CustomEvent(type, eventInit));

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
