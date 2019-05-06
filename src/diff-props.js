import {
	EVENT_ALIAS,
	IGNORE,
	IGNORE_CHILDREN,
	CSS_PROPS,
	FROM_DOM_PROPS
} from "./constants";
/**
 *
 * @param {import("./render").HTMLNode} node
 * @param {Object} props
 * @param {Object} nextProps
 * @param {boolean} isSvg
 * @param {Object} handlers
 * @param {any} [bindEvent]
 **/
export function diffProps(node, props, nextProps, isSvg, handlers, bindEvent) {
	props = props || {};

	for (let key in props) {
		if (IGNORE[key]) continue;
		if (!(key in nextProps)) {
			setProperty(node, key, props[key], null, isSvg, handlers);
		}
	}
	let ignoreChildren;
	for (let key in nextProps) {
		if (IGNORE[key]) continue;
		setProperty(
			node,
			key,
			props[key],
			nextProps[key],
			isSvg,
			handlers,
			bindEvent
		);
		ignoreChildren = ignoreChildren || IGNORE_CHILDREN[key];
	}
	return ignoreChildren;
}

function setProperty(
	node,
	key,
	prevValue,
	nextValue,
	isSvg,
	handlers,
	bindEvent
) {
	key = key == "class" && !isSvg ? "className" : key;
	// define empty value
	prevValue = prevValue == null ? null : prevValue;
	nextValue = nextValue == null ? null : nextValue;

	if (key in node && FROM_DOM_PROPS[key]) {
		prevValue = node[key];
	}

	if (nextValue === prevValue) return;

	if (
		key[0] == "o" &&
		key[1] == "n" &&
		(typeof nextValue == "function" || typeof prevValue == "function")
	) {
		setEvent(node, key, nextValue, handlers, bindEvent);
		return;
	}

	switch (key) {
		case "ref":
			if (nextValue) nextValue.current = node;
			break;
		case "style":
			setStyle(node, prevValue || node.style.cssText, nextValue);
			break;
		case "shadowDom":
			if ("attachShadow" in node) {
				if (
					(node.shadowRoot && !nextValue) ||
					(!node.shadowRoot && nextValue)
				) {
					node.attachShadow({ mode: nextValue ? "open" : "closed" });
				}
			}
			break;
		case "key":
			key = "data-key";
			if (nextValue == null) {
				delete node.dataset.key;
			} else {
				node.dataset.key = nextValue;
			}
			break;
		default:
			if (!isSvg && key != "list" && key in node) {
				node[key] = nextValue == null ? "" : nextValue;
			} else if (nextValue == null) {
				node.removeAttribute(key);
			} else {
				node.setAttribute(key, nextValue);
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
export function setEvent(node, type, nextHandler, handlers, bindEvent) {
	// memorize the transformation
	if (!EVENT_ALIAS[type]) {
		EVENT_ALIAS[type] = type.slice(2).toLocaleLowerCase();
	}
	// get the name of the event to use
	type = EVENT_ALIAS[type];
	// add handleEvent to handlers
	if (!handlers.handleEvent) {
		/**
		 * {@link https://developer.mozilla.org/es/docs/Web/API/EventTarget/addEventListener#The_value_of_this_within_the_handler}
		 **/
		handlers.handleEvent = event => handlers[event.type].call(bindEvent, event);
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
	let prevCss = prevValue,
		nextCss = nextValue;
	if (typeof nextCss == "object") {
		nextCss = "";
		for (let key in nextValue) {
			if (!nextValue[key]) continue;
			// memorizes the transformations associated with CSS properties
			if (!CSS_PROPS[key]) {
				CSS_PROPS[key] = key.replace(/([A-Z])/g, "-$1").toLowerCase();
			}
			nextCss += `${CSS_PROPS[key]}:${nextValue[key]};`;
		}
	}
	if (prevCss != nextCss) {
		node.style.cssText = nextCss;
	}
}
