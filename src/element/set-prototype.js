import { isObject, isFunction } from "../utils.js";

/**
 * The Any type avoids the validation of prop types
 * @type {null}
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
 * @param {any} schema
 * @param {Object.<string,any>} attrs
 * @param {Object.<string,any>} values
 */
export function setPrototype(proto, prop, schema, attrs, values) {
    if (!(prop in proto)) {
        /**@type {Schema} */
        let { type, reflect, event, value, attr = getAttr(prop) } =
            isObject(schema) && schema != Any ? schema : { type: schema };

        let isCallable = !(type == Function || type == Any);

        Object.defineProperty(proto, prop, {
            /**
             * @this {import("./custom-element").BaseContext}
             * @param {any} newValue
             */
            set(newValue) {
                let oldValue = this[prop];

                let { error, value } = filterValue(
                    type,
                    isCallable && isFunction(newValue)
                        ? newValue(oldValue)
                        : newValue
                );

                if (error && value != null) {
                    throw {
                        message: `The value defined for prop '${prop}' must be of type '${type.name}'`,
                        value,
                        target: this,
                    };
                }

                if (oldValue == value) return;

                this._props[prop] = value;

                this.update();

                this.updated.then(() => {
                    if (event) dispatchEvent(this, event);

                    if (reflect) {
                        this._ignoreAttr = attr;
                        reflectValue(this, type, attr, this[prop]);
                        this._ignoreAttr = null;
                    }
                });
            },
            /**
             * @this {import("./custom-element").BaseContext}
             */
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
 * @param {Event} event - Event to dispatch on node
 */
export const dispatchEvent = (node, { type, ...eventInit }) =>
    node.dispatchEvent(new CustomEvent(type, eventInit));

/**
 * Transform a Camel Case string to a Kebab case
 * @param {string} prop - string to apply the format
 * @returns {string}
 */
const getAttr = (prop) => prop.replace(/([A-Z])/g, "-$1").toLowerCase();

/**
 * reflects an attribute value of the given element as context
 * @param {Element} context
 * @param {any} type
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
 * @param {any} type
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
 * Interface used by dispatchEvent to automate event firing
 * @typedef {Object} Event
 * @property {string} type - type of event to dispatch.
 * @property {boolean} [bubbles] - indicating whether the event bubbles. The default is false.
 * @property {boolean} [cancelable] - indicating whether the event will trigger listeners outside of a shadow root.
 * @property {boolean} [composed] - indicating whether the event will trigger listeners outside of a shadow root.
 * @property {any} [detail] - indicating whether the event will trigger listeners outside of a shadow root.
 */

/**
 * @typedef {Object} Schema
 * @property {any} [type] - data type to be worked as property and attribute
 * @property {string} [attr] - allows customizing the name as an attribute by skipping the camelCase format
 * @property {boolean} [reflect] - reflects property as attribute of node
 * @property {Event} [event] - Allows to emit an event every time the property changes
 * @property {any} [value] - defines a default value when instantiating the component
 */
