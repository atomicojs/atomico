import { container, renderToString, createList } from "../util";
import { h, render } from "../../src";

describe("creation of html elements", () => {
    test("basic", () => {
        let scope = container();
        let vnode = <div />;

        render(vnode, scope);

        expect(scope.innerHTML).toBe(renderToString(vnode));
    });
    test("basic with attribute", () => {
        let scope = container();
        let vnode = <div id="name" />;

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
        let vnode = (
            <div class="container">
                <h1 class="class-1 class-2 class-3">hello {`word`}</h1>
                {createList(100).map(() => (
                    <div class="parent element" id="sample">
                        {createList(100).map(({ key }) => (
                            <button id="size" name="submit">
                                {key}
                            </button>
                        ))}
                    </div>
                ))}
            </div>
        );

        render(vnode, scope);

        expect(scope.innerHTML).toBe(renderToString(vnode));
    });
});
