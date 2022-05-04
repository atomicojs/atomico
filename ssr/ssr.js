import "./document.js";
import { tags } from "./elements.js";
import { options } from "../src/options.js";
import { createHooks } from "atomico/test-hooks";

options.sheet = false;

const Once = new Set();

class Attributes {
    toString() {
        const attrs = new Map();
        for (let prop in this) {
            const attr = prop.replace(
                /([\w])([A-Z])/g,
                (all, before, after) => before + "-" + after.toLowerCase()
            );
            const value = this[prop];
            const type = typeof value;
            if (type === "boolean") {
                if (value) attrs.set(attr);
            } else if (type === "object") {
                attrs.set(attr, JSON.stringify(value));
            } else if (type != "function") {
                attrs.set(attr, value);
            }
        }
        const list = [...attrs];
        return list.length
            ? ` ${list
                  .map(([attr, value]) =>
                      value != null ? `${attr}="${value}"` : attr
                  )
                  .join(" ")} `
            : "";
    }
}

options.render = function (fragmentAfter = "") {
    let { type, props, children, shadow, raw } = this;
    let fragmentBefore = "";
    const currentProps = { ...props };
    const attrs = new Attributes();

    if (type === "host") {
        type = "template";
        props = { shadowroot: shadow ? "open" : "closed" };
    }

    if (
        (typeof type === "string" && type.includes("-") && tags[type]) ||
        raw === 2
    ) {
        const Element = raw === 2 ? type : tags[type];

        if (raw === 2) {
            const { is, localName } = type;
            if (is) {
                currentProps.is = localName;
                type = is;
            } else {
                type = localName;
            }
        }

        if (!Once.has(Element)) {
            const { observedAttributes } = Element;
            Once.add(Element);
        }

        const { props: schemaProps } = Element;
        const { styles } = Element;

        const instance = new Element();

        Object.assign(instance, currentProps);

        const hooks = createHooks(() => {}, instance);

        try {
            const html = hooks.load(instance._render);

            if (html.render) {
                fragmentBefore += html.render(
                    styles
                        .flat(100)
                        .filter((value) => value)
                        .reduce(
                            (fragment, { textContent }) =>
                                fragment +
                                `<style data-hydrate>${textContent}</style>`,
                            fragmentAfter
                        )
                );
                attrs.dataHydrate = true;
            }
        } catch (e) {
            console.log(e);
        }

        Object.entries(schemaProps).forEach(([prop, schema]) => {
            if (schema?.value != null) {
                attrs[prop] = schema?.value;
            }
        });
    }

    Object.entries(props).forEach(([prop, value]) => (attrs[prop] = value));

    const innerHTML = (Array.isArray(children) ? children : [children])
        .flat(1000)
        .filter((value) => (value == null || value === false ? false : true))
        .map((child) =>
            child.render ? child.render() : `<span>${child}</span>`
        );

    if (type === "template" && !shadow) {
        return innerHTML.join("");
    }

    const html = `<${type}${attrs}>${fragmentBefore}${innerHTML.join(
        ""
    )}${fragmentAfter}</${type}>`;

    return html;
};
