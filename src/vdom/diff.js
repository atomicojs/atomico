import { remove, append, replace, createText, createElement } from "./dom";
import { VDom, h } from "./vdom";
/**
 * compares the attributes associated with the 2 render states
 * @param {HTMLELement} node
 * @param {Object} prev
 * @param {Object} next
 * @param {Boolean} svg
 */
export function diffProps(node, prev, next, svg) {
    // generates a list of the existing attributes in both versions
    let keys = Object.keys(prev).concat(Object.keys(next));
    for (let i = 0; i < keys.length; i++) {
        let prop = keys[i];
        if (prev[prop] !== next[prop]) {
            if (
                typeof next[prop] === "function" ||
                typeof prev[prop] === "function"
            ) {
                node[props.toLowerCase()] = next[prop] || null;
            } else if (prop in next) {
                if ((prop in node && !svg) || (svg && prop === "style")) {
                    if (prop === "style") {
                        if (typeof next[prop] === "object") {
                            for (let index in next[prop]) {
                                node.style[index] = next[prop][index];
                            }
                        } else {
                            node.style.cssText = next[prop];
                        }
                    } else {
                        node[prop] = next[prop];
                    }
                } else {
                    svg
                        ? node.setAttributeNS(null, prop, next[prop])
                        : node.setAttribute(prop, next[prop]);
                }
            } else {
                node.removeAttribute(prop);
            }
        }
    }
}
/**
 * It allows to compare the 2 states of the render
 * @param {HTMLELement} parent - will receive the changes that the diff process determines
 * @param {Array} master - Previous state of the render
 * @param {Array} commit - Next render state
 * @param {Boolean} svg
 */
export function diff(parent, master, commit, svg) {
    let children = parent.childNodes || [],
        length = Math.max(master.length, commit.length);
    for (let i = 0; i < length; i++) {
        let prev = master[i] || new VDom(),
            next = commit[i],
            node = children[i];

        if (next) {
            let cursor = node;
            svg = svg || next.tag === "svg";
            if (prev.tag !== next.tag) {
                if (next.tag) {
                    cursor = createElement(next.tag, svg);
                    if (node) {
                        replace(parent, cursor, node);
                        while (node.firstChild) {
                            cursor.appendChild(node.firstChild);
                        }
                    } else {
                        append(parent, cursor);
                    }
                } else {
                    cursor = createText();
                    if (prev.tag) {
                        replace(parent, cursor, node);
                    } else {
                        append(parent, cursor);
                    }
                }
            }
            if (cursor.nodeName === "#text") {
                if (prev.children !== next.children)
                    cursor.textContent = next.children;
            } else {
                diffProps(cursor, prev.props, next.props, svg);
                if (cursor) {
                    diff(cursor, prev.children, next.children, svg);
                }
            }
        } else {
            if (node) remove(parent, node);
        }
    }
}
