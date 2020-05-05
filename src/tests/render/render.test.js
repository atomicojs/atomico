import { h, render } from "../../core/core";
import { elementScope } from "../utils";

describe("render", () => {
    it("print 0", () => {
        let nodeScope = elementScope();

        render(<host>0</host>, nodeScope);

        expect(nodeScope.textContent).toBe("0");
    });
    it("ignore children", () => {
        let nodeScope = elementScope();
        let html = "<h1>...</h1>";
        nodeScope.innerHTML = html;

        render(<host></host>, nodeScope);

        expect(nodeScope.innerHTML).toBe(html);
    });
    it("replace children", () => {
        let nodeScope = elementScope();
        let html = "<h1>...</h1>";
        let content = "text";

        nodeScope.innerHTML = html;

        render(<host>{content}</host>, nodeScope);

        expect(nodeScope.textContent).toBe(content);
    });
    it("set attributes", () => {
        let nodeScope = elementScope();

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
            nodeScope
        );

        for (let key in attrs) {
            expect(nodeScope.getAttribute(key)).toBe(attrs[key].expect);
        }
    });
    it("empty child", () => {
        let nodeScope = elementScope();
        let content = <span>content</span>;

        let view = (state) =>
            render(<host>{state && content}</host>, nodeScope);

        let emptyValues = [null, false, undefined];

        emptyValues.map((value) => {
            view(true);

            expect(nodeScope.querySelector("span")).toBeTruthy();

            view(value);

            expect(nodeScope.querySelector("span")).toBeFalsy();
        });
    });
    it("shadowDom", () => {
        let nodeScope = elementScope();

        render(<host shadowDom></host>, nodeScope);

        expect(nodeScope.shadowRoot).toBeTruthy();
    });

    it("addEventListener", (done) => {
        let nodeScope = elementScope();

        let handler = ({ target }) => {
            expect(target).toBe(nodeScope);
            done();
        };

        render(<host onAnyEvent={handler}></host>, nodeScope);

        nodeScope.dispatchEvent(new Event("AnyEvent"));
    });
});
