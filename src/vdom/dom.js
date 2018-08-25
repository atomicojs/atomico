export function remove(parent, child) {
    parent.removeChild(child);
}

export function append(parent, child) {
    parent.appendChild(child);
}

export function replace(parent, newChild, oldChild) {
    parent.replaceChild(newChild, oldChild);
}

export function createText() {
    return document.createTextNode("");
}

export function createElement(tag, svg) {
    return svg
        ? document.createElementNS("http://www.w3.org/2000/svg", tag)
        : document.createElement(tag);
}
