import { updateStyle } from "./updateStyle";
import { updateEvent } from "./updateEvent";
import { ATTRS_VALUE, SHADOWDOM } from "./constants";
// properties to ignore by updateProperties
const IGNORE = {
    children: 1
};
/**
 * define the properties of the node
 * @param {HTMLElement|SVGAElement} node
 * @param {object} nextProps
 * @param {boolean} isSvg
 */
export function updateProperties(node, nextProps, handlers, isSvg) {
    let currentProps = node[ATTRS_VALUE] || {};
    for (let key in currentProps) {
        // IGNORE allows you to ignore a property.
        if (IGNORE[key] || key === "ref") continue;
        // If the property does not exist in the following definition, it is eliminated
        if (!(key in nextProps)) {
            if (key === "key") {
                delete node.dataset.key;
            } else if (key in node) {
                node[key] = null;
            } else {
                node.removeAttribute(
                    isSvg && key === "xlink" ? "xlink:href" : key
                );
            }
            delete currentProps[key];
        }
    }
    for (let key in nextProps) {
        // IGNORE allows you to ignore a property.
        if (IGNORE[key]) continue;

        let isHandler;

        let nextValue = nextProps[key],
            typeNextValue = typeof nextValue;

        let prevValue = key in handlers ? handlers[key] : currentProps[key],
            typePrevValue = typeof prevValue;

        if (nextValue === prevValue) continue;

        if (key === "key") {
            if (node.dataset.key !== nextValue) node.dataset.key = nextValue;
            continue;
        }
        // updates the state of the ref object
        if (key === "ref") {
            if (nextValue) nextValue.current = node;
            continue;
        }

        // Enables the use of shadowDom over the node
        if (SHADOWDOM === key && "attachShadow" in node) {
            if (
                (node.shadowRoot && !nextValue) ||
                (!node.shadowRoot && nextValue)
            ) {
                node.attachShadow({ mode: nextValue ? "open" : "closed" });
            }
            continue;
        }

        if (typeNextValue === "function" || typePrevValue === "function") {
            updateEvent(node, key, prevValue, nextValue, handlers);
            isHandler = true;
        } else if ((key in node && !isSvg) || (isSvg && key === "style")) {
            if (key === "style") {
                nextValue = updateStyle(
                    node,
                    prevValue || node.style.cssText,
                    nextValue
                );
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
        if (!isHandler) {
            currentProps[key] = nextValue;
        }
    }
    node[ATTRS_VALUE] = currentProps;
}
