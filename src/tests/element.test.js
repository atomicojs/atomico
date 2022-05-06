import { expect } from "@esm-bundle/chai";
import { c, Any } from "../element/custom-element.js";
import { css } from "../css.js";
import { PropError } from "../element/errors.js";
import { html } from "../../html.js";
import { options } from "../options.js";
import { useState } from "../hooks/hooks.js";

/**
 *
 * @param {any} component
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
            value: Number,
        };

        const node = customElementScope(a);

        node.update = () => {
            expect(node.value).to.equal(100);
            done();
        };

        node.value = 100;
    });
    /**
     * @deprecated
     */
    // it("prop outside", async () => {
    //     function a(props) {
    //         expect(props).to.deep.equal({ value: 100 });
    //         return html`<host />`;
    //     }

    //     const node = customElementScope(a);

    //     document.body.appendChild(node);

    //     node.update({ value: 100 });

    //     await node.updated;
    // });

    it("define static sheets", () => {
        function a() {
            return html`<host shadowDom />`;
        }

        a.styles = css`
            :host {
                color: black;
            }
        `;

        expect(c(a).styles.filter((value) => value)).to.deep.equal([a.styles]);
    });

    it("define static sheets  with inheritance", () => {
        function a() {
            return html`<host shadowDom />`;
        }

        a.styles = css`
            :host {
                color: black;
            }
        `;
        function b() {
            return html`<host shadowDom />`;
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
        ).to.deep.equal([b.styles, a.styles]);
    });

    it("define static props", () => {
        function a() {
            return html`<host shadowDom />`;
        }

        a.props = {
            a: String,
            b: Number,
        };

        expect(c(a).props).to.deep.equal(a.props);
    });

    it("define static props with inheritance", () => {
        function a() {
            return html`<host shadowDom />`;
        }

        a.props = {
            a: String,
            b: Number,
        };

        function b() {
            return html`<host shadowDom />`;
        }

        b.props = {
            d: String,
            f: Number,
        };

        expect(c(a, c(b)).props).to.deep.equal({ ...a.props, ...b.props });
    });
    it("create a customElement without declaring tagName", () => {
        //@ts-ignore
        expect(c(() => {}).prototype).to.be.an.instanceof(HTMLElement);
    });
    it("transfer of prop to virtual-dom", async () => {
        let value = 10;

        function Wc({ value }) {
            return html`<host>${value}</host>`;
        }

        Wc.props = {
            value: Number,
        };

        let node = customElementScope(Wc);

        document.body.appendChild(node);

        node.value = value;

        await node.updated;

        expect(node.textContent).to.equal(value + "");

        node.value = value = value + value;

        await node.updated;

        expect(node.textContent).to.equal(value + "");
    });

    it("property definition from the host tag", async () => {
        let cn = "my-class";

        function Wc({ cn }) {
            return html`<host class="${cn}"></host>`;
        }

        Wc.props = {
            cn: String,
        };

        let node = customElementScope(Wc);

        document.body.appendChild(node);

        node.cn = cn;

        await node.updated;

        expect(node.className).to.equal(cn);
    });
    it("schema Number", async () => {
        function Wc() {
            return html`<host />`;
        }

        Wc.props = {
            value: Number,
        };

        let node = customElementScope(Wc);

        document.body.appendChild(node);

        await node.updated;

        node.setAttribute("value", "1000");

        await node.updated;

        expect(node.value).to.equal(1000);
    });
    it("schema Any", async () => {
        function Wc() {
            return html`<host />`;
        }

        Wc.props = {
            value: Any,
        };

        let node = customElementScope(Wc);

        let nextValue;
        document.body.appendChild(node);

        await node.updated;
        nextValue = 1000;
        node.value = nextValue;

        await node.updated;

        expect(node.value).to.equal(nextValue);

        await node.updated;

        nextValue = Promise.resolve();
        node.value = nextValue;

        await node.updated;

        expect(node.value).to.equal(nextValue);

        nextValue = () => 10;
        node.value = nextValue;

        await node.updated;

        expect(node.value).to.equal(nextValue);
    });
    it("schema Object", async () => {
        function Wc() {
            return html`<host />`;
        }

        Wc.props = {
            value: Object,
        };

        let node = customElementScope(Wc);
        let value = { value: 10 };

        document.body.appendChild(node);

        await node.updated;

        node.setAttribute("value", JSON.stringify(value));

        await node.updated;

        expect(node.value).to.deep.equal(value);
    });

    it("schema Array", async () => {
        function Wc() {
            return html`<host />`;
        }

        Wc.props = {
            value: Array,
        };

        let node = customElementScope(Wc);
        let value = [{ value: 10 }];

        document.body.appendChild(node);

        await node.updated;

        node.setAttribute("value", JSON.stringify(value));

        await node.updated;

        expect(node.value).to.deep.equal(value);
    });

    it("schema String", async () => {
        function Wc() {
            return html`<host />`;
        }

        Wc.props = {
            value: String,
        };

        let node = customElementScope(Wc);
        let value = "message";

        document.body.appendChild(node);

        await node.updated;

        node.setAttribute("value", value);

        await node.updated;

        expect(node.value).to.equal(value);
    });
    it("schema Function, valid only as property", async () => {
        function Wc() {
            return html`<host />`;
        }

        Wc.props = {
            value: Function,
        };

        let node = customElementScope(Wc);
        let value = () => "function";

        document.body.appendChild(node);

        await node.updated;

        node.value = value;

        await node.updated;

        expect(node.value).to.equal(value);
    });
    it("schema Function, valid only as property", async () => {
        function Wc() {
            return html`<host />`;
        }

        Wc.props = {
            value: Promise,
        };

        let node = customElementScope(Wc);

        let value = Promise.resolve();

        document.body.appendChild(node);

        await node.updated;

        node.value = value;

        await node.updated;

        expect(node.value).to.equal(value);
    });
    it("schema Symbol, valid only as property", async () => {
        function Wc() {
            return html`<host />`;
        }

        Wc.props = {
            value: Symbol,
        };

        let node = customElementScope(Wc);

        let value = Symbol();

        document.body.appendChild(node);

        await node.updated;

        node.value = value;

        await node.updated;

        expect(node.value).to.equal(value);
    });
    it('schema "" equals null', () => {
        function Wc() {
            return html`<host />`;
        }

        Wc.props = {
            prop1: String,
            prop2: Object,
        };

        let node = customElementScope(Wc);

        node.prop1 = "content";
        node.prop1 = "";

        expect(node.prop1).to.equal("");

        node.prop2 = {};
        node.prop2 = "";

        expect(node.prop2).to.equal(null);
    });

    it("styles property CSSStyleSheet", async () => {
        options.sheet = true;

        function Wc() {
            return html`<host shadowDom />`;
        }

        Wc.styles = css`
            :host {
                font-size: 1px;
            }
        `;

        let node = customElementScope(Wc);

        document.body.appendChild(node);

        await node.updated;

        expect(getComputedStyle(node).fontSize).to.equal("1px");
    });

    it("styles property CSSStyleSheet merge", async () => {
        options.sheet = true;

        function Wc() {
            return html`<host shadowDom />`;
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
                    `,
                ],
            ],
        ];

        let node = customElementScope(Wc);

        document.body.appendChild(node);

        await node.updated;

        expect(getComputedStyle(node).fontSize).to.equal("1px");
        expect(getComputedStyle(node).borderWidth).to.equal("10px");
    });

    it("styles property HTMLStyleElement", async () => {
        function Wc() {
            return html`<host shadowDom />`;
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

        expect(getComputedStyle(node).fontSize).to.equal("0px");
    });

    it("styles extends vainilla", async () => {
        function a() {
            return html`<host shadowDom />`;
        }

        a.styles = css`
            :host {
                font-size: 1px;
            }
        `;

        const A = c(a);

        class B extends A {
            static get styles() {
                return [
                    ...super.styles,
                    css`
                        :host {
                            color: rgb(255, 0, 0);
                        }
                    `,
                ];
            }
        }

        let node = customElementScope(B, false);

        document.body.appendChild(node);

        const styles = getComputedStyle(node);

        await node.updated;

        expect(styles.fontSize).to.equal("1px");
        expect(styles.color).to.equal("rgb(255, 0, 0)");
    });

    it("Render error prop", () => {
        function Wc() {
            return html`<host />`;
        }

        Wc.props = {
            value: {
                type: Number,
                value: 100,
            },
        };

        let node = customElementScope(Wc);

        document.body.appendChild(node);

        expect(node.value).to.equal(100);

        try {
            node.value = {};
        } catch (e) {
            expect(e).to.an.instanceOf(PropError);
        }
    });

    it("class inheritance and livecycle", async () => {
        function a() {
            return html`<host>a</host>`;
        }

        function b() {
            return html`<host>b</host>`;
        }

        function f() {
            return html`<host>c</host>`;
        }

        a.props = {
            value: {
                type: Number,
                value: 100,
            },
        };

        b.props = {
            type: {
                type: String,
                value: "b",
            },
        };

        f.props = {
            age: {
                type: Number,
                value: 1,
                reflect: true,
            },
        };

        const A = c(a);
        const B = c(b, A);
        const F = c(f, B);

        let node = customElementScope(F, false);

        document.body.appendChild(node);

        expect(node).to.an.instanceOf(A);
        expect(node).to.an.instanceOf(B);
        expect(node).to.an.instanceOf(F);
        expect(node.value).to.equal(100);
        expect(node.type).to.equal("b");
        expect(node.age).to.equal(1);

        node.setAttribute("value", "1000");

        expect(node.value).to.equal(1000);

        node.age = 500;

        await node.updated;

        expect(node.age).to.equal(500);

        node.remove();

        await node.unmounted;

        expect(true).to.equal(true);
    });

    it("class useState", async () => {
        function a() {
            const [state, setState] = useState(0);
            return html`<host onclick=${() => setState(1)}>${state}</host>`;
        }

        let node = customElementScope(a);

        document.body.appendChild(node);

        await node.updated;

        expect(node.textContent).to.equal("0");

        node.click();

        await node.updated;

        expect(node.textContent).to.equal("1");
    });

    it("class schema.event", async () => {
        function a() {
            return html`<host />`;
        }

        a.props = {
            value: {
                type: Number,
                event: { type: "Change" },
            },
        };

        let node = customElementScope(a);

        document.body.appendChild(node);

        node.addEventListener("Change", (event) => {
            expect(event).to.an.instanceOf(CustomEvent);
        });

        await node.updated;

        node.value = 1000;
    });

    it("class schema.reflect boolean", async () => {
        function a() {
            return html`<host />`;
        }

        a.props = {
            show: {
                type: Boolean,
                reflect: true,
                value: true,
            },
        };

        let node = customElementScope(a);

        document.body.appendChild(node);

        await node.updated;
        expect(node.getAttribute("show")).to.equal("");

        node.show = false;

        await node.updated;
        expect(node.getAttribute("show")).to.equal(null);
    });
});
