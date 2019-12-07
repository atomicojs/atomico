import { ELEMENT_PROPS, ELEMENT_IGNORE_ATTR } from "../constants";
import { createHookCollection } from "../hooks";
import { render } from "../render/render";
import {
    formatType,
    setAttr,
    propToAttr,
    attrToProp,
    dispatchEvent
} from "./utils";

import { isFunction, promise } from "../utils";
import { createElement } from "../vnode";
import { addQueue, IMPORTANT } from "../task";

function load(self) {
    if (self.mount) return;

    let id = Symbol("vnode");

    let isPrevent;
    let isUnmount;

    self[ELEMENT_PROPS] = {};

    let isMounted;

    let resolveUpdate;

    let rerender = () => {
        // disables blocking, allowing the cycle to be regenerate
        isPrevent = false;
        // After the first render it disables the important condition
        if (rerender[IMPORTANT]) rerender[IMPORTANT] = false;
        try {
            render(
                hooks.load(self.render, { ...self[ELEMENT_PROPS] }),
                self,
                id
            );

            resolveUpdate();
        } catch (e) {
            self.error(e);
        }
    };
    // mark the first render as important, self speeds up the rendering
    rerender[IMPORTANT] = true;

    self.update = () => {
        if (isUnmount) return;
        let rendered = self.rendered;
        if (!isPrevent) {
            isPrevent = true;
            // create a promise to observe the status of the update
            rendered = promise(resolve => (resolveUpdate = resolve)).then(
                // the UPDATED state is only propagated through
                // the resolution of the promise
                // Why? ... to improve communication between web-component parent and children
                hooks.updated
            );

            // if the component is already mounted, avoid using self.mounted,
            // to speed up the microtask
            isMounted
                ? addQueue(rerender)
                : self.mounted.then(() => {
                      isMounted = true;
                      addQueue(rerender);
                  });
        }

        return (self.rendered = rendered);
    };

    // any update from hook is added to a separate queue
    let hooks = createHookCollection(() => addQueue(self.update), self);

    // creates a collection of microtask
    // associated with the mounted of the component

    self.mounted = promise(
        resolve =>
            (self.mount = () => {
                isMounted = false;
                // allows the reuse of the component when it is isUnmounted and mounted
                if (isUnmount == true) {
                    isUnmount = false;
                    self.mounted = self.update();
                }
                resolve();
            })
    );
    /**
     * creates a collection of microtask
     * associated with the unmounted of the component
     */
    self.unmounted = promise(
        resolve =>
            (self.unmount = () => {
                isUnmount = true;
                hooks.unmount();
                resolve();
            })
    );

    self.initialize();

    self.update();
}

class AtomicoElement extends HTMLElement {
    constructor() {
        super();
        /**
         * identifier to store the virtual-dom state,
         * this is unique between instances of the
         * component to securely consider the host status
         */
        load(this);
    }
    connectedCallback() {
        load(this);
        this.mount();
    }
    disconnectedCallback() {
        this.unmount();
    }
    attributeChangedCallback(attr, oldValue, value) {
        if (attr === this[ELEMENT_IGNORE_ATTR] || oldValue === value) return;
        this[attrToProp(attr)] = value;
    }
}

/**
 * register the component, be it a class or function
 * @param {string} nodeType
 * @param {Function} component
 * @return {Function} returns a jsx component
 */
export function customElement(nodeType, component) {
    if (isFunction(nodeType)) {
        component = nodeType;

        let CustomElement = class extends AtomicoElement {};
        let prototype = CustomElement.prototype;

        let props = component.props;

        prototype.error = component.error || console.error;
        prototype.render = component;
        // allows to define the default values of the props
        prototype.initialize = function() {
            let length = initialize.length;
            while (length--) initialize[length](this);
        };
        /**@type {Function[]}*/
        let initialize = [];
        /**@type {string[]} */
        let attrs = [];

        for (let prop in props)
            setProperty(prototype, initialize, attrs, prop, props[prop]);

        CustomElement.observedAttributes = attrs;

        return CustomElement;
    } else {
        customElements.define(nodeType, customElement(component));
        return props => createElement(nodeType, props);
    }
}

function setProperty(prototype, initialize, attrs, prop, schema) {
    let attr = propToAttr(prop);

    schema = schema.name ? { type: schema } : schema;

    // avoid rewriting the prototype
    if (prop in prototype) return;

    function set(nextValue) {
        let prevValue = this[ELEMENT_PROPS][prop];

        if (isFunction(nextValue)) {
            nextValue = nextValue(prevValue);
        }
        let { value, error } = formatType(nextValue, schema.type);

        if (error && value != null) {
            throw `the observable [${prop}] must be of the type [${schema.type.name}]`;
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
        initialize.push(self => (self[prop] = schema.value));
    }
    attrs.push(attr);
}
