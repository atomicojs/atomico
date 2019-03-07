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
    let attrsValues = node[ATTRS_VALUE] || {};
    for (let key in prevProps) {
        if (IGNORE[key]) continue;
        if (key in nextProps) {
            if (!(key in nextProps) && key in attrsValues) {
                setProperty(node, key, "", null, attrsValues, handlers, isSvg);
            }
        }
    }
    for (let key in nextProps) {
        if (IGNORE[key]) continue;
        setProperty(
            node,
            key,
            prevProps[key],
            nextProps[key],
            attrsValues,
            handlers,
            isSvg
        );
    }
    node[ATTRS_VALUE] = attrsValues;
}
function setProperty(
    node,
    key,
    prevValue,
    nextValue,
    attrsValues,
    handlers,
    isSvg
) {
    let merge = true;

    prevValue =
        key in handlers
            ? handlers[key]
            : prevValue === null
            ? prevValue
            : attrsValues[key];

    if (nextValue === prevValue) return;
    if (
        key[0] === "o" &&
        key[1] === "n" &&
        (typeof nextValue === "function" || typeof prevValue === "function")
    ) {
        updateEvent(node, key, prevValue, nextValue, handlers);
        return;
    }

    switch (key) {
        case "ref":
            if (nextValue) nextValue.current = node;
            break;
        case "style":
            nextValue = updateStyle(
                node,
                prevValue || node.style.cssText,
                nextValue
            );
            break;
        case SHADOWDOM:
            if ("attachShadow" in node) {
                if (
                    (node.shadowRoot && !nextValue) ||
                    (!node.shadowRoot && nextValue)
                ) {
                    node.attachShadow({ mode: nextValue ? "open" : "closed" });
                }
            }
            return;

        case "key":
            key = "data-key";
            if (nextValue === null) {
                delete node.dataset.key;
            } else {
                node.dataset.key = nextValue;
            }
            break;
        case "class":
        case "className":
            key = isSvg ? "class" : "className";
        default:
            if (key !== "list" && !isSvg && key in node) {
                node[key] = nextValue === null ? "" : nextValue;
            } else if (nextValue === null) {
                node.removeAttribute(key);
            } else {
                node.setAttribute(key, nextValue);
            }
    }

    attrsValues[key] = nextValue;
}
