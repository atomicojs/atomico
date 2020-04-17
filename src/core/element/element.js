import { createHooks } from "../create-hooks";
import { render } from "../render/render";
import { BaseElement } from "./base-element";
import { isFunction } from "../utils";

export { Any } from "./base-element";

function createCustomElement(component) {
  let Element = class extends BaseElement {
    async setup() {
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

export const customElement = (nodeType, component) =>
  isFunction(nodeType)
    ? createCustomElement(nodeType)
    : customElements.define(nodeType, createCustomElement(component));
