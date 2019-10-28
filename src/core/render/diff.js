import { KEY, ARRAY_EMPTY, NODE_TYPE, NODE_HOST } from "../constants";
import { diffProps } from "./diff-props";
import { isArray, isFunction } from "../utils";
import { toVnode } from "../vnode";

/**
 *
 * @param {import("./render").ConfigRender} config
 * @param {import("./render").HTMLNode} node
 * @param {import("./vnode").Vnode} nextVnode
 * @param {boolean} isSvg
 * @param {Function} currentUpdateComponent
 * @return {import("./render").HTMLNode}
 **/
export function diff(id, node, nextVnode, isSvg) {
	let { vnode, handlers = {} } = (node && node[id]) || {};

	if (vnode == nextVnode) return node;

	vnode = vnode || { props: {} };

	let { type, props } = nextVnode;
	let { shadowDom, children } = props;

	isSvg = isSvg || type == "svg";

	if (type != NODE_HOST && getNodeName(node) !== type) {
		let nextNode = createNode(type, isSvg);
		let parent = node && node.parentNode;

		if (parent) {
			parent.replaceChild(nextNode, node);
		}

		node = nextNode;
		handlers = {};
	}
	if (type == null) {
		if (node.nodeValue != children) {
			node.nodeValue = children;
		}
	} else {
		if (vnode.props.shadowDom != shadowDom) {
			let { shadowRoot } = node;
			let mode =
				shadowDom && !shadowRoot
					? "open"
					: !shadowDom && shadowRoot
					? "closed"
					: 0;
			if (mode) node.attachShadow({ mode });
		}

		let ignoreChildren = diffProps(
			node,
			vnode.props,
			props,
			isSvg,
			handlers,
			id
		);
		if (!ignoreChildren && vnode.props.children != children) {
			diffChildren(
				id,
				shadowDom ? node.shadowRoot : node,
				children,
				isSvg
			);
		}
	}
	node[id] = { vnode: nextVnode, handlers };
	return node;
}
/**
 *
 * @param {import("./render").ConfigRender} config
 * @param {import("./render").HTMLNode} parent
 * @param {import("./vnode").Vnode[]} [nextChildren]
 * @param {boolean} isSvg
 */
export function diffChildren(id, parent, nextChildren, isSvg) {
	let keyes = [];
	let children = toList(nextChildren, false, keyes);
	let childrenLenght = children.length;

	let { childNodes } = parent;
	let childNodesKeyes = {};
	let childNodesLength = childNodes.length;
	let withKeyes = keyes.withKeyes;
	let index = withKeyes
		? 0
		: childNodesLength > childrenLenght
		? childrenLenght
		: childNodesLength;

	for (; index < childNodesLength; index++) {
		let childNode = childNodes[index];
		let key = index;
		if (withKeyes) {
			key = childNode[KEY];
			if (keyes.indexOf(key) > -1) {
				childNodesKeyes[key] = childNode;
				continue;
			}
		}
		index--;
		childNodesLength--;
		parent.removeChild(childNode);
	}
	for (let i = 0; i < childrenLenght; i++) {
		let child = children[i];
		let indexChildNode = childNodes[i];
		let key = withKeyes ? child.key : i;
		let childNode = withKeyes ? childNodesKeyes[key] : indexChildNode;

		if (withKeyes && childNode) {
			if (childNode != indexChildNode) {
				parent.insertBefore(childNode, indexChildNode);
			}
		}

		if (withKeyes && child.type == null) {
			continue;
		}

		let nextChildNode = diff(
			id,
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

/**
 *
 * @param {string} type
 * @param {boolean} isSvg
 * @returns {import("./render").HTMLNode}
 */
export function createNode(type, isSvg) {
	let doc = document;
	let nextNode;
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
		if (isFunction(vnode.type)) {
			toList(vnode.type(vnode.props), map, keyes, list, deep + 1);
			return list;
		}
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
