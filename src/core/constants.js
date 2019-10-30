export const HOOK_MOUNT = Symbol("mount");
export const HOOK_MOUNTED = Symbol("mounted");
export const HOOK_UPDATE = Symbol("update");
export const HOOK_UPDATED = Symbol("updated");
export const HOOK_UNMOUNT = Symbol("unmount");
export const HOOK_CURRENT = {};

export const ELEMENT_PROPS = Symbol("a.props");
export const ELEMENT_IGNORE_ATTR = Symbol("a.ignore");
export const ELEMENT_TRUE_VALUES = [true, 1, "", "1", "true"];

export const ARRAY_EMPTY = [];

export const NODE_TYPE = "localName";

export const KEY = Symbol("a.key");

export const META_STYLE_SHEET = Symbol("styleSheet");

export const META_MAP_CHILDREN = Symbol("mapChildren");

export const META_KEYES = Symbol("keyes");

export const NODE_HOST = "host";

export const IGNORE_CHILDREN = {
	innerHTML: 1,
	textContent: 1,
	contenteditable: 1
};

export const HYDRATE_PROPS = {
	className: 1,
	id: 1,
	checked: 1,
	value: 1,
	selected: 1
};

export const CACHE_STYLE_SHEET = {};

export const SUPPORT_STYLE_SHEET = "adoptedStyleSheets" in document;

export const STYLE_SHEET_KEY = Symbol();
