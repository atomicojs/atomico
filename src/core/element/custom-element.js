import { createHooks } from "../create-hooks";
import { render } from "../render";
import { BaseElement } from "./base-element";
import { isFunction } from "../utils";

export { Any, BaseElement } from "./base-element";
/**
 * Wrap the configuration that unites base-element and Atomico
 * @param {Function} component
 * @returns {HTMLElement}
 */
function createCustomElement(component) {
    let Element = class extends BaseElement {
        async create() {
            let id = Symbol();

            this.update = () => {
                render(hooks.load(component, { ...this._props }), this, id);
                hooks.updated();
            };

            let hooks = createHooks(() => this._update(), this);

            await this.unmounted;

            hooks.unmount();
        }
    };

    Element.props = component.props;

    return Element;
}
/**
 * Create and register an Atomico component as a Webcomponent
 * @param {string|Function} nodeType
 * @param {function} [component]
 */
export const customElement = (nodeType, component) =>
    isFunction(nodeType)
        ? createCustomElement(nodeType)
        : customElements.define(nodeType, createCustomElement(component));
