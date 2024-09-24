import { render } from "../render.js";
import { expect, describe, it } from "vitest";

describe("src/render", () => {
    it("attach shadowDom", () => {
        const el = document.createElement("div");
        render(<host shadowDom />, el);
        expect(el.shadowRoot).toBeInstanceOf(ShadowRoot);
    });

    it("ref", () => {
        const el = document.createElement("div");
        const ref = {};
        render(<host shadowDom ref={ref} />, el);
        expect(ref.current).toBe(el);
    });

    it("callable ref", () => {
        const el = document.createElement("div");
        const ref = (node) => {
            expect(node).toEqual(el);
        };
        render(<host shadowDom ref={ref} />, el);
    });

    it("create svg", () => {
        const el = document.createElement("div");
        const refSvg = {};
        const refForeign = {};
        const refSpan = {};
        render(
            <host>
                <svg ref={refSvg}>
                    <foreignObject ref={refForeign}>
                        <span ref={refSpan}></span>
                    </foreignObject>
                </svg>
            </host>,
            el
        );
        expect(refSvg.current).toBeInstanceOf(SVGElement);
        expect(refForeign.current).toBeInstanceOf(SVGForeignObjectElement);
        expect(refSpan.current).toBeInstanceOf(HTMLSpanElement);
    });

    it("attr is", () => {
        const el = document.createElement("div");

        class Link extends HTMLAnchorElement {}

        customElements.define("is-link", Link, { extends: "a" });

        const refLink = {};

        render(
            <host>
                <a ref={refLink} is="is-link"></a>
            </host>,
            el
        );

        expect(refLink.current).toBeInstanceOf(Link);
    });

    // it("textContent", () => {
    //     let el = document.createElement("div");
    //     let textValue = "any";
    //     render(<host>{textValue}</host>, el);
    //     expect(el.textContent).toBe(textValue);
    // });

    // it("textContent with 2 values", () => {
    //     let el = document.createElement("div");
    //     let textValue = "any";
    //     render(
    //         <host>
    //             {textValue}
    //             {textValue}
    //         </host>,
    //         el
    //     );
    //     expect(el.textContent).toBe(textValue + textValue);
    // });

    // it("render children 0", () => {
    //     let el = document.createElement("div");
    //     render(<host />, el);
    //     expect(el.textContent).toBe("0");
    // });

    // it("render {children: 0}", () => {
    //     let el = document.createElement("div");
    //     render(<host>{0}</host>, el);
    //     expect(el.textContent).toBe("0");
    // });

    // it("Elimination of the style for non-use", () => {
    //     let el = document.createElement("div");

    //     [
    //         { style: "color: red;", cssText: "color: red;" },
    //         { style: { color: "red" }, cssText: "color: red;" }
    //     ].forEach(({ style, cssText }) => {
    //         render(<host style={style}>0</host>, el);
    //         expect(el.style.cssText).toBe(cssText);

    //         render(<host>0</host>, el);
    //         expect(el.style.cssText).toBe("");
    //     });
    // });

    // it("ignore children", () => {
    //     let el = document.createElement("div");
    //     let htmlContent = "<h1>...</h1>";
    //     el.innerHTML = htmlContent;

    //     render(<host></host>, el);

    //     expect(el.innerHTML).toBe(htmlContent);
    // });

    // it("ignore props", () => {
    //     let el = document.createElement("div");
    //     let htmlContent = "<h1>...</h1>";
    //     el.innerHTML = htmlContent;

    //     render(<host __obs__="sss"></host>, el);

    //     expect(el.innerHTML).toBe(htmlContent);
    // });

    // it("set attributes", () => {
    //     let el = document.createElement("div");

    //     let attrs = {
    //         "data-string": {
    //             value: "data-set",
    //             expect: "data-set"
    //         },
    //         "data-object": {
    //             value: {},
    //             expect: "{}"
    //         },
    //         "data-array": {
    //             value: [],
    //             expect: "[]"
    //         },
    //         class: {
    //             value: "class",
    //             expect: "class"
    //         },
    //         id: {
    //             value: "id",
    //             expect: "id"
    //         }
    //     };

    //     render(
    //         <host
    //             {...Object.keys(attrs).reduce((props, key) => {
    //                 props[key] = attrs[key].value;
    //                 return props;
    //             }, {})}
    //         ></host>,
    //         el
    //     );

    //     for (let key in attrs) {
    //         expect(el.getAttribute(key)).toBe(attrs[key].expect);
    //     }
    // });

    // it("replaceChild", () => {
    //     const host = document.createElement("div");

    //     function toggle(toggle) {
    //         const ref = {};
    //         const tag = toggle ? "span" : "h1";
    //         render(<host>{createElement(tag, { ref })}</host>, host);
    //         expect(host.querySelector(tag)).toBe(ref.current);
    //     }

    //     let length = 10;
    //     let current;
    //     while (length--) {
    //         toggle((current = !current));
    //     }
    // });

    // it("empty child", () => {
    //     let el = document.createElement("div");
    //     let content = <span>content</span>;

    //     let view = (state) => render(<host>{state && content}</host>, el);

    //     let emptyValues = [null, false, undefined];

    //     emptyValues.map((value) => {
    //         view(true);

    //         expect(!!el.querySelector("span")).toBe(true);

    //         view(value);

    //         expect(el.querySelector("span")).toBeNull();
    //     });
    // });

    // it("shadowDom", () => {
    //     let el = document.createElement("div");

    //     render(<host shadowDom></host>, el);

    //     expect(el.shadowRoot).not.toBeNull();
    // });

    // it("addEventListener", () => {
    //     let el = document.createElement("div");

    //     let handler = ({ target }) => {
    //         expect(target).toBe(el);
    //     };

    //     render(<host onAnyEvent={handler}></host>, el);

    //     el.dispatchEvent(new Event("AnyEvent"));
    // });

    // it("addEventListener", () => {
    //     let el = document.createElement("div");
    //     let count = 0;
    //     let handler = ({ target }) => count++;

    //     render(
    //         <host
    //             onAnyEvent={Object.assign(handler, {
    //                 once: true
    //             })}
    //         ></host>,
    //         el
    //     );

    //     el.dispatchEvent(new Event("AnyEvent"));
    //     el.dispatchEvent(new Event("AnyEvent"));
    //     el.dispatchEvent(new Event("AnyEvent"));

    //     expect(count).toBe(1);
    // });

    // it("input", () => {
    //     let el = document.createElement("input");
    //     let initValue = "start";

    //     render(<host value={initValue}></host>, el);

    //     expect(initValue).toBe(el.value);
    // });

    // it("nodo raw", () => {
    //     let el = document.createElement("div");
    //     let raw = document.createElement("div");

    //     render(
    //         <host>
    //             {createElement(raw, { style: { color: "red" } }, "...text")}
    //         </host>,
    //         el
    //     );

    //     expect(el.querySelector(":scope > div")).toBe(raw);
    //     /*@ts-ignore*/
    //     expect(el.querySelector(":scope > div").style.cssText).toBe(
    //         "color: red;"
    //     );

    //     expect(el.querySelector(":scope > div").textContent).toBe("...text");
    // });

    // it("nodo raw instance", () => {
    //     let el = document.createElement("div");
    //     let raw = Image;

    //     render(
    //         <host>
    //             <raw />
    //         </host>,
    //         el
    //     );

    //     expect(el.querySelector(":scope > img")).toBeInstanceOf(raw);
    // });

    // it("nodo raw instance: Recycle", () => {
    //     let el = document.createElement("div");
    //     let raw = Image;
    //     const children = [];
    //     let length = 10;
    //     while (length--) {
    //         render(
    //             <host>
    //                 <raw />
    //             </host>,
    //             el
    //         );
    //         children.push(el.querySelector(":scope > img"));
    //     }
    //     const [first] = children;

    //     expect(children.every((child) => child === first)).toBe(true);
    // });

    // it("force attribute", () => {
    //     let el = document.createElement("div");

    //     render(
    //         <host>
    //             <input $type="number" />
    //         </host>,
    //         el
    //     );

    //     expect(el.querySelector(":scope > input").type).toBe("number");

    //     render(
    //         <host>
    //             <input $type={null} />
    //         </host>,
    //         el
    //     );

    //     expect(el.querySelector(":scope > input").type).toBe("text");
    // });

    // it("cloneNode", () => {
    //     let el = document.createElement("div");

    //     const input = document.createElement("input");

    //     input.value = "...";
    //     input.type = "hidden";

    //     render(
    //         <host>
    //             {createElement(input, { cloneNode: true })}
    //             {createElement(input, { cloneNode: true })}
    //             {createElement(input, { cloneNode: true })}
    //             {createElement(input, { cloneNode: true })}
    //         </host>,
    //         el
    //     );

    //     expect(el.children.length).toBe(4);

    //     [...el.children].forEach(({ type, value }) => {
    //         expect(type).toBe(input.type);
    //         expect(value).toBe(input.value);
    //     });
    // });

    // it("cloneNode hydrate", () => {
    //     let el = document.createElement("div");

    //     const P = document.createElement("p");

    //     P.textContent = "text default";

    //     render(
    //         <host>
    //             <P cloneNode />
    //             <P cloneNode />
    //         </host>,
    //         el
    //     );

    //     expect(el.children.length).toBe(4);
    // });

    // it("cloneNode diff", () => {
    //     let el = document.createElement("div");

    //     const p = document.createElement("p");

    //     p.textContent = "text default";

    //     render(
    //         <host>
    //             <p />
    //             <p />
    //             <p />
    //             <p />
    //         </host>,
    //         el
    //     );

    //     const childrenA = [...el.children];

    //     render(
    //         <host>
    //             <p />
    //             <p />
    //             <p />
    //             <p />
    //         </host>,
    //         el
    //     );

    //     const childrenB = [...el.children];

    //     expect(childrenA).toEqual(childrenB);
    // });

    // it("function instance", () => {
    //     let el = document.createElement("div");
    //     let Fn = () => <img />;

    //     render(
    //         <host>
    //             <Fn />
    //         </host>,
    //         el
    //     );

    //     expect(el.querySelector(":scope > img")).toBeInstanceOf(Image);
    // });

    // it("function instance using children", () => {
    //     let el = document.createElement("div");
    //     let Fn = ({ children }: any) => children;

    //     render(
    //         <host>
    //             <Fn>
    //                 <img />
    //             </Fn>
    //         </host>,
    //         el
    //     );

    //     expect(el.querySelector(":scope > img")).toBeInstanceOf(Image);
    // });
});
