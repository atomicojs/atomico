import { TAG, COMPONENTS, NODE_TEXT, NODE_HOST } from "./constants";
import { options } from "./options";
import { clearComponentEffects } from "./component";

/**
 * create a node based on a tag type
 * @param {string} tag
 * @param {boolean} isSvg
 * @returns {HTMLElement|SVGAElement|Text}
 */
export function createNode(tag, isSvg) {
    let doc = options.document || document;
    if (tag !== NODE_TEXT) {
        return isSvg
            ? doc.createElementNS("http://www.w3.org/2000/svg", tag)
            : doc.createElement(tag);
    } else {
        return doc.createTextNode("");
    }
}
/**
 * returns the localName of the node
 * @param {HTMLElement|SVGElement|Text} node
 */
export function defineNodeTag(node) {
    return (
        (node && (node[TAG] || (node[TAG] = node.nodeName.toLowerCase()))) || ""
    );
}
/**
 * maintains or creates a new node based on the requirement
 * @param {HTMLElement|SVGElement|Text|undefined} node
 * @param {string} nextTag
 * @param {boolean} isSvg
 * @return {HTMLElement|SVGAElement|Text}
 */
export function updateElement(node, nextTag, isSvg) {
    let prevTag = defineNodeTag(node);
    if (nextTag === NODE_HOST) return node;
    if (prevTag !== nextTag) {
        let element = createNode(nextTag, isSvg);

        element[TAG] = nextTag;

        return element;
    }
    return node;
}
