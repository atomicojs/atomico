import { EVENT_ALIAS, NODE_HANDLERS } from "./constants";

const IGNORE = {
    children: 1
};

const IGNORE_CHILDREN = {
    innerHTML: 1,
    textContent: 1,
    contenteditable: 1
};

const CSS_PROPS = {};

export function diffProps(node, props, nextProps, isSvg, handlers) {
    props = props || {};
    for (let key in props) {
        if (IGNORE[key]) continue;
        if (key in nextProps) {
            if (!(key in nextProps)) {
                setProperty(node, key, "", null, isSvg, handlers);
            }
        }
    }
    //let ignoreChildren;
    for (let key in nextProps) {
        if (IGNORE[key]) continue;
        setProperty(node, key, props[key], nextProps[key], isSvg, handlers);
        //ignoreChildren = ignoreChildren || ignoreChildren[key];
    }
    //return ignoreChildren;
}

function setProperty(node, key, prevValue, nextValue, isSvg, handlers) {
    prevValue = prevValue == undefined ? null : prevValue;
    nextValue = nextValue == undefined ? null : nextValue;
    if (nextValue === prevValue) return;
    if (
        key[0] === "o" &&
        key[1] === "n" &&
        (typeof nextValue === "function" || typeof prevValue === "function")
    ) {
        setEvent(node, key, nextValue, handlers);
        return;
    }

    switch (key) {
        case "ref":
            if (nextValue) nextValue.current = node;
            break;
        case "style":
            nextValue = setStyle(
                node,
                prevValue || node.style.cssText,
                nextValue
            );
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
}

export function setEvent(node, type, nextHandler, handlers) {
    if (!EVENT_ALIAS[type]) {
        EVENT_ALIAS[type] = type.slice(2).toLocaleLowerCase();
    }
    type = EVENT_ALIAS[type];

    if (nextHandler) {
        if (!handlers[type]) {
            handlers[type] = [
                event => {
                    handlers[type][1].call(node, event);
                }
            ];
            node.addEventListener(type, handlers[type][0]);
        }
        handlers[type][1] = nextHandler;
    } else {
        if (handlers[type]) {
            node.removeEventListener(type, handlers[type][0]);
            delete handlers[type];
        }
    }

    node[NODE_HANDLERS] = handlers;
}

function setStyle(node, prevValue, nextValue) {
    // this function has the previous state of the css directly from the node by the constant [CSS_VALUE]
    let prevCss = prevValue,
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

    return nextCss;
}
