import { expect } from "@esm-bundle/chai";
import { h, render } from "../render.js";
import html from "../../html/html";

describe("src/render", () => {
    it("attach shadowDom", () => {
        const el = document.createElement("div");
        render(html`<host shadowDom></host>`, el);
        expect(el.shadowRoot).to.be.an.instanceOf(ShadowRoot);
    });
    it("craete svg", () => {
        const el = document.createElement("div");
        const refSvg = {};
        const refForeign = {};
        const refSpan = {};
        render(
            html`<host>
                <svg ref=${refSvg}>
                    <foreignObject ref=${refForeign}>
                        <span ref=${refSpan}></span>
                    </foreignObject>
                </svg>
            </host>`,
            el
        );
        expect(refSvg.current).to.be.an.instanceOf(SVGElement);
        expect(refForeign.current).to.be.an.instanceOf(SVGForeignObjectElement);
        expect(refSpan.current).to.be.an.instanceOf(HTMLSpanElement);
    });

    it("attr is", () => {
        const el = document.createElement("div");

        class Link extends HTMLAnchorElement {}

        customElements.define("is-link", Link, { extends: "a" });

        const refLink = {};

        render(
            html`<host>
                <a ref=${refLink} is="is-link"></a>
            </host>`,
            el
        );

        expect(refLink.current).to.be.an.instanceOf(Link);
    });

    it("textContent", () => {
        let el = document.createElement("div");
        let textValue = "any";
        render(html`<host>${textValue}</host>`, el);
        expect(el.textContent).to.equal(textValue);
    });

    it("textContent with 2 values", () => {
        let el = document.createElement("div");
        let textValue = "any";
        render(html`<host>${textValue}${textValue}</host>`, el);
        expect(el.textContent).to.equal(textValue + textValue);
    });

    it("render children 0", () => {
        let el = document.createElement("div");
        render(h("host", null, 0), el);
        expect(el.textContent).to.equal("0");
    });

    it("render {children: 0}", () => {
        let el = document.createElement("div");
        render(h("host", { children: 0 }), el);
        expect(el.textContent).to.equal("0");
    });

    it("Elimination of the style for non-use", () => {
        let el = document.createElement("div");

        [
            { style: "color: red;", cssText: "color: red;" },
            { style: { color: "red" }, cssText: "color: red;" },
        ].forEach(({ style, cssText }) => {
            render(html`<host style="${style}">0</host>`, el);
            expect(el.style.cssText).to.equal(cssText);

            render(html`<host>0</host>`, el);
            expect(el.style.cssText).to.equal("");
        });
    });

    it("ignore children", () => {
        let el = document.createElement("div");
        let htmlContent = "<h1>...</h1>";
        el.innerHTML = htmlContent;

        render(html`<host></host>`, el);

        expect(el.innerHTML).to.equal(htmlContent);
    });

    it("ignore props", () => {
        let el = document.createElement("div");
        let htmlContent = "<h1>...</h1>";
        el.innerHTML = htmlContent;

        render(html`<host __obs__="sss"></host>`, el);

        expect(el.innerHTML).to.equal(htmlContent);
    });

    it("set attributes", () => {
        let el = document.createElement("div");

        let attrs = {
            "data-string": {
                value: "data-set",
                expect: "data-set",
            },
            "data-object": {
                value: {},
                expect: "{}",
            },
            "data-array": {
                value: [],
                expect: "[]",
            },
            class: {
                value: "class",
                expect: "class",
            },
            id: {
                value: "id",
                expect: "id",
            },
        };

        render(
            html`<host
                ...${Object.keys(attrs).reduce((props, key) => {
                    props[key] = attrs[key].value;
                    return props;
                }, {})}
            ></host>`,
            el
        );

        for (let key in attrs) {
            expect(el.getAttribute(key)).to.equal(attrs[key].expect);
        }
    });

    it("replaceChild", () => {
        const host = document.createElement("div");

        function toggle(toggle) {
            const ref = {};
            const tag = toggle ? "span" : "h1";
            render(html`<host>${html`<${toggle} ref=${ref} />`}</host>`, host);
            expect(host.querySelector(toggle)).to.equal(ref.current);
        }

        let length = 10;
        let current;
        while (length--) {
            toggle((current = !current));
        }
    });

    it("empty child", () => {
        let el = document.createElement("div");
        let content = html`<span>content</span>`;

        let view = (state) =>
            render(html`<host>${state && content}</host>`, el);

        let emptyValues = [null, false, undefined];

        emptyValues.map((value) => {
            view(true);

            expect(!!el.querySelector("span")).to.be.true;

            view(value);

            expect(el.querySelector("span")).to.be.null;
        });
    });

    it("shadowDom", () => {
        let el = document.createElement("div");

        render(html`<host shadowDom></host>`, el);

        expect(el.shadowRoot).to.be.is.not.null;
    });

    it("addEventListener", (done) => {
        let el = document.createElement("div");

        let handler = ({ target }) => {
            expect(target).to.equal(el);
            done();
        };

        render(html`<host onAnyEvent="${handler}"></host>`, el);

        el.dispatchEvent(new Event("AnyEvent"));
    });

    it("addEventListener", () => {
        let el = document.createElement("div");
        let count = 0;
        let handler = ({ target }) => count++;

        render(
            html`<host
                onAnyEvent="${Object.assign(handler, {
                    once: true,
                })}"
            ></host>`,
            el
        );

        el.dispatchEvent(new Event("AnyEvent"));
        el.dispatchEvent(new Event("AnyEvent"));
        el.dispatchEvent(new Event("AnyEvent"));

        expect(count).to.equal(1);
    });

    it("input", () => {
        let el = document.createElement("input");
        let initValue = "start";

        render(html`<host value="${initValue}"></host>`, el);

        expect(initValue).to.equal(el.value);
    });

    it("nodo raw", () => {
        let el = document.createElement("div");
        let raw = document.createElement("div");

        render(
            html`<host
                >${html`<${raw} style="color:red">...text</${raw}>`}</host
            >`,
            el
        );

        expect(el.querySelector(":scope > div")).to.equal(raw);
        /*@ts-ignore*/
        expect(el.querySelector(":scope > div").style.cssText).to.equal(
            "color: red;"
        );

        expect(el.querySelector(":scope > div").textContent).to.equal(
            "...text"
        );
    });

    it("nodo raw instance", () => {
        let el = document.createElement("div");
        let raw = Image;

        render(html`<host><${raw}></${raw}></host>`, el);

        expect(el.querySelector(":scope > img")).to.instanceOf(raw);
    });

    it("nodo raw instance: Recycle", () => {
        let el = document.createElement("div");
        let raw = Image;
        const children = [];
        let length = 10;
        while (length--) {
            render(html`<host><${raw}></${raw}></host>`, el);
            children.push(el.querySelector(":scope > img"));
        }
        const [first] = children;

        expect(children.every((child) => child === first)).to.true;
    });

    it("force attribute", () => {
        let el = document.createElement("div");

        render(html`<host><input $type="number" /></host>`, el);

        expect(el.querySelector(":scope > input").type).to.equal("number");

        render(html`<host><input $type=${null} /></host>`, el);

        expect(el.querySelector(":scope > input").type).to.equal("text");
    });

    it("cloneNode", () => {
        let el = document.createElement("div");

        const input = document.createElement("input");

        input.value = "...";
        input.type = "hidden";

        render(
            html`<host>
                <${input} cloneNode />
                <${input} cloneNode />
                <${input} cloneNode />
                <${input} cloneNode />
            </host>`,
            el
        );

        expect(el.children.length).to.equal(4);

        [...el.children].forEach(({ type, value }) => {
            expect(type).to.equal(input.type);
            expect(value).to.equal(input.value);
        });
    });

    it("cloneNode hydrate", () => {
        let el = document.createElement("div");

        const p = document.createElement("p");

        p.textContent = "text default";

        render(
            html`<host>
                <${p} cloneNode />
                <${p} cloneNode>...</${p}>
                <${p} cloneNode />
                <${p} cloneNode >...</${p}>
            </host>`,
            el
        );

        expect(el.children.length).to.equal(4);

        [...el.children].forEach(({ textContent }, i) => {
            if (i % 2) {
                expect(textContent).to.equal("...");
            } else {
                expect(textContent).to.equal(p.textContent);
            }
        });
    });
});
