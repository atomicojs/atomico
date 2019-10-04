export const HOOK_MOUNT = Symbol("hook.mount");
export const HOOK_MOUNTED = Symbol("hook.mounted");
export const HOOK_UPDATE = Symbol("hook.update");
export const HOOK_UPDATED = Symbol("hook.updated");
export const HOOK_UNMOUNT = Symbol("hook.unmount");
export const HOOK_CURRENT = {};

export const ELEMENT_PROPS = Symbol();
export const ELEMENT_CHANNELS = [];
export const ELEMENT_IGNORE_ATTR = Symbol();
export const ELEMENT_TRUE_VALUES = [true, 1, "", "1", "true"];

export const ARRAY_EMPTY = [];
export const OBJECT_EMPTY = {};

export const STATE = Symbol();
export const NODE_TYPE = "localName";

export const KEY = Symbol();

export const NODE_HOST = "host";

export const IGNORE_PROPS = {
	shadowDom: 1,
	children: 1
};

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

export const CACHE_EVENT_NAME = {};

export const CACHE_STYLE_SHEET = {};

export const SUPPORT_STYLE_SHEET = "adoptedStyleSheets" in document;

export const STYLE_SHEET_KEY = Symbol();
