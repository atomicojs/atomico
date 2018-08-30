export function getMethods(proto) {
    let keys = [];
    do {
        keys = keys.concat(Object.getOwnPropertyNames(proto));
    } while ((proto = Object.getPrototypeOf(proto)));
    return keys;
}

export function getEvents(Root) {
    let regExp = /^on([A-Z])/,
        methods = getMethods(Root.prototype),
        events = [];
    for (let i = 0; i < methods.length; i++) {
        let method = methods[i];
        if (methods.indexOf(method) === i && regExp.test(method)) {
            events.push({
                method,
                type: method.replace(regExp, (all, letter) =>
                    letter.toLowerCase()
                )
            });
        }
    }
    return events;
}

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
        ] = /^json-/.test(prop) ? JSON.parse(value) : value;
    }
    return data;
}
