export const NODE_TEXT = "#text";
export const NODE_HOST = "host";

export const TAG_VALUE = "@tag";

export const CSS_VALUE = "@css";

export const ATTRS_VALUE = "@attrs";

export const SHADOWDOM = "shadowDom";

export const COMPONENT_CREATE = "@create";
export const COMPONENT_UPDATE = "@update";
export const COMPONENT_CREATED = "@created";
export const COMPONENT_UPDATED = "@updated";
export const COMPONENT_CLEAR = "@clear";
export const COMPONENT_REMOVE = "@remove";
/**
 * if a list of children is empty in content it is
 * replaced by this constant with the intention
 * of simplifying the immutable comparison
 */
export const EMPTY_CHILDREN = [];
/**
 * stores the transformations created in update Event,
 * by manipulating the name of the event
 */
export const EVENT_ALIAS = {};
