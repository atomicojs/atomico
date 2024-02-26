import "./document.js";
import { options } from "../src/options.js";
import { createHooks } from "../src/hooks/create-hooks.js";
import { IS, NAME } from "./constants.js";
import { Tag, Attributes } from "./tag.js";
import { isServer } from "./utils.js";

const ONCE = new Set();

let ID = 0;

if (isServer()) setOptions(options);

/**
 *
 * @param {import("../src/options").Options} options
 */
function setOptions(options) {
    if (!isServer()) return;
    options.ssr = true;
    options.sheet = false;
    options.render = function (fragmentAfter = "") {
        let { type, props, children, shadow, raw } = this;
        let fragmentBefore = "";
        let { children: _1, ...currentProps } = props;
        const attrs = new Attributes();

        if (type === "host") {
            type = "template";
            currentProps = { shadowrootmode: shadow ? "open" : "closed" };
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
                        attrs.dataHydrate = "s" + ID++;
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

        const innerHTML =
            fragmentBefore +
            (Array.isArray(children) ? children : [children])
                .flat(1000)
                .filter(
                    (value) =>
                        typeof value !== "function" &&
                        (value == null || value === false ? false : true)
                )
                .map((child) => (child.render ? child.render() : `${child}`))
                .join("") +
            fragmentAfter +
            rawHTML;

        if (type === "template" && !shadow) {
            return innerHTML;
        }

        return new Tag(type, attrs, innerHTML);
    };
}
