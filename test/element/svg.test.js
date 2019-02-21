import { container, renderToString, createList } from "../util";
import { h, render } from "../../src";

describe("creation of html elements", () => {
    test("basic", () => {
        let scope = container();
        let vnode = <svg />;

        render(vnode, scope);

        expect(scope.innerHTML).toBe(renderToString(vnode));
    });
    test("basic with attribute", () => {
        let scope = container();
        let vnode = <svg id="name" />;

        render(vnode, scope);
        expect(scope.innerHTML).toBe(renderToString(vnode));
    });

    test("basic", () => {
        let scope = container();
        let vnode = <div />;

        render(vnode, scope);

        expect(scope.innerHTML).toBe(renderToString(vnode));
    });
    test("basic with attribute", () => {
        let scope = container();
        let vnode = <input id="name" class="every" checked />;

        render(vnode, scope);
        expect(scope.innerHTML).toBe(renderToString(vnode));
    });
    test("anidacion basica", () => {
        let scope = container();
        return;
        let vnode = (
            <svg viewBox="0 0 150 150">
                <text x="0" y="15" fill="red">
                    hello {`word`}
                </text>
                {createList(10).map(({ key }) => (
                    <g id={key}>
                        <line
                            x1="0"
                            y1="0"
                            x2="200"
                            y2="200"
                            style="stroke:rgb(255,0,0);stroke-width:2"
                        />
                    </g>
                ))}
            </svg>
        );

        render(vnode, scope);

        expect(scope.innerHTML).toBe(renderToString(vnode));
    });
});
