import "./document.js";
import { options } from "../src/options.js";
import { createHooks } from "../src/hooks/create-hooks.js";
import { IS, NAME } from "./constants.js";

setOptions(options);

const ONCE = new Set();

const INTERNAL_PROPS = { children: 1, innerHTML: 1, textContent: 1 };

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

class Attributes {
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

/**
 *
 * @param {{sheet?:boolean,render:(param:any)=>string}} options
 */
export function setOptions(options) {
    options.sheet = false;
    options.render = function (fragmentAfter = "") {
        let { type, props, children, shadow, raw } = this;
        let fragmentBefore = "";
        let currentProps = { ...props };
        const attrs = new Attributes();

        if (type === "host") {
            type = "template";
            currentProps = { shadowroot: shadow ? "open" : "closed" };
        }

        if (raw === 2 || customElements.get(type)) {
            const Element = raw === 2 ? type : customElements.get(type);

            if (raw === 2) {
                const { [IS]: is, [NAME]: localName } = type;
                if (is) {
                    currentProps.is = localName;
                    type = is;
                } else {
                    type = localName;
                }
            }

            const { props: schemaProps, styles } = Element;

            // Only atomic defines the static property props
            if (schemaProps) {
                // Allows observedAttributes to be executed only once observedAttributes
                if (!ONCE.has(Element)) {
                    const { observedAttributes } = Element;
                    ONCE.add(Element);
                }

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
                                    ""
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
            } else {
                /**
                 * @todo
                 * research need?
                 */
                // instance.connectedCallback()
            }
        }

        const { innerHTML: rawHTML = "", ...nextProps } = currentProps;

        Object.entries(nextProps).forEach(
            ([prop, value]) => (attrs[prop] = value)
        );

        const innerHTML = (Array.isArray(children) ? children : [children])
            .flat(1000)
            .filter((value) =>
                value == null || value === false ? false : true
            )
            .map((child) =>
                child.render ? child.render() : `<span>${child}</span>`
            );

        if (type === "template" && !shadow) {
            return innerHTML.join("");
        }

        const html = `<${type}${attrs}>${fragmentBefore}${innerHTML.join(
            ""
        )}${fragmentAfter}${rawHTML}</${type}>`;

        return html;
    };
}
