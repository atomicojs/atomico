import {
	SUPPORT_STYLE_SHEET,
	META_STYLE_SHEET,
	META_MAP_CHILDREN,
	STYLE_SHEET_KEY,
	META_KEYES
} from "./constants";
import { isArray } from "./utils";

/**
 * @param {VnodeType} type
 * @param {VnodeProps} [props]
 * @param {Vnode|Vnode[]} [children]
 * @returns {Vnode}
 **/
export function createElement($type, props, ...children) {
	let vnode = { $type, children, ...props };
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
		return createElement(null, { children: "" + value });
	} else {
		if (!value[META_MAP_CHILDREN]) {
			let scan = mapChildren(value.children);
			value.children = scan.children;
			if (scan.keyes) {
				value[META_KEYES] = scan.keyes;
			}
			value[META_MAP_CHILDREN] = true;
		}
		if (value.styleSheet && !SUPPORT_STYLE_SHEET) {
			if (!value[META_STYLE_SHEET]) {
				value.children.unshift(
					toVnode(
						createElement(
							"style",
							value[META_KEYES] ? { key: STYLE_SHEET_KEY } : {},
							value.styleSheet
						)
					)
				);
			}
			value[META_STYLE_SHEET] = true;
		}
	}
	return value;
}

function mapChildren(children, scan = { children: [] }, deep = 0) {
	if (isArray(children)) {
		let length = children.length;
		for (let i = 0; i < length; i++) {
			mapChildren(children[i], scan, deep + 1);
		}
	} else {
		if (children == null && !deep) return scan;

		let vnode = toVnode(children);

		if ("key" in vnode) {
			scan.keyes = scan.keyes || [];
			if (!~scan.keyes.indexOf(vnode.key)) {
				scan.keyes.push(vnode.key);
			}
		}

		scan.children.push(vnode);
	}
	return scan;
}

/**
 * @typedef {(Object<string,any>)} VnodeProps;
 *
 * @typedef {(Function|string)} VnodeType;
 *
 * @typedef {{type:VnodeType,props:VnodeProps}} Vnode
 **/
