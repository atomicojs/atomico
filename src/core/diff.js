import {
	KEY,
	ARRAY_EMPTY,
	NODE_TYPE,
	NODE_HOST,
	COMPONENT_CLEAR,
	COMPONENT_UPDATE,
	COMPONENT_REMOVE
} from "./constants";
import { isArray, isFunction } from "./utils";
import { toVnode } from "./vnode";
import { options } from "./options";
import { diffProps } from "./diff-props";
import { createComponent } from "./component";

/**
 *
 * @param {import("./render").ConfigRender} config
 * @param {import("./render").HTMLNode} node
 * @param {import("./vnode").Vnode} nextVnode
 * @param {boolean} isSvg
 * @param {Function} currentUpdateComponent
 * @return {import("./render").HTMLNode}
 **/
export function diff(config, node, nextVnode, isSvg, currentUpdateComponent) {
	let { vnode, updateComponent, handlers = {} } =
		(node && node[config.id]) || {};

	if (vnode == nextVnode) return node;

	vnode = vnode || { props: {} };

	let { type, props } = nextVnode,
		{ shadowDom, children } = props,
		isComponent = isFunction(type);

	isSvg = isSvg || type == "svg";
	if (isComponent && !updateComponent) {
		updateComponent = createComponent(config, isSvg);
	}
	if (!isComponent && type != NODE_HOST && getNodeName(node) !== type) {
		let nextNode = createNode(type, isSvg),
			parent = node && node.parentNode;

		if (parent) {
			unmount(config, node, true, currentUpdateComponent);
			parent.replaceChild(nextNode, node);
		}

		node = nextNode;
		handlers = {};
	}
	if (updateComponent && currentUpdateComponent != updateComponent) {
		return updateComponent(COMPONENT_UPDATE, node, nextVnode);
	} else if (type == null) {
		if (node.nodeValue != children) {
			node.nodeValue = children;
		}
	} else {
		diffShadowDom(node, shadowDom);
		let ignoreChildren = diffProps(
			node,
			vnode.props,
			props,
			isSvg,
			handlers,
			config.bind
		);
		if (!ignoreChildren && vnode.props.children != children) {
			diffChildren(
				config,
				shadowDom ? node.shadowRoot : node,
				children,
				isSvg
			);
		}
	}
	node[config.id] = { vnode: nextVnode, handlers };
	return node;
}
/**
 *
 * @param {import("./render").ConfigRender} config
 * @param {import("./render").HTMLNode} parent
 * @param {import("./vnode").Vnode[]} [nextChildren]
 * @param {boolean} isSvg
 */
export function diffChildren(config, parent, nextChildren, isSvg) {
	let keyes = [],
		children = toList(nextChildren, false, keyes),
		childrenLenght = children.length;

	let { childNodes } = parent,
		childNodesKeyes = {},
		childNodesLength = childNodes.length,
		withKeyes = keyes.withKeyes,
		index = withKeyes
			? 0
			: childNodesLength > childrenLenght
			? childrenLenght
			: childNodesLength;
	for (; index < childNodesLength; index++) {
		let childNode = childNodes[index],
			key = index;
		if (withKeyes) {
			key = childNode[KEY];
			if (keyes.indexOf(key) > -1) {
				childNodesKeyes[key] = childNode;
				continue;
			}
		}
		unmount(config.id, childNode);
		index--;
		childNodesLength--;
		parent.removeChild(childNode);
	}
	for (let i = 0; i < childrenLenght; i++) {
		let child = children[i],
			indexChildNode = childNodes[i],
			key = withKeyes ? child.key : i,
			childNode = withKeyes ? childNodesKeyes[key] : indexChildNode;

		if (withKeyes && childNode) {
			if (childNode != indexChildNode) {
				parent.insertBefore(childNode, indexChildNode);
			}
		}

		if (withKeyes && child.type == null) {
			continue;
		}

		let nextChildNode = diff(
			config,
			!childNode && isFunction(child.type) ? createNode(null) : childNode,
			child,
			isSvg
		);

		if (!childNode) {
			if (childNodes[i]) {
				parent.insertBefore(nextChildNode, childNodes[i]);
			} else {
				parent.appendChild(nextChildNode);
			}
		}
	}
}

function diffShadowDom(node, state) {
	let { shadowRoot } = node,
		mode =
			state && !shadowRoot
				? "open"
				: !state && shadowRoot
				? "closed"
				: "";

	mode && node.attachShadow({ mode });
}
/**
 * Remove the node and issue the deletion if it belongs to a component
 * @param {string} id
 * @param {import("./render").HTMLNode} node
 * @param {boolean} clear
 * @param {function} currentUpdateComponent
 */
function unmount(id, node, clear, currentUpdateComponent) {
	let { updateComponent } = node[id] || {},
		childNodes = node.childNodes,
		length = childNodes.length;
	if (updateComponent && updateComponent != currentUpdateComponent) {
		updateComponent(clear ? COMPONENT_CLEAR : COMPONENT_REMOVE);
	}
	for (let i = 0; i < length; i++) {
		unmount(id, childNodes[i]);
	}
}
/**
 *
 * @param {string} type
 * @param {boolean} isSvg
 * @returns {import("./render").HTMLNode}
 */
export function createNode(type, isSvg) {
	let doc = options.document || document,
		nextNode;
	if (type != null) {
		nextNode = isSvg
			? doc.createElementNS("http://www.w3.org/2000/svg", type)
			: doc.createElement(type);
	} else {
		nextNode = doc.createTextNode("");
	}
	return nextNode;
}

/**
 * returns the localName of the node
 * @param {import("./render").HTMLNode} node
 */
export function getNodeName(node) {
	if (!node) return;
	if (!node[NODE_TYPE]) {
		node[NODE_TYPE] = node.nodeName.toLowerCase();
	}
	let localName = node[NODE_TYPE];
	return localName == "#text" ? null : localName;
}
/**
 * generates a flatmap of nodes
 * @param {?Array} children
 * @param {function} [map]
 * @param {string[]} keyes
 * @param {import("./vnode").Vnode[]} list
 * @param {number} deep
 * @returns {import("./vnode").Vnode[]}
 */
export function toList(children, map, keyes, list, deep = 0) {
	keyes = keyes || [];
	list = list || [];

	if (isArray(children)) {
		let length = children.length;
		for (let i = 0; i < length; i++) {
			toList(children[i], map, keyes, list, deep + 1);
		}
	} else {
		if (children == null && !deep) return ARRAY_EMPTY;
		let vnode = map ? map(children, list.length) : toVnode(children);
		if (!map) {
			if (typeof vnode == "object") {
				if (vnode.key != null) {
					if (keyes.indexOf(vnode.key) == -1) {
						keyes.push(vnode.key);
						keyes.withKeyes = true;
					}
				}
			}
		}
		list.push(vnode);
	}
	return list;
}
