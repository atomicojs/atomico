import { ELEMENT_PROPS, ELEMENT_IGNORE_ATTR } from "../constants";
import { createHookCollection } from "../hooks";
import { render } from "../render/render";
import {
    formatType,
    setAttr,
    propToAttr,
    attrToProp,
    dispatchEvent,
    createPropError
} from "./utils";

import { isFunction, promise } from "../utils";
import { createElement } from "../vnode";
import { addQueue, IMPORTANT } from "../task";

function load(target, componentRender, componentError) {
    if (target.mount) return;

    let id = Symbol("vnode");

    let isPrevent;
    let isUnmount;

    target[ELEMENT_PROPS] = {};

    let isMounted;

    let resolveUpdate;

    let rerender = () => {
        // disables blocking, allowing the cycle to be regenerate
        isPrevent = false;
        // After the first render it disables the important condition
        if (rerender[IMPORTANT]) rerender[IMPORTANT] = false;
        try {
            render(
                hooks.load(componentRender, { ...target[ELEMENT_PROPS] }),
                target,
                id
            );

            resolveUpdate();
        } catch (e) {
            (componentError || console.error)(e);
        }
    };
    // mark the first render as important, target speeds up the rendering
    rerender[IMPORTANT] = true;

    target.update = () => {
        if (isUnmount) return;
        let rendered = target.rendered;
        if (!isPrevent) {
            isPrevent = true;
            // create a promise to observe the status of the update
            rendered = promise(resolve => (resolveUpdate = resolve)).then(
                // the UPDATED state is only propagated through
                // the resolution of the promise
                // Why? ... to improve communication between web-component parent and children
                hooks.updated
            );

            // if the component is already mounted, avoid using target.mounted,
            // to speed up the microtask
            isMounted
                ? addQueue(rerender)
                : target.mounted.then(() => {
                      isMounted = true;
                      addQueue(rerender);
                  });
        }

        return (target.rendered = rendered);
    };

    // any update from hook is added to a separate queue
    let hooks = createHookCollection(() => addQueue(target.update), target);

    // creates a collection of microtask
    // associated with the mounted of the component

    target.mounted = promise(
        resolve =>
            (target.mount = () => {
                isMounted = false;
                // allows the reuse of the component when it is isUnmounted and mounted
                if (isUnmount == true) {
                    isUnmount = false;
                    target.mounted = target.update();
                }
                resolve();
            })
    );
    /**
     * creates a collection of microtask
     * associated with the unmounted of the component
     */
    target.unmounted = promise(
        resolve =>
            (target.unmount = () => {
                isUnmount = true;
                hooks.unmount();
                resolve();
            })
    );

    target.initialize();

    target.update();
}

/**
 * register the component, be it a class or function
 * @param {string} nodeType
 * @param {Function} component
 * @return {Function} returns a jsx component
 */
export function customElement(nodeType, component, options) {
    if (isFunction(nodeType)) {
        // By defining nodeType as a function, custom ELement
        // allows the assignment of a constructor to be extended
        let BaseElement = component || HTMLElement;

        component = nodeType;

        let { props, error } = component;

        /**@type {Function[]}*/
        let initialize = [];

        /**@type {string[]} */
        let attrs = [];

        let CustomElement = class extends BaseElement {
            constructor() {
                super();
                /**
                 * identifier to store the virtual-dom state,
                 * this is unique between instances of the
                 * component to securely consider the host status
                 */
                load(this, component, error);
            }
            connectedCallback() {
                load(this, component, error);
                this.mount();
            }
            disconnectedCallback() {
                this.unmount();
            }
            attributeChangedCallback(attr, oldValue, value) {
                if (attr === this[ELEMENT_IGNORE_ATTR] || oldValue === value)
                    return;
                this[attrToProp(attr)] = value;
            }
            initialize() {
                let length = initialize.length;
                while (length--) initialize[length](this);
            }
        };

        let prototype = CustomElement.prototype;

        for (let prop in props)
            setProperty(prototype, initialize, attrs, prop, props[prop]);

        CustomElement.observedAttributes = attrs;

        CustomElement.props = props;

        return CustomElement;
    } else {
        let { base, ...opts } = options || {};
        let define = () =>
            customElements.define(
                nodeType,
                customElement(component, base),
                opts
            );
        // it allows to wait for one or more webcomponents
        // to be defined before the definition of this
        opts.waitFor
            ? Promise.all(
                  []
                      .concat(opts.waitFor)
                      .map(nodeType => customElements.whenDefined(nodeType))
              ).then(define)
            : define();
        return props =>
            opts.extends
                ? createElement(opts.extends, { ...props, is: nodeType })
                : createElement(nodeType, props);
    }
}

function setProperty(prototype, initialize, attrs, prop, schema) {
    // avoid rewriting the prototype
    if (prop in prototype) return;

    let attr = propToAttr(prop);

    schema = schema.name ? { type: schema } : schema;

    let isTypeFunction = schema.type == Function;

    function set(nextValue) {
        let prevValue = this[ELEMENT_PROPS][prop];
        // if the next value in function, with the exception of the type function,
        // will be executed to get the next value
        if (!isTypeFunction && isFunction(nextValue)) {
            nextValue = nextValue(prevValue);
        }
        // Evaluate the defined type, to work with the value or issue an error
        let { value, error } = formatType(nextValue, schema.type);

        // define if the definition of prop has generated a type error
        if (error && value != null) {
            throw createPropError(
                {
                    target: this,
                    schema,
                    value
                },
                `The value defined for prop '${prop}' must be of type '${schema.type.name}'`
            );
        }
        // define if the prop definition has generated an options error
        if (schema.options && !schema.options.includes(value)) {
            throw createPropError(
                {
                    target: this,
                    schema,
                    value
                },
                `The value defined for prop '${prop}' It is not a valid option`
            );
        }

        if (prevValue == value) return;

        this[ELEMENT_PROPS][prop] = value;

        let rendered = this.update();

        if (schema.event) {
            // The event is only dispatched if the component has finished
            // the rendering cycle, this is useful to observe the changes
            rendered.then(() =>
                dispatchEvent(this, schema.event.type || prop, schema.event)
            );
        }

        if (schema.reflect) {
            // the default properties are only reflected once the web-component is mounted
            this.mounted.then(() => {
                this[ELEMENT_IGNORE_ATTR] = attr; //update is prevented
                setAttr(
                    this,
                    attr,
                    schema.type == Boolean && !value ? null : value //
                );
                this[ELEMENT_IGNORE_ATTR] = false; // an upcoming update is allowed
            });
        }
    }

    function get() {
        return this[ELEMENT_PROPS][prop];
    }

    Object.defineProperty(prototype, prop, { set, get });

    if ("value" in schema) {
        initialize.push(target => {
            let { value } = schema;
            target[prop] = isFunction(value) ? value() : value;
        });
    }
    attrs.push(attr);
}
