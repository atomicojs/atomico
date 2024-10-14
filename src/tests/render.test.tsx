import { render, Fragment } from "../render.js";
import { expect, describe, it, vi } from "vitest";

describe("src/render", () => {
    it("render - Rendering without host", () => {
        const el = render(<span />, undefined);
        expect(el).toBeInstanceOf(HTMLSpanElement);
    });

    it("render - children equals null", () => {
        const parent = document.createElement("div");
        render(<host children={null} />, parent);
        expect(parent.children.length).toBe(0);
    });

    it("render - children equals", () => {
        const span = <span></span>;
        const A = render(span, undefined);
        const B = render(span, A);
        expect(A).toEqual(B);
    });

    it("render - ShadowDom Association", () => {
        const el = document.createElement("div");
        render(<host shadowDom />, el);
        expect(el.shadowRoot).toBeInstanceOf(ShadowRoot);
    });

    it("render - References with node assignment by mutability", () => {
        const el = document.createElement("div");
        const ref = {};
        render(<host shadowDom ref={ref} />, el);
        expect(ref.current).toBe(el);
    });

    it("render - References with node assignment by callback", () => {
        const el = document.createElement("div");
        const ref = (node) => {
            expect(node).toEqual(el);
        };
        render(<host shadowDom ref={ref} />, el);
    });

    it("render - SVG Rendering", () => {
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

    it("render - Using the is attribute when creating a web component", () => {
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

    it("render - Using simple text rendering", () => {
        let el = document.createElement("div");
        let textValue = "any";
        render(<host>{textValue}</host>, el);
        expect(el.textContent).toBe(textValue);
    });

    it("render - Using Fragment Component", () => {
        let el = document.createElement("div");
        let textValue = "any";
        render(
            <host>
                <Fragment>{textValue}</Fragment>
            </host>,
            el
        );
        expect(el.textContent).toBe(textValue);
    });

    it("render - Using raw nodes by instance", () => {
        let el = document.createElement("div");
        let Span = document.createElement("span");
        let textValue = "any";
        render(
            <host>
                <Span>{textValue}</Span>
            </host>,
            el
        );
        expect(el.textContent).toBe(textValue);
    });

    it("render - Using raw nodes by constructor", () => {
        let el = document.createElement("div");

        render(
            <host>
                <Image />
            </host>,
            el
        );
        expect(el.querySelector("img")).toBeInstanceOf(Image);
    });

    it("render - functional component rendering", () => {
        let el = document.createElement("div");
        let textValue = "any";

        const Fn = ({ children }) => <span>{children}</span>;
        render(
            <host>
                <Fn>{textValue}</Fn>
            </host>,
            el
        );
        expect(el.textContent).toBe(textValue);
    });

    it("render - verify optimization through static rendering of vnode", () => {
        let el = document.createElement("div");
        const child = <span></span>;
        render(<host>{child}</host>, el);
        render(<host>{child}</host>, el);
    });

    it("render - verify optimization through static rendering of vnode", () => {
        let el = document.createElement("div");
        const child = <span></span>;
        render(<host>{child}</host>, el);
        render(<host>{child}</host>, el);
    });

    it("render - rendering with more than one child", () => {
        let el = document.createElement("div");
        const children = [
            <span></span>,
            <span></span>,
            <span></span>,
            <span></span>
        ];
        render(<host>{children}</host>, el);
    });

    it("render - addEventListener", (done) => {
        let el = document.createElement("div");

        const handler = vi.fn();

        render(<host onAnyEvent={handler}></host>, el);

        el.dispatchEvent(new Event("AnyEvent"));

        expect(handler).toBeCalled();

        render(<host onAnyEvent={null}></host>, el);

        el.dispatchEvent(new Event("AnyEvent"));

        expect(handler).toBeCalledTimes(1);
    });

    it("render - addEventListener with options", (done) => {
        let el = document.createElement("div");

        const handler = vi.fn();

        handler.once = true;

        render(<host onAnyEvent={handler}></host>, el);

        el.dispatchEvent(new Event("AnyEvent"));

        expect(handler).toBeCalled();

        el.dispatchEvent(new Event("AnyEvent"));

        expect(handler).toBeCalledTimes(1);
    });

    it("render - Avoid rendering escaped attributes", (done) => {
        let el = document.createElement("div");
        const attrs = {
            _attr1: "value-1",
            attr2: "value-2"
        };
        render(<host {...attrs}></host>, el);

        expect(el.attributes.hasOwnProperty("_attr1")).toBeFalsy();
        expect(el.attributes.hasOwnProperty("attr2")).toBeTruthy();

        expect(el).not.toHaveProperty("_attr1");
        expect(el).not.toHaveProperty("attr2");
    });

    it("render - assignNode", () => {
        let parent = document.createElement("div");
        let child = document.createElement("div");
        parent.append(child);

        render(
            <host shadowDom={{ slotAssignment: "manual" }}>
                <slot assignNode={child} />
            </host>,
            parent
        );

        expect(
            parent.shadowRoot.querySelector("slot").assignedElements()
        ).toEqual([child]);
    });

    it("render - should reorder elements with keys with minimal DOM mutation", () => {
        const parent = document.createElement("div");

        const initialOrder = [
            { key: "a", content: "A" },
            { key: "b", content: "B" },
            { key: "c", content: "C" },
            { key: "d", content: "D" },
            { key: "e", content: "E" },
            { key: "f", content: "F" },
            { key: "g", content: "G" }
        ];

        const newOrder = [
            { key: "g", content: "G" },
            { key: "f", content: "F" },
            { key: "e", content: "E" },
            { key: "d", content: "D" },
            { key: "c", content: "C" },
            { key: "b", content: "B" },
            { key: "a", content: "A" }
        ];

        // Render initial order
        render(
            <host>
                {initialOrder.map((item) => (
                    <div key={item.key}>{item.content}</div>
                ))}
            </host>,
            parent
        );

        const initialChildren = [...parent.children];

        // Spy on DOM mutation methods
        const insertBeforeSpy = vi.spyOn(parent, "insertBefore");
        const replaceChildSpy = vi.spyOn(parent, "replaceChild");

        // Render new order
        render(
            <host>
                {newOrder.map((item) => (
                    <div key={item.key}>{item.content}</div>
                ))}
            </host>,
            parent
        );

        const newChildren = [...parent.children];

        // Check that the elements are reordered correctly
        expect(newChildren.map((child) => child.textContent)).toEqual([
            "G",
            "F",
            "E",
            "D",
            "C",
            "B",
            "A"
        ]);

        // Check that the DOM elements are the same instances (minimal DOM mutation)
        expect(newChildren[0]).toBe(initialChildren[6]);
        expect(newChildren[1]).toBe(initialChildren[5]);
        expect(newChildren[2]).toBe(initialChildren[4]);
        expect(newChildren[3]).toBe(initialChildren[3]);
        expect(newChildren[4]).toBe(initialChildren[2]);
        expect(newChildren[5]).toBe(initialChildren[1]);
        expect(newChildren[6]).toBe(initialChildren[0]);

        // Check that the number of mutations is minimal
        expect(insertBeforeSpy).toHaveBeenCalledTimes(6); // Expecting no insertions
        expect(replaceChildSpy).toHaveBeenCalledTimes(0); // Expecting no replacements

        // Clean up spies
        insertBeforeSpy.mockRestore();
        replaceChildSpy.mockRestore();
    });

    it("render - staticNode", () => {
        const el = document.createElement("div");

        render(
            <host>
                <span staticNode>Text 1!</span>
            </host>,
            el
        );
        render(
            <host>
                <span staticNode>Text 2!</span>
            </host>,
            el
        );

        expect(el.textContent).toBe("Text 1!");
    });

    it("render - cloneNode", () => {
        const el = document.createElement("div");
        const Img = document.createElement("img");
        render(
            <host>
                <Img cloneNode />
                <Img cloneNode />
                <Img cloneNode />
            </host>,
            el
        );

        expect(el.children[0]).toBeInstanceOf(HTMLImageElement);
        expect(el.children[1]).toBeInstanceOf(HTMLImageElement);
        expect(el.children[2]).toBeInstanceOf(HTMLImageElement);
    });

    it("render - input", () => {
        const el = document.createElement("input");
        render(<host value="welcome"></host>, el);
        expect(el.value).toEqual("welcome");
        expect(el.getAttribute("value")).toBeNull();
    });

    it("render - textarea", () => {
        const el = document.createElement("input");
        render(<host value="welcome"></host>, el);
        expect(el.value).toEqual("welcome");
        expect(el.getAttribute("value")).toBeNull();
    });

    it("render - checked", () => {
        const el = document.createElement("input");
        render(<host type="checkbox" checked></host>, el);
        expect(el.checked).toBeTruthy();
    });
});
