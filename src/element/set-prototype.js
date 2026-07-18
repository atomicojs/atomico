import { isObject, SymbolFor } from "../utils.js";
import { PropError } from "./errors.js";

export const SYMBOL_EVENT = SymbolFor("event");

/**
 * The Any type avoids the validation of prop types
 * @type {null}
 **/
export const Any = null;

/**
 * Attributes considered as valid boleanos
 **/
const TRUE_VALUES = { true: 1, "": 1, 1: 1 };

/**
 * Constructs the setter and getter of the associated property
 * only if it is not defined in the prototype
 * @param {Object} prototype - CustomElement prototype
 * @param {string} prop - Name of the reactive property to associate with the customElement
 * @param {any} schema - Structure to be evaluated for the definition of the property
 * @param {Attrs} attrs - Dictionary of attributes to properties
 * @param {Values} values - Values to initialize the customElements
 */
export function setPrototype(prototype, prop, schema, attrs, values) {
    /**@type {Schema} */
    const {
        type,
        reflect,
        value: defaultValue,
        attr = getAttr(prop)
    } = isObject(schema) && schema != Any ? schema : { type: schema };

    Object.defineProperty(prototype, prop, {
        configurable: true,
        /**
         * @this {import("dom").AtomicoThisInternal}
         * @param {any} newValue
         */
        set(newValue) {
            const oldValue = this[prop];

            if (defaultValue && newValue == null) {
                newValue = defaultValue.call({ self: this, prop });
            }

            const { error, value } = filterValue(type, newValue);

            if (error && value != null) {
                throw new PropError(
                    this,
                    `The value defined for prop '${prop}' must be of type '${type.name}'`,
                    value
                );
            }

            if (oldValue == value) return;

            this._props[prop] = value == null ? undefined : value;

            this.update();
            /**
             * attribute mirroring must occur if component is mounted
             */
            this.updated.then(() => {
                if (reflect) {
                    this._ignoreAttr = attr;
                    reflectValue(this, type, attr, this[prop]);
                    this._ignoreAttr = null;
                }
            });
        },
        /**
         * @this {import("dom").AtomicoThisInternal}
         */
        get() {
            return this._props[prop];
        }
    });

    if (defaultValue) values[prop] = null;
    attrs[attr] = { prop, type };
}

/**
 * Dispatch an event
 * @param {Element} node - DOM node to dispatch the event
 * @param {import("schema").SchemaEventInit} event - Event to dispatch on node
 */
export const dispatchEvent = (
    node,
    { type, base = CustomEvent, ...eventInit }
) => node.dispatchEvent(new base(type, eventInit));

/**
 * Transform a Camel Case string to a Kebab case
 * @param {string} prop - string to apply the format
 * @returns {string}
 */
export const getAttr = (prop) => prop.replace(/([A-Z])/g, "-$1").toLowerCase();

/**
 * reflects an attribute value of the given element as context
 * @param {Element} host
 * @param {any} type
 * @param {string} attr
 * @param {any} value
 */
export const reflectValue = (host, type, attr, value) =>
    value == null || (type == Boolean && !value)
        ? host.removeAttribute(attr)
        : host.setAttribute(
              attr,
              isObject(value)
                  ? JSON.stringify(value)
                  : type == Boolean
                  ? ""
                  : value.toString()
          );

/**
 * transform a string to a value according to its type
 * @param {any} type
 * @param {string} value
 * @returns {any}
 */
export const transformValue = (type, value) =>
    type == Boolean
        ? !!TRUE_VALUES[value]
        : type == Number
        ? Number(value)
        : type == String
        ? value
        : type == Array || type == Object
        ? JSON.parse(value)
        : // TODO: If when defining reflect the prop can also be of type string?
          new type(value);

/**
 * Filter the values based on their type
 * @param {any} type
 * @param {any} value
 * @returns {{error?:boolean,value:any}}
 */
export const filterValue = (type, value) =>
    type == null || value == null
        ? { value, error: false }
        : type != String && value === ""
        ? { value: undefined, error: false }
        : type == Object || type == Array || type == Symbol
        ? {
              value,
              error: {}.toString.call(value) !== `[object ${type.name}]`
          }
        : value instanceof type
        ? {
              value,
              error: type == Number && Number.isNaN(value.valueOf())
          }
        : type == String || type == Number || type == Boolean
        ? {
              value,
              error:
                  type == Number
                      ? typeof value != "number" || Number.isNaN(value)
                      : type == String
                      ? typeof value != "string"
                      : typeof value != "boolean"
          }
        : { value, error: true };

/**
 * The event function allows you to create an event-type prop, enabling full JSX
 * autocomplete and providing an event dispatcher directly through the prop.
 * @example
 * ```tsx
 * const MyComponent = c(
 *    (props) => (
 *        <host>
 *            <button onclick={() => props.myEvent()}>custom event!</button>
 *        </host>
 *    ),
 *    { props: { myEvent: event() } }
 * );
 * ```
 * @param {import("schema").SchemaEventConfig} [config] - Event to dispatch on node
 */
export const event = (config) => ({
    type: Function,
    value() {
        const dispatch = (detail) =>
            dispatchEvent(this.self, {
                ...config,
                type: this.prop,
                detail: detail || config?.detail
            });
        dispatch[SYMBOL_EVENT] = true;
        return dispatch;
    }
});

export const callback = () => ({
    type: Function
});

export const type = (value) => value;
/**
 * Type any, used to avoid type validation.
 * @typedef {null} Any
 */

/**
 * @typedef {Object} InternalEventInit
 * @property {typeof CustomEvent|typeof Event} [base] - Optional constructor to initialize the event
 * @property {boolean} [bubbles] - indicating whether the event bubbles. The default is false.
 * @property {boolean} [cancelable] - indicating whether the event will trigger listeners outside of a shadow root.
 * @property {boolean} [composed] - indicating whether the event will trigger listeners outside of a shadow root.
 * @property {any} [detail] - indicating whether the event will trigger listeners outside of a shadow root.
 */

/**
 * Interface used by dispatchEvent to automate event firing
 * @typedef {Object} InternalEvent
 * @property {string} type - type of event to dispatch.
 */

/**
 * @typedef {Object<string, {prop:string,type:Function}>} Attrs
 */

/**
 * @typedef {Object<string, any>} Values
 */

/**
 * @typedef {Object} Schema
 * @property {any} [type] - data type to be worked as property and attribute
 * @property {string} [attr] - allows customizing the name as an attribute by skipping the camelCase format
 * @property {boolean} [reflect] - reflects property as attribute of node
 * @property {InternalEvent & InternalEventInit} [event] - Allows to emit an event every time the property changes
 * @property {()=>any} [value] - defines a default value when instantiating the component
 */
