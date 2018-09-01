import { RECEIVE_PROPS, ELEMENT } from "./constants";

import { remove, append, replace, root } from "./utils";
import { VDom, h } from "./vdom";
/**
 * compares the attributes associated with the 2 render states
 * @param {HTMLELement} node
 * @param {Object} prev - properties that the node already has
 * @param {Object} next - object with the new properties to define the node
 * @param {Boolean} [svg] - define if the html element is a svg
 * @param {Object} [props] - allows to define if the instance belongs to a component, if so it
 *                         will rescue the properties associated to the method `static get props`
 *                         through this variable, manages to transfer mutations and new children
 *                         associated with it to the component.
 */
export function diffProps(node, prev, next, svg, props) {
    // generates a list of the existing attributes in both versions
    let keys = Object.keys(prev).concat(Object.keys(next));

    for (let i = 0; i < keys.length; i++) {
        let prop = keys[i];
        props = props === "class" ? "className" : props;
        if (prev[prop] !== next[prop]) {
            if (props && node._props.indexOf(prop) > -1) {
                props[prop] = next[prop];
                continue;
            }
            if (
                typeof next[prop] === "function" ||
                typeof prev[prop] === "function"
            ) {
                if (prev[prop]) node.removeEventListener(prop, prev[prop]);
                node.addEventListener(prop, next[prop]);
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
                    if (svg && prop === "xmlns") continue;
                    svg
                        ? node.setAttributeNS(null, prop, next[prop])
                        : node.setAttribute(prop, next[prop]);
                }
            } else {
                node.removeAttribute(prop);
            }
        }
    }
    if (props) node.dispatch(RECEIVE_PROPS, props);
}
/**
 * It allows to compare the 2 states of the render
 * @param {HTMLELement} parent - will receive the changes that the diff process determines
 * @param {Array} master - Previous state of the render
 * @param {Array} commit - Next render state
 * @param {Boolean} svg - define if the html element is a svg
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
                    cursor = svg
                        ? document.createElementNS(
                              "http://www.w3.org/2000/svg",
                              next.tag
                          )
                        : document.createElement(next.tag);
                    if (node) {
                        replace(parent, cursor, node);
                        // Avoid the merge if the node is a component
                        if (!cursor[ELEMENT]) {
                            while (node.firstChild) {
                                append(cursor, node.firstChild);
                            }
                        }
                    } else {
                        append(parent, cursor);
                    }
                } else {
                    cursor = document.createTextNode("");
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
                diffProps(
                    cursor,
                    prev.props,
                    next.props,
                    svg,
                    // of being an Atomico component, the object is created to transmit the mutations
                    cursor[ELEMENT] && {
                        children: next.children.map(({ children }) => children)
                    }
                );
                if (cursor && !cursor[ELEMENT]) {
                    diff(cursor, prev.children, next.children, svg);
                }
            }
        } else {
            if (node) remove(parent, node);
        }
    }
}
