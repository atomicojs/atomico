import { assign } from "./utils.js";
import { getCurrentComponent } from "./component.js";
/**
 * @typedef {import("./vnode").Vnode} Vnode
 */
/**@type {number} */
let counter = 0;
/**
 * @param {{id:string,defaultValue:any}}
 */
export function useContext({ id, defaultValue }) {
	let component = getCurrentComponent().component;
	return id in component.context ? component.context[id] : defaultValue;
}
/**
 * create a context object, which manipulates the context of the tree
 * @param {*} defaultValue
 */
export function createContext(defaultValue) {
	let id = Symbol("context"),
		Context = { Provider, Consumer, id, defaultValue };
	/**
	 * create a new context for children
	 * @param {{value:any,children:Vnode}}
	 * @returns {Vnode}
	 */
	function Provider({ value, children }) {
		let { component } = getCurrentComponent();
		if (component.context[id] != value) {
			component.context = assign({}, component.context, {
				[id]: value
			});
		}
		return children;
	}
	/**
	 * Get the current context
	 * @param {{children:Function}}
	 * @returns {Vnode}
	 */
	function Consumer({ children }) {
		return children(useContext(Context));
	}
	return Context;
}
