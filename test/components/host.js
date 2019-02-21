import { container } from "../util";
import { h, render } from "../../src";

describe("enabling host tag in render", () => {
    return;
    test("functional component", () => {
        let scope = container(),
            test = "hello",
            enableHost = true;

        function Test() {
            return (
                <host class="my-class">
                    <h1>element-1</h1>
                    <h1>element-2</h1>
                    <h1>element-3</h1>
                </host>
            );
        }

        render(<Test />, scope, enableHost);

        expect(scope.children.length).toBe(3);

        expect(scope.className).toBe("my-class");
    });
    test("higth order component", () => {
        let scope = container(),
            test = "hello",
            enableHost = true;

        function Sub() {
            return (
                <host class="my-class">
                    <h1>element-1</h1>
                    <h1>element-2</h1>
                    <h1>element-3</h1>
                </host>
            );
        }

        function Test() {
            return <Sub />;
        }

        render(<Test />, scope, enableHost);

        expect(scope.children.length).toBe(3);

        expect(scope.className).toBe("my-class");
    });
});
