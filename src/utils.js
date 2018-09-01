export function getProps(props, element) {
    let data = {};
    for (let i = 0; i < props.length; i++) {
        let prop = props[i],
            value =
                element instanceof HTMLElement
                    ? element.getAttribute(prop)
                    : element[prop];

        data[
            prop.replace(/-+([\w])/g, (all, letter) => letter.toUpperCase())
        ] = value;
    }
    return data;
}

export function root(parent) {
    return parent.shadowRoot || parent;
}
export function remove(parent, child) {
    root(parent).removeChild(child);
}

export function append(parent, child) {
    root(parent).appendChild(child);
}

export function replace(parent, newChild, oldChild) {
    root(parent).replaceChild(newChild, oldChild);
}
