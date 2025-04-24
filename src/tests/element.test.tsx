import { describe, expect, it, vi } from "vitest";
import { css } from "../css.js";
import { c } from "../element/custom-element.js";
import { PropError, ParseError } from "../element/errors.js";

export function live(CustomElement, notAppend = false) {
    let scope = `w-${(Math.random() + "").slice(2)}`;
    customElements.define(scope, CustomElement);
    const element = document.createElement(scope);
    !notAppend && document.body.append(element);
    return element;
}

describe("src/element", () => {
    it("watch update", async () => {
        const node = live(
            c(
                ({ propA }) => {
                    return <host>value {propA}</host>;
                },
                {
                    props: {
                        propA: { type: Number, reflect: true }
                    }
                }
            )
        );

        node.propA = 100;

        await node.updated;
        // Verify that the prop was defined as an attribute
        expect(node.getAttribute("prop-a")).toEqual("100");
        // Verify that the content of the prop was added to the DOM
        expect(node.textContent).toEqual("value 100");
    });

    it("define static sheets", () => {
        const styles = css`
            :host {
                color: black;
            }
        `;

        const MyElement = c(() => <host shadowDom />, {
            styles
        });

        expect(MyElement.styles.flat()).toEqual([styles]);
    });

    it("define static props", () => {
        const props = {
            a: String,
            b: Number
        };

        const MyElement = c(() => <host shadowDom />, { props });

        expect(MyElement.props).toEqual(props);
    });

    it("create a customElement without declaring tagName", () => {
        expect(c(() => <host />).prototype).toBeInstanceOf(HTMLElement);
    });

    it("property definition from the host tag", async () => {
        let cn = "my-class";

        const MyElement = c(({ cn }) => <host className={cn} />, {
            props: { cn: String }
        });

        let node = live(MyElement);

        node.cn = cn;

        await node.updated;

        expect(node.className).toEqual(cn);
    });

    it("schema Number", async () => {
        const props = {
            value: Number
        };

        const MyElement = c(() => <host />, { props });

        let node = live(MyElement);

        await node.updated;

        node.setAttribute("value", "1000");

        expect(node.value).toEqual(1000);
    });

    it("schema Any", async () => {
        const props = {
            value: null
        };

        const MyElement = c(() => <host />, { props });

        let node = live(MyElement);

        let nextValue;

        await node.updated;
        nextValue = 1000;
        node.value = nextValue;

        await node.updated;

        expect(node.value).toEqual(nextValue);

        await node.updated;

        nextValue = Promise.resolve();
        node.value = nextValue;

        await node.updated;

        expect(node.value).toEqual(nextValue);

        nextValue = () => 10;
        node.value = nextValue;

        await node.updated;

        expect(node.value).toEqual(nextValue);
    });

    it("schema Object", async () => {
        const props = {
            value: Object
        };

        const MyElement = c(() => <host />, { props });

        let node = live(MyElement);

        let value = { value: 10 };

        await node.updated;

        node.setAttribute("value", JSON.stringify(value));

        await node.updated;

        expect(node.value).toEqual(value);
    });
    it("schema Array", async () => {
        const props = {
            value: Array
        };

        const MyElement = c(() => <host />, { props });

        let node = live(MyElement);
        let value = [{ value: 10 }];

        await node.updated;

        node.setAttribute("value", JSON.stringify(value));

        expect(node.value).toEqual(value);
    });

    it("schema String", async () => {
        const props = {
            value: String
        };

        const MyElement = c(() => <host />, { props });

        let node = live(MyElement);
        let value = "message";

        await node.updated;

        node.setAttribute("value", value);

        await node.updated;

        expect(node.value).toEqual(value);
    });

    it("schema Function, valid only as property", async () => {
        const props = {
            value: Function
        };

        const MyElement = c(() => <host />, { props });

        let node = live(MyElement);

        let value = () => "function";

        await node.updated;

        node.value = value;

        await node.updated;

        expect(node.value).toEqual(value);
    });

    it("schema Function, valid only as property", async () => {
        const props = {
            value: Promise
        };

        const MyElement = c(() => <host />, { props });

        let node = live(MyElement);

        let value = Promise.resolve();

        await node.updated;

        node.value = value;

        await node.updated;

        expect(node.value).toEqual(value);
    });

    it("schema Symbol, valid only as property", async () => {
        const props = {
            value: Symbol
        };

        const MyElement = c(() => <host />, { props });

        let node = live(MyElement);

        let value = Symbol();

        await node.updated;

        node.value = value;

        await node.updated;

        expect(node.value).toEqual(value);
    });

    it('schema "" equals null', () => {
        const props = {
            prop1: String,
            prop2: Object
        };

        const MyElement = c(() => <host />, { props });

        let node = live(MyElement);

        node.prop1 = "content";
        node.prop1 = "";

        expect(node.prop1).toEqual("");

        node.prop2 = {};
        node.prop2 = "";

        expect(node.prop2).toBeUndefined();
    });

    it("styles property CSSStyleSheet", async () => {
        const styles = css`
            :host {
                font-size: 1px;
            }
        `;

        const MyElement = c(() => <host shadowDom />, { styles });

        let node = live(MyElement);

        await node.updated;

        expect(getComputedStyle(node).fontSize).toEqual("1px");
    });

    it("styles property CSSStyleSheet merge", async () => {
        const styles = [
            [
                [
                    css`
                        :host {
                            font-size: 1px;
                        }
                    `
                ]
            ]
        ];

        const MyElement = c(() => <host shadowDom />, { styles });

        let node = live(MyElement);

        await node.updated;

        expect(getComputedStyle(node).fontSize).toEqual("1px");
    });

    it("styles property HTMLStyleElement", async () => {
        const styles = css`
            :host {
                content: "styles property HTMLStyleElement";
                font-size: 1px;
            }
        `;

        const MyElement = c(() => <host shadowDom />, { styles });

        let node = live(MyElement);

        await node.updated;

        expect(getComputedStyle(node).fontSize).toEqual("1px");
    });

    it("Render error prop", () => {
        const props = {
            value: {
                type: Number,
                value: () => 100
            }
        };

        const MyElement = c(() => <host />, { props });

        let node = live(MyElement);

        try {
            node.value = {};
        } catch (e) {
            expect(e).toBeInstanceOf(PropError);
        }
    });

    it("class schema.event", async () => {
        const props = {
            value: {
                type: Number,
                event: { type: "Change" }
            }
        };

        const MyElement = c(() => <host />, { props });

        let node = live(MyElement);

        node.addEventListener("Change", (event) => {
            expect(event).toBeInstanceOf(CustomEvent);
        });

        await node.updated;

        node.value = 1000;
    });

    it("disconnectedCallback", () => {
        const props = {
            value: {
                type: Number
            }
        };

        const MyElement = c(() => <host />, { props });

        let node = live(MyElement);

        node.remove();
    });

    it("attributeChangedCallback", () => {
        const props = {
            value: {
                type: Number
            }
        };

        const MyElement = c(() => <host />, { props });

        let node = live(MyElement);

        try {
            node.attributeChangedCallback("value", "", "[]");
        } catch (e) {
            expect(e).toBeInstanceOf(ParseError);
        }
    });

    it("withDefaultValue", async () => {
        const props = {
            value: {
                type: Number,
                value: () => 10
            }
        };

        const MyElement = c(() => <host />, { props });

        let node = live(MyElement);

        await node.updated;
        expect(node.value).toEqual(10);

        node.value = 5;
        expect(node.value).toEqual(5);

        node.value = null;
        expect(node.value).toEqual(10);
    });

    it("Immutable comparison", async () => {
        const value = { id: 0 };
        const handler = vi.fn();
        const props = {
            value: {
                type: Object,
                event: { type: "Change" }
            }
        };

        const MyElement = c(() => <host />, { props });

        let node = live(MyElement);

        node.addEventListener("Change", handler);

        await node.updated;
        node.value = value;
        expect(node.value).toEqual(value);

        node.value = value;
        expect(node.value).toEqual(value);

        expect(handler).toBeCalledTimes(1);
    });
});
