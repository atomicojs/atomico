export const ARRAY_EMPTY = [];
export const OBJECT_EMPTY = {};

export const STATE = Symbol();
export const NODE_TYPE = "localName";

export const NODE_HOST = "host";

export const COMPONENT_CREATE = Symbol();
export const COMPONENT_UPDATE = Symbol();
export const COMPONENT_CREATED = Symbol();
export const COMPONENT_UPDATED = Symbol();
export const COMPONENT_CLEAR = Symbol();
export const COMPONENT_REMOVE = Symbol();

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

export const MEMO_EVENT_NAME = {};
