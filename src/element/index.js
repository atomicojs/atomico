import { createElement, render } from "../core";
import { isFunction, isArray } from "../core/utils";
import { PROPS, IGNORE_ATTR } from "./constants";
import { formatType, setAttr, propToAttr, attrToProp } from "./utils";
export * from "./hooks";

export class Element extends HTMLElement {
	constructor() {
		super();
		/**
		 * @namespace
		 * @property {string} id - identifier to store the state of the virtual-dom
		 * @property {HTMLElement} bind - allows bindear events defining as context the same customElement
		 * @property {boolean} host - allows to enable control over the main container, in this case the customElement
		 */
		let options = {
			id: Symbol(),
			bind: this,
			host: true
		};

		let { initialize } = this.constructor;
		let length = initialize.length;
		this.render = this.render.bind(this);
		this[PROPS] = {};
		this.mounted = new Promise(mount => (this.mount = mount));
		this.update = () => {
			if (!this.process) {
				this.process = this.mounted.then(() => {
					render(
						createElement(this.render, { ...this[PROPS] }),
						this,
						options
					);
					this.process = false;
				});
			}
			return this.process;
		};

		this.destroy = () => render("", this, options);

		this.update();

		while (length--) initialize[length](this);
	}
	connectedCallback() {
		this.mount();
	}
	disconnectedCallback() {
		this.destroy();
	}
	attributeChangedCallback(attr, oldValue, value) {
		if (attr === this[IGNORE_ATTR] || oldValue === value) return;
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
						if (value == this[PROPS][prop]) return;
						if (schema.reflect) {
							// the default properties are only reflected once the web-component is mounted
							this.mounted.then(() => {
								this[IGNORE_ATTR] = attr; //update is prevented
								setAttr(
									this,
									attr,
									schema.type == Boolean && !value
										? null
										: value //
								);
								this[IGNORE_ATTR] = false; // an upcoming update is allowed
							});
						}
						this[PROPS][prop] = value;
						this.update();
					},
					get() {
						return this[PROPS][prop];
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

export function css(string) {
	let args = arguments;
	return string
		.map((value, index) => value + (args[index + 1] || ""))
		.join("");
}
