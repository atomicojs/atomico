import { STATE, STATE_HOST, CSS_VALUE, KEY } from "./constants";
/**
 * memorizes the transformations associated with the css properties.
 * @example
 * {borderRadius:"50px"} // {"border-radius" : "50px"}
 */
const CSS_PROPS = {};
// propiedades a ignorar por updateProperties
const IGNORE = {
    context: 1,
    children: 1
};
/**
 * Allows you to add a single listening event
 * @param {Event} event
 */
function eventProxy(event) {
    return this[STATE].vnode.props[event.type](event);
}
/**
 * Allows you to add a single listening event
 * @param {Event} event
 */
function eventProxyHost(event) {
    return this[STATE_HOST].vnode.props[event.type](event);
}
/**
 * add a single addEventListener per event type
 * @param {HTMLElement|SVGElement} node
 * @param {string} type
 * @param {function|undefined} prevValue -
 * @param {function|undefined} nextValue
 */
export function updateEvent(node, type, prevValue, nextValue, isHost) {
    let useEventProxy = isHost ? eventProxyHost : eventProxy;
    if (prevValue && !nextValue) {
        node.removeEventListener(type, useEventProxy);
    }
    if (!prevValue && nextValue) {
        node.addEventListener(type, useEventProxy);
    }
}

/**
 * Define the style property immutably
 * @param {HTMLElement|SVGAElement} node
 * @param {object|string} nextValue
 */
export function updateStyle(node, nextValue) {
    // this function has the previous state of the css directly from the node by the constant [CSS_VALUE]
    let prevCss = node[CSS_VALUE] || "",
        // nextCss will be the next definition to store in the node
        nextCss = nextValue;
    if (typeof nextValue === "object") {
        nextCss = "";
        for (let key in nextValue) {
            if (!nextValue[key]) continue;
            if (!CSS_PROPS[key]) {
                CSS_PROPS[key] = key.replace(
                    /([^A-Z])([A-Z])/g,
                    (all, letterBefore, letterAfter) =>
                        letterBefore + "-" + letterAfter.toLowerCase()
                );
            }
            nextCss += `${CSS_PROPS[key]}:${nextValue[key]};`;
        }
    }
    if (prevCss !== nextCss) {
        node.style.cssText = nextCss;
    }
    // store the last state of style
    node[CSS_VALUE] = nextCss;
}
/**
 * define the properties of the node
 * @param {HTMLElement|SVGAElement} node
 * @param {object} nextProps
 * @param {boolean} isSvg
 */
export function updateProperties(node, prevProps, nextProps, isHost, isSvg) {
    prevProps = prevProps || {};

    for (let key in prevProps) {
        // IGNORE allows you to ignore a property.
        if (IGNORE[key] || key === "ref") continue;
        // If the property does not exist in the following definition, it is eliminated
        if (!(key in nextProps)) {
            if (key === "key") {
                delete node[KEY];
            } else if (key in node) {
                node[key] = null;
            } else {
                node.removeAttribute(
                    isSvg && key === "xlink" ? "xlink:href" : key
                );
            }
        }
    }
    for (let key in nextProps) {
        // IGNORE allows you to ignore a property.
        if (IGNORE[key]) continue;

        let nextValue = nextProps[key],
            prevValue = prevProps[key];

        if (nextValue === prevValue) continue;

        if (key === "key") {
            node[KEY] = nextValue;
            continue;
        }
        // updates the state of the ref object
        if (key === "ref") {
            if (nextValue) nextValue.current = node;
            continue;
        }

        if (key === "nodeValue") {
            if (node.nodeValue !== nextValue) node.nodeValue = nextValue;
            continue;
        }
        // Enables the use of shadowDom over the node
        if ("shadowDom" === key && "attachShadow" in node) {
            if (
                (node.shadowRoot && !nextValue) ||
                (!node.shadowRoot && nextValue)
            ) {
                node.attachShadow({ mode: nextValue ? "open" : "closed" });
            }
            continue;
        }

        // if prev Value or nextVal are functions, their behavior will be of event
        let isPrevValueFn = typeof prevValue === "function",
            isNextValueFn = typeof nextValue === "function";
        if (isPrevValueFn || isNextValueFn) {
            updateEvent(node, key, prevValue, nextValue, isHost);
        } else if ((key in node && !isSvg) || (isSvg && key === "style")) {
            if (key === "style") {
                updateStyle(node, nextValue);
            } else {
                node[key] = nextValue;
            }
        } else {
            isSvg
                ? node.setAttributeNS(
                      isSvg && key === "xlink"
                          ? "http://www.w3.org/1999/xlink"
                          : null,
                      key === "xlink" ? "xlink:href" : key,
                      nextValue
                  )
                : node.setAttribute(key, nextValue);
        }
    }
}
