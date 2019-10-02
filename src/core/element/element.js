import { ELEMENT_HOOK, ELEMENT_PROPS, ELEMENT_IGNORE_ATTR } from "../constants";
import { createHookCollection } from "../hooks";
import { render } from "../render/render";
import { formatType, setAttr, propToAttr, attrToProp } from "./utils";
import { isFunction } from "../utils";

export class Element extends HTMLElement {
	constructor() {
		super();
		/**
		 * @namespace
		 * @property {string} id - identifier to store the state of the virtual-dom
		 * @property {HTMLElement} bind - allows bindear events defining as context the same customElement
		 * @property {boolean} host - allows to enable control over the main container, in this case the customElement
		 */

		let id = Symbol();
		let { initialize } = this.constructor;
		let length = initialize.length;

		this.render = this.render.bind(this);

		this[ELEMENT_PROPS] = {};

		this.mounted = new Promise(mount => (this.mount = mount));
		this.update = () => {
			if (!this.process) {
				this.process = this.mounted.then(() => {
					let view = this[ELEMENT_HOOK].load(this.render);
					render(view, this, id);
					this.process = false;
				});
			}
			return this.process;
		};

		this.update();

		this[ELEMENT_HOOK] = createHookCollection(this.update, this);

		while (length--) initialize[length](this);
	}
	connectedCallback() {
		this.mount();
	}
	disconnectedCallback() {
		this[ELEMENT_HOOK].clean();
	}
	attributeChangedCallback(attr, oldValue, value) {
		if (attr === this[ELEMENT_IGNORE_ATTR] || oldValue === value) return;
		this[attrToProp(attr)] = value;
	}
	static get observedAttributes() {
		let { props, prototype } = this;
		this.initialize = []; //allows subscribers to be added to the web-component constructor
		if (!props) return [];
		return Object.keys(props).map(prop => {
			let attr = propToAttr(prop);

			/**
			 * @namespace
			 * @property {any} type
			 * @property {boolean} reflect
			 * @property {value} any
			 */
			let schema = props[prop].name ? { type: props[prop] } : props[prop];

			if (!(prop in prototype)) {
				Object.defineProperty(prototype, prop, {
					set(nextValue) {
						let { value, error } = formatType(
							nextValue,
							schema.type
						);
						if (error && value != null) {
							throw `the observable [${prop}] must be of the type [${schema.type.name}]`;
						}
						if (value == this[ELEMENT_PROPS][prop]) return;
						if (schema.reflect) {
							// the default properties are only reflected once the web-component is mounted
							this.mounted.then(() => {
								this[ELEMENT_IGNORE_ATTR] = attr; //update is prevented
								setAttr(
									this,
									attr,
									schema.type == Boolean && !value
										? null
										: value //
								);
								this[ELEMENT_IGNORE_ATTR] = false; // an upcoming update is allowed
							});
						}
						this[ELEMENT_PROPS][prop] = value;
						this.update();
					},
					get() {
						return this[ELEMENT_PROPS][prop];
					}
				});
			}
			if ("value" in schema)
				this.initialize.push(self => (self[prop] = schema.value));
			return attr;
		});
	}
}

/**
 * register the component, be it a class or function
 * @param {string} tagName
 * @param {Function} component
 * @return {Object} returns a jsx component
 */
export function customElement(tagName, component) {
	if (isFunction(tagName)) {
		component = tagName;
		let CustomElement = class extends Element {};
		CustomElement.prototype.render = component;
		CustomElement.props = component.props;
		return CustomElement;
	} else {
		customElements.define(
			tagName,
			component instanceof Element ? component : customElement(component)
		);
		return props => createElement(tagName, props);
	}
}
