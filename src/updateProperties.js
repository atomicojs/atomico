import { updateStyle } from "./updateStyle";
import { updateEvent } from "./updateEvent";
import { ATTRS_VALUE, SHADOWDOM } from "./constants";
// properties to ignore by updateProperties
const IGNORE = {
    children: 1
};

function removeAttribute(node, isSvg, key) {
    node.removeAttribute(isSvg && key === "xlink" ? "xlink:href" : key);
}
/**
 * define the properties of the node
 * @param {HTMLElement|SVGAElement} node
 * @param {object} nextProps
 * @param {boolean} isSvg
 */
export function updateProperties(node, prevProps, nextProps, handlers, isSvg) {
    prevProps = prevProps || {};
    // currentProps, allows to isolate the manipulated properties,
    // to sustain a process of parallel states without conflict
    let currentProps = node[ATTRS_VALUE] || {};
    for (let key in prevProps) {
        // IGNORE allows you to ignore a property.
        if (IGNORE[key]) continue;
        // If the property does not exist in the following definition, it is eliminated
        if (!(key in nextProps) && key in currentProps) {
            if (key in node) {
                node[key] = null;
            } else {
                removeAttribute(node, isSvg, key);
            }
            delete currentProps[key];
        }
    }
    for (let key in nextProps) {
        // IGNORE allows you to ignore a property.
        if (IGNORE[key]) continue;

        let merge = true;

        let nextValue = nextProps[key],
            typeNextValue = typeof nextValue;
        // get the previous value either from handlers or currentProps
        let prevValue = key in handlers ? handlers[key] : currentProps[key],
            typePrevValue = typeof prevValue;
        // define undefined as value for empty comparison
        nextValue =
            nextValue === null || nextValue === undefined
                ? undefined
                : nextValue;

        if (nextValue === prevValue) continue;

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
            merge = false;
        } else if (
            nextValue !== undefined &&
            ((key in node && !isSvg) || (isSvg && key === "style"))
        ) {
            if (key === "style") {
                nextValue = updateStyle(
                    node,
                    prevValue || node.style.cssText,
                    nextValue
                );
            } else {
                node[key] = nextValue;
            }
        } else if (nextValue) {
            isSvg
                ? node.setAttributeNS(
                      isSvg && key === "xlink"
                          ? "http://www.w3.org/1999/xlink"
                          : null,
                      key === "xlink" ? "xlink:href" : key,
                      nextValue
                  )
                : node.setAttribute(key, nextValue);
        } else {
            // proceeds to remove the node attribute and remove the currentProps registry
            removeAttribute(node, isSvg, key);
            delete currentProps[key];
            merge = false;
        }
        if (merge) {
            currentProps[key] = nextValue;
        }
    }
    node[ATTRS_VALUE] = currentProps;
}
