import { expect } from "@bundled-es-modules/chai";
import { h, render } from "../render.js";

it("render textContent", () => {
    let el = document.createElement("div");
    let textValue = "any";
    render(<host>{textValue}</host>, el);
    expect(el.textContent).to.equal(textValue);
});

it("render Elimination of the style for non-use", () => {
    let el = document.createElement("div");

    [
        { style: "color: red;", cssText: "color: red;" },
        { style: { color: "red" }, cssText: "color: red;" },
    ].forEach(({ style, cssText }) => {
        render(<host style={style}>0</host>, el);
        expect(el.style.cssText).to.equal(cssText);

        render(<host>0</host>, el);
        expect(el.style.cssText).to.equal("");
    });
});

it("render ignore children", () => {
    let el = document.createElement("div");
    let html = "<h1>...</h1>";
    el.innerHTML = html;

    render(<host></host>, el);

    expect(el.innerHTML).to.equal(html);
});

it("render replace children", () => {
    let el = document.createElement("div");
    let html = "<h1>...</h1>";
    let content = "text";

    el.innerHTML = html;

    render(<host>{content}</host>, el);

    expect(el.textContent).to.equal(content);
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
        <host
            {...Object.keys(attrs).reduce((props, key) => {
                props[key] = attrs[key].value;
                return props;
            }, {})}
        ></host>,
        el
    );

    for (let key in attrs) {
        expect(el.getAttribute(key)).to.equal(attrs[key].expect);
    }
});

it("render empty child", () => {
    let el = document.createElement("div");
    let content = <span>content</span>;

    let view = (state) => render(<host>{state && content}</host>, el);

    let emptyValues = [null, false, undefined];

    emptyValues.map((value) => {
        view(true);

        expect(!!el.querySelector("span")).to.be.true;

        view(value);

        expect(el.querySelector("span")).to.be.null;
    });
});

it("render: shadowDom", () => {
    let el = document.createElement("div");

    render(<host shadowDom></host>, el);

    expect(el.shadowRoot).to.be.is.not.null;
});

it("render: addEventListener", (done) => {
    let el = document.createElement("div");

    let handler = ({ target }) => {
        expect(target).to.equal(el);
        done();
    };

    render(<host onAnyEvent={handler}></host>, el);

    el.dispatchEvent(new Event("AnyEvent"));
});
