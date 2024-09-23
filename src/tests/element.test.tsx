import { expect, describe, it } from "vitest";
import { c, Any } from "../element/custom-element.js";
import { css } from "../css.js";
import { PropError } from "../element/errors.js";
import { options } from "../options.js";
import { useState } from "../hooks/hooks.js";

/**
 *
 * @returns {any}
 */
export function customElementScope(component, autoScope = true) {
    let scope = `w-${(Math.random() + "").slice(2)}`;
    customElements.define(scope, autoScope ? c(component) : component);
    return document.createElement(scope);
}

describe("src/element", () => {
    it("watch update", (done) => {
        function a() {}

        a.props = {
            value: Number
        };

        const node = customElementScope(a);

        node.update = () => {
            expect(node.value).toEqual(100);
            done();
        };

        node.value = 100;
    });

    it("define static sheets", () => {
        function a() {
            return <host shadowDom />;
        }

        a.styles = css`
            :host {
                color: black;
            }
        `;

        expect(
            c(a)
                .styles.flat()
                .filter((value) => value)
        ).toEqual([a.styles]);
    });

    it("define static sheets with inheritance", () => {
        function a() {
            return <host shadowDom />;
        }

        a.styles = css`
            :host {
                color: black;
            }
        `;
        function b() {
            return <host shadowDom />;
        }

        b.styles = css`
            :host {
                color: tomato;
            }
        `;

        expect(
            c(a, c(b))
                .styles.flat(10)
                .filter((value) => value)
        ).toEqual([b.styles, a.styles]);
    });

    it("define static props", () => {
        function a() {
            return <host shadowDom />;
        }

        a.props = {
            a: String,
            b: Number
        };

        expect(c(a).props).toEqual(a.props);
    });

    it("define static props with inheritance", () => {
        function a() {
            return <host shadowDom />;
        }

        a.props = {
            a: String,
            b: Number
        };

        function b() {
            return <host shadowDom />;
        }

        b.props = {
            d: String,
            f: Number
        };

        expect(c(a, c(b)).props).toEqual({ ...a.props, ...b.props });
    });

    it("create a customElement without declaring tagName", () => {
        //@ts-ignore
        expect(c(() => {}).prototype).toBeInstanceOf(HTMLElement);
    });

    it("transfer of prop to virtual-dom", async () => {
        let value = 10;

        function Wc({ value }) {
            return <host>{value}</host>;
        }

        Wc.props = {
            value: Number
        };

        let node = customElementScope(Wc);

        document.body.appendChild(node);

        node.value = value;

        await node.updated;

        expect(node.textContent).toEqual(value + "");

        node.value = value = value + value;

        await node.updated;

        expect(node.textContent).toEqual(value + "");
    });

    it("property definition from the host tag", async () => {
        let cn = "my-class";

        function Wc({ cn }) {
            return <host className={cn}></host>;
        }

        Wc.props = {
            cn: String
        };

        let node = customElementScope(Wc);

        document.body.appendChild(node);

        node.cn = cn;

        await node.updated;

        expect(node.className).toEqual(cn);
    });

    it("schema Number", async () => {
        function Wc() {
            return <host />;
        }

        Wc.props = {
            value: Number
        };

        let node = customElementScope(Wc);

        document.body.appendChild(node);

        await node.updated;

        node.setAttribute("value", "1000");

        await node.updated;

        expect(node.value).toEqual(1000);
    });

    it("schema Any", async () => {
        function Wc() {
            return <host />;
        }

        Wc.props = {
            value: Any
        };

        let node = customElementScope(Wc);

        let nextValue;
        document.body.appendChild(node);

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
        function Wc() {
            return <host />;
        }

        Wc.props = {
            value: Object
        };

        let node = customElementScope(Wc);
        let value = { value: 10 };

        document.body.appendChild(node);

        await node.updated;

        node.setAttribute("value", JSON.stringify(value));

        await node.updated;

        expect(node.value).toEqual(value);
    });
    it("schema Array", async () => {
        function Wc() {
            return <host />;
        }

        Wc.props = {
            value: Array
        };

        let node = customElementScope(Wc);
        let value = [{ value: 10 }];

        document.body.appendChild(node);

        await node.updated;

        node.setAttribute("value", JSON.stringify(value));

        await node.updated;

        expect(node.value).toEqual(value);
    });

    it("schema String", async () => {
        function Wc() {
            return <host />;
        }

        Wc.props = {
            value: String
        };

        let node = customElementScope(Wc);
        let value = "message";

        document.body.appendChild(node);

        await node.updated;

        node.setAttribute("value", value);

        await node.updated;

        expect(node.value).toEqual(value);
    });

    it("schema Function, valid only as property", async () => {
        function Wc() {
            return <host />;
        }

        Wc.props = {
            value: Function
        };

        let node = customElementScope(Wc);
        let value = () => "function";

        document.body.appendChild(node);

        await node.updated;

        node.value = value;

        await node.updated;

        expect(node.value).toEqual(value);
    });

    it("schema Function, valid only as property", async () => {
        function Wc() {
            return <host />;
        }

        Wc.props = {
            value: Promise
        };

        let node = customElementScope(Wc);

        let value = Promise.resolve();

        document.body.appendChild(node);

        await node.updated;

        node.value = value;

        await node.updated;

        expect(node.value).toEqual(value);
    });

    it("schema Symbol, valid only as property", async () => {
        function Wc() {
            return <host />;
        }

        Wc.props = {
            value: Symbol
        };

        let node = customElementScope(Wc);

        let value = Symbol();

        document.body.appendChild(node);

        await node.updated;

        node.value = value;

        await node.updated;

        expect(node.value).toEqual(value);
    });

    it('schema "" equals null', () => {
        function Wc() {
            return <host />;
        }

        Wc.props = {
            prop1: String,
            prop2: Object
        };

        let node = customElementScope(Wc);

        node.prop1 = "content";
        node.prop1 = "";

        expect(node.prop1).toEqual("");

        node.prop2 = {};
        node.prop2 = "";

        expect(node.prop2).toBeUndefined();
    });
    it("styles property CSSStyleSheet", async () => {
        options.sheet = true;

        function Wc() {
            return <host shadowDom />;
        }

        Wc.styles = css`
            :host {
                font-size: 1px;
            }
        `;

        let node = customElementScope(Wc);

        document.body.appendChild(node);

        await node.updated;

        expect(getComputedStyle(node).fontSize).toEqual("1px");
    });

    it("styles property CSSStyleSheet merge", async () => {
        options.sheet = true;

        function Wc() {
            return <host shadowDom />;
        }

        Wc.styles = [
            css`
                :host {
                    font-size: 1px;
                }
            `,
            [
                css`
                    :host {
                        display: block;
                    }
                `,
                [
                    css`
                        :host {
                            border: 10px solid black;
                        }
                    `
                ]
            ]
        ];

        let node = customElementScope(Wc);

        document.body.appendChild(node);

        await node.updated;

        expect(getComputedStyle(node).fontSize).toEqual("1px");
        expect(getComputedStyle(node).borderWidth).toEqual("10px");
    });

    it("styles property HTMLStyleElement", async () => {
        function Wc() {
            return <host shadowDom />;
        }
        options.sheet = false;

        Wc.styles = css`
            :host {
                font-size: 0px;
            }
        `;

        let node = customElementScope(Wc);

        document.body.appendChild(node);

        await node.updated;
        options.sheet = true;

        expect(getComputedStyle(node).fontSize).toEqual("0px");
    });

    it("Render error prop", () => {
        function Wc() {
            return <host />;
        }

        Wc.props = {
            value: {
                type: Number,
                value: 100
            }
        };

        let node = customElementScope(Wc);

        document.body.appendChild(node);

        expect(node.value).toEqual(100);

        try {
            node.value = {};
        } catch (e) {
            expect(e).toBeInstanceOf(PropError);
        }
    });

    it("class inheritance and livecycle", async () => {
        function a() {
            return <host>a</host>;
        }

        function b() {
            return <host>b</host>;
        }

        function f() {
            return <host>c</host>;
        }

        a.props = {
            value: {
                type: Number,
                value: 100
            }
        };

        b.props = {
            type: {
                type: String,
                value: "b"
            }
        };

        f.props = {
            age: {
                type: Number,
                value: 1,
                reflect: true
            }
        };

        const A = c(a);
        const B = c(b, A);
        const F = c(f, B);

        let node = customElementScope(F, false);

        document.body.appendChild(node);

        expect(node).toBeInstanceOf(A);
        expect(node).toBeInstanceOf(B);
        expect(node).toBeInstanceOf(F);
        expect(node.value).toEqual(100);
        expect(node.type).toEqual("b");
        expect(node.age).toEqual(1);

        node.setAttribute("value", "1000");

        expect(node.value).toEqual(1000);

        node.age = 500;

        await node.updated;

        expect(node.age).toEqual(500);

        node.remove();
    });

    it("class useState", async () => {
        function a() {
            const [state, setState] = useState(0);
            return <host onClick={() => setState(1)}>{state}</host>;
        }

        let node = customElementScope(a);

        document.body.appendChild(node);

        await node.updated;

        expect(node.textContent).toEqual("0");

        node.click();

        await node.updated;

        expect(node.textContent).toEqual("1");
    });

    it("class schema.event", async () => {
        function a() {
            return <host />;
        }

        a.props = {
            value: {
                type: Number,
                event: { type: "Change" }
            }
        };

        let node = customElementScope(a);

        document.body.appendChild(node);

        node.addEventListener("Change", (event) => {
            expect(event).toBeInstanceOf(CustomEvent);
        });

        await node.updated;

        node.value = 1000;
    });

    it("class schema.reflect boolean", async () => {
        function a() {
            return <host />;
        }

        a.props = {
            show: {
                type: Boolean,
                reflect: true,
                value: true
            }
        };

        let node = customElementScope(a);

        document.body.appendChild(node);

        await node.updated;
        expect(node.getAttribute("show")).toEqual("");

        node.show = false;

        await node.updated;
        expect(node.getAttribute("show")).toEqual(null);
    });
});
