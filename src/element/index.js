import BaseElement from "./base-element.js";
import { createElement, render } from "../core/index.js";

let cache = {};

export class Element extends BaseElement {
	constructor() {
		super();
		/**@type {boolean} */
		let prevent;
		/**
		 * @namespace
		 * @property {string} id - identifier to store the state of the virtual-dom
		 * @property {HTMLElement} bind - allows bindear events defining as context the same customElement
		 * @property {boolean} host - allows to enable control over the main container, in this case the customElement
		 */
		let options = {
			id: Symbol("state"),
			bind: this,
			host: true
		};
		/**
		 * add support {@link https://developer.mozilla.org/es/docs/Web/API/CSSStyleSheet}
		 */
		let { styles } = this.constructor;
		this.render = this.render.bind(this);
		let nextProps = {};
		/**
		 * @param {Object<string,any>} - Properties to update the component
		 */
		this.update = props => {
			for (let key in props) nextProps[key] = props[key];
			if (!prevent) {
				prevent = true;
				this.mounted.then(() => {
					let props = (this.props = { ...this.props });
					for (let key in nextProps) {
						let value = nextProps[key];
						if (value == null) {
							delete props[key];
						} else {
							props[key] = nextProps[key];
						}
					}
					nextProps = {};
					render(createElement(this.render, props), this, options);
					prevent = false;
					if (styles && this.shadowRoot) {
						this.shadowRoot.adoptedStyleSheets = styles;
						styles = null;
					}
				});
			}
		};

		this.unmounted.then(() => render("", this, options));

		this.update();
	}
}
/**
 * @param {Function} component
 * @example
 * // define a functional component
 * function MyWc(props){}
 * // define the observables of the component
 * MyWc.observables = {value:String}
 * // when using the toClass function the functional component will be a class
 * customElements.define("my-wc",createClass(MyWc));
 */
export function createClass(component) {
	let CustomElement = class extends Element {};
	CustomElement.prototype.render = component;
	CustomElement.observables = component.observables;
	CustomElement.styles = component.styles;
	return CustomElement;
}
/**
 * register the component, be it a class or function
 * @param {string} tagName
 * @param {Function} component
 * @return {Object} returns a jsx component
 */
export function customElement(tagName, component) {
	customElements.define(
		tagName,
		component instanceof Element ? component : createClass(component)
	);
	return props => createElement(tagName, props);
}

export function css(string) {
	if (Array.isArray(string)) {
		let args = arguments;
		string = string
			.map((value, index) => value + (args[index + 1] || ""))
			.join("");
	}
	if (!cache[string]) {
		cache[string] = new CSSStyleSheet();
		cache[string].replace(string);
	}
	return cache[string];
}
