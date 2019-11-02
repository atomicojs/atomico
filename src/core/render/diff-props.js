import {
	CACHE_STYLE_SHEET,
	IGNORE_CHILDREN,
	HYDRATE_PROPS,
	KEY,
	SUPPORT_STYLE_SHEET
} from "../constants";
import { isFunction } from "../utils";
/**
 *
 * @param {import("./render").HTMLNode} node
 * @param {Object} props
 * @param {Object} nextProps
 * @param {boolean} isSvg
 * @param {Object} handlers
 **/
export function diffProps(node, props, nextProps, isSvg, handlers) {
	props = props || {};

	for (let key in props) {
		if (!(key in nextProps)) {
			setProperty(node, key, props[key], null, isSvg, handlers);
		}
	}
	let ignoreChildren;
	for (let key in nextProps) {
		setProperty(node, key, props[key], nextProps[key], isSvg, handlers);
		ignoreChildren = ignoreChildren || IGNORE_CHILDREN[key];
	}
	return ignoreChildren;
}

function setProperty(node, key, prevValue, nextValue, isSvg, handlers) {
	key = key == "class" && !isSvg ? "className" : key;
	// define empty value
	prevValue = prevValue == null ? null : prevValue;
	nextValue = nextValue == null ? null : nextValue;

	if (key in node && HYDRATE_PROPS[key]) {
		prevValue = node[key];
	}

	if (nextValue === prevValue) return;

	if (
		key[0] == "o" &&
		key[1] == "n" &&
		(isFunction(nextValue) || isFunction(prevValue))
	) {
		setEvent(node, key, nextValue, handlers);
		return;
	}

	switch (key) {
		/**
		 * add support {@link https://developer.mozilla.org/es/docs/Web/API/CSSStyleSheet}
		 */
		case "styleSheet":
			if (SUPPORT_STYLE_SHEET)
				node.shadowRoot.adoptedStyleSheets = []
					.concat(nextValue)
					.map(cssText => {
						if (cssText instanceof CSSStyleSheet) {
							return cssText;
						}
						if (!CACHE_STYLE_SHEET[cssText]) {
							CACHE_STYLE_SHEET[cssText] = new CSSStyleSheet();
							CACHE_STYLE_SHEET[cssText].replace(cssText);
						}

						return CACHE_STYLE_SHEET[cssText];
					});

			break;
		case "ref":
			if (nextValue) nextValue.current = node;
			break;
		case "style":
			setStyle(node, prevValue || "", nextValue || "");
			break;
		case "key":
			node[KEY] = nextValue;
			break;
		default:
			if (!isSvg && key != "list" && key in node) {
				node[key] = nextValue == null ? "" : nextValue;
			} else if (nextValue == null) {
				node.removeAttribute(key);
			} else {
				node.setAttribute(
					key,
					typeof nextValue == "object"
						? JSON.stringify(nextValue)
						: nextValue
				);
			}
	}
}

/**
 *
 * @param {import("./render").HTMLNode} node
 * @param {string} type
 * @param {function} [nextHandler]
 * @param {object} handlers
 */
export function setEvent(node, type, nextHandler, handlers) {
	// get the name of the event to use
	type = type.slice(type[2] == "-" ? 3 : 2);
	// add handleEvent to handlers
	if (!handlers.handleEvent) {
		/**
		 * {@link https://developer.mozilla.org/es/docs/Web/API/EventTarget/addEventListener#The_value_of_this_within_the_handler}
		 **/
		handlers.handleEvent = event => handlers[event.type].call(node, event);
	}
	if (nextHandler) {
		// create the subscriber if it does not exist
		if (!handlers[type]) {
			node.addEventListener(type, handlers);
		}
		// update the associated event
		handlers[type] = nextHandler;
	} else {
		// 	delete the associated event
		if (handlers[type]) {
			node.removeEventListener(type, handlers);
			delete handlers[type];
		}
	}
}
/**
 * define style as string inline,this generates less mutation
 * to the sun and cleans the previously defined properties.
 * @param {import("./render").HTMLNode} node
 * @param {(string|object)} prevValue
 * @param {(string|object)} nextValue
 */
function setStyle(node, prevValue, nextValue) {
	let style = node.style,
		prevIsObject;
	if (typeof prevValue == "object") {
		prevIsObject = true;
		for (let key in prevValue) {
			if (!(key in nextValue)) setPropertyStyle(style, key, null);
		}
	}
	if (typeof nextValue == "object") {
		for (let key in nextValue) {
			let value = nextValue[key];
			if (prevIsObject && prevValue[key] === value) continue;
			setPropertyStyle(style, key, value);
		}
	} else {
		style.cssText = nextValue;
	}
}

function setPropertyStyle(style, key, value) {
	let method = "setProperty";
	if (value == null) {
		method = "removeProperty";
		value = null;
	}
	if (~key.indexOf("-")) {
		style[method](key, value);
	} else {
		style[key] = value;
	}
}
