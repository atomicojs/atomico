import { diff } from "./diff";
import { toVnode, createElement } from "./vnode";
import { STATE, NODE_HOST, OBJECT_EMPTY } from "./constants";

/**
 * @typedef {Object} ConfigRender
 * @property {string} id - namespace to store the state of the virtual-dom
 * @property {any} [bind] - Allows to bin events to a context this
 * @property {boolean} [host] - Allows a component to manipulate the main container
 **/

/**
 * @typedef {(HTMLElement|SVGElement|Text)} HTMLNode
 **/

/**
 *
 * @param {import("./vnode").Vnode} vnode
 * @param {HTMLNode} parent
 * @param {Object} [options]
 **/
export function render(vnode, parent, options = OBJECT_EMPTY) {
	/**@type {ConfigRender}*/
	let config = {
		id: options.id || STATE,
		bind: options.bind,
		host: options.host
	};

	vnode = toVnode(vnode);

	if (!config.host && vnode.type != NODE_HOST) {
		vnode = createElement(NODE_HOST, {}, vnode);
	}

	diff(config, parent, vnode, OBJECT_EMPTY);
}
