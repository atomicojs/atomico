export function getProps(props, element, data = {}) {
    let dom = element instanceof HTMLElement;
    for (let i = 0; i < props.length; i++) {
        let prop = props[i],
            value = dom ? element.getAttribute(prop) : element[prop];
        if (dom && value === "") value = true;
        data[prop.replace(/-+([\w])/g, (all, letter) => letter.toUpperCase())] =
            value === null ? undefined : value;
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
