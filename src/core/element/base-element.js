import { isFunction } from "../utils";

export const Any = null;

export class BaseElement extends HTMLElement {
  constructor() {
    super();
    this._setup();
  }
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

    this.prototype._setup = function () {
      this._attrs = {};
      this._props = {};

      init.forEach((fn) => fn(this));

      this.mounted = new Promise((resolve) => (this.mount = resolve));
      this.unmounted = new Promise((resolve) => (this.unmount = resolve));

      if (this.setup) this.setup();

      this._update();
    };

    return attrs;
  }
  attributeChangedCallback(attr, oldValue, value) {
    if (attr === this._ignoreAttr || oldValue === value) return;
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

const TRUE_VALUES = [true, 1, "", "1", "true"];

const NOT_CALLABLE = [Function, Any];

const getAttr = (prop) => prop.replace(/([A-Z])/g, "-$1").toLowerCase();

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

function setProxy(proto, prop, schema, attrs, init) {
  if (!(prop in proto)) {
    let { type, reflect, event, value, attr = getAttr(prop) } =
      typeof schema == "object" && schema != Any ? schema : { type: schema };

    let isCallable = !NOT_CALLABLE.includes(type);

    attrs.push(attr);

    function set(newValue) {
      let oldValue = this[prop];

      let { error, value } = filterValue(
        type,
        isCallable && isFunction(newValue) ? newValue(oldValue) : newValue
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
