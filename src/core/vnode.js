import { isArray, assign } from "./utils";

const SUPPORT_STYLE_SHEET = "adoptedStyleSheets" in document;

const STYLE_SHEET_KEY = Symbol();
/**
 * @param {VnodeType} type
 * @param {VnodeProps} [props]
 * @param {Vnode|Vnode[]} [children]
 * @returns {Vnode}
 **/
export function createElement(type, props, children) {
	props = assign({}, props);
	if (arguments.length > 3) {
		children = [children];
		for (let i = 3; i < arguments.length; i++) {
			children.push(arguments[i]);
		}
	}
	if (children != null) {
		props.children = children;
	}

	let vnode = { type, props },
		key = props.key;
	if (key != null) {
		vnode.key = key;
	}

	if (!SUPPORT_STYLE_SHEET && props.styleSheet) {
		props.children = [].concat(
			props.children,
			createElement(
				"style",
				someKeyes(props.children)
					? {
							key: STYLE_SHEET_KEY
					  }
					: null,
				props.styleSheet
			)
		);
		delete props.styleSheet;
	}
	/**@type {Vnode} */
	return vnode;
}
/**
 * Create or maintain a vnode, if this is boolean,
 * string or null returns a text type vnode
 * @param {(Vnode|string|null|boolean)} value
 * @returns {Vnode}
 **/
export function toVnode(value) {
	if (value == null || typeof value == "boolean") value = "";

	if (typeof value == "string" || typeof value == "number") {
		return createElement(null, null, "" + value);
	}

	return value;
}

export function someKeyes(children) {
	children = isArray(children) ? children : [children];
	let length = children.length;
	while (length--) {
		if (isArray(children[length]) && someKeyes(children[length])) {
			return true;
		}
		if (
			children[length] != null &&
			children[length].props &&
			"key" in children[length].props
		) {
			return true;
		}
	}
}

/**
 * @typedef {(Object<string,any>)} VnodeProps;
 *
 * @typedef {(Function|string)} VnodeType;
 *
 * @typedef {{type:VnodeType,props:VnodeProps}} Vnode
 **/
