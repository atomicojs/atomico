import { KEY, META_KEYES, NODE_TYPE, NODE_HOST } from "../constants";
import { diffProps } from "./diff-props";
import { isVnodeValue, createElement, fillVnodeValue } from "../vnode";
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

	if (vnode == nextVnode && vnode != null) return node;

	nextVnode = isVnodeValue(nextVnode) ? fillVnodeValue(nextVnode) : nextVnode;

	let { $type, shadowDom, children, ...props } = vnode || {};

	let {
		$type: $nextType,
		shadowDom: nextShadowDom,
		children: nextChildren,
		...nextProps
	} = nextVnode;

	isSvg = isSvg || $type == "svg";

	if ($nextType != NODE_HOST && getNodeName(node) !== $nextType) {
		let nextNode = createNode($nextType, isSvg);
		let parent = node && node.parentNode;

		if (parent) {
			parent.replaceChild(nextNode, node);
		}

		node = nextNode;
		handlers = {};
	}
	if ($nextType == null) {
		if (node.nodeValue != nextChildren) {
			node.nodeValue = nextChildren;
		}
	} else {
		if (shadowDom != nextShadowDom) {
			let { shadowRoot } = node;
			let mode =
				nextShadowDom && !shadowRoot
					? "open"
					: !nextShadowDom && shadowRoot
					? "closed"
					: 0;
			if (mode) node.attachShadow({ mode });
		}

		let ignoreChildren = diffProps(
			node,
			props,
			nextProps,
			isSvg,
			handlers,
			id
		);
		if (!ignoreChildren && children != nextChildren) {
			diffChildren(
				id,
				nextShadowDom ? node.shadowRoot : node,
				nextChildren,
				nextProps[META_KEYES],
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
export function diffChildren(id, parent, children, keyes, isSvg) {
	let childrenLenght = children.length;
	let { childNodes } = parent;
	let childNodesKeyes = {};
	let childNodesLength = childNodes.length;
	let index = keyes
		? 0
		: childNodesLength > childrenLenght
		? childrenLenght
		: childNodesLength;

	for (; index < childNodesLength; index++) {
		let childNode = childNodes[index];
		let key = index;
		if (keyes) {
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
		let key = keyes ? child.key : i;
		let childNode = keyes ? childNodesKeyes[key] : indexChildNode;

		if (keyes && childNode) {
			if (childNode != indexChildNode) {
				parent.insertBefore(childNode, indexChildNode);
			}
		}

		let nextChildNode = diff(id, childNode, child, isSvg);

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
