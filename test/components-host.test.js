import { h, render } from "../src/index";
import { container } from "./util";

describe("enabling host tag in render", () => {
    it("functional component", () => {
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

        assert(scope.children.length, 3);
        assert(scope.className, "my-class");
    });
    it("higth order component", () => {
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

        assert(scope.children.length, 3);
        assert(scope.className, "my-class");
    });
});
