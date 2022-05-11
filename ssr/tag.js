const INTERNAL_PROPS = {
    children: 1,
    innerHTML: 1,
    textContent: 1,
    ref: 1,
    cloneNode: 1,
    staticNode: 1,
    shadowDom: 1,
    key: 1,
};

const serializeAttr = (value) =>
    value.toString().replace(
        /[&<>'"]/g,
        (tag) =>
            ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                "'": "&#39;",
                '"': "&quot;",
            }[tag])
    );

export class Attributes {
    toString() {
        const attrs = new Map();
        for (let prop in this) {
            const value = this[prop];
            const type = typeof value;

            if (INTERNAL_PROPS[prop] || type === "function" || prop[0] === "_")
                continue;

            const attr =
                prop === "className"
                    ? "class"
                    : prop.replace(
                          /([\w])([A-Z])/g,
                          (all, before, after) =>
                              before + "-" + after.toLowerCase()
                      );

            if (type === "boolean") {
                if (value) attrs.set(attr);
            } else if (type === "object") {
                attrs.set(attr, JSON.stringify(value));
            } else {
                attrs.set(attr, value);
            }
        }
        const list = [...attrs];
        return list.length
            ? ` ${list
                  .map(([attr, value]) =>
                      value != null ? `${attr}="${serializeAttr(value)}"` : attr
                  )
                  .join(" ")} `
            : "";
    }
}

export class Tag extends String {
    constructor(type, attributes, innerHTML) {
        super(`<${type}${attributes}>${innerHTML}</${type}>`);
        this.type = type;
        this.attributes = attributes;
        this.innerHTML = innerHTML;
    }
}
