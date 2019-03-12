import { container } from "../util";
import { h, render } from "../../dist/atomico";

describe("basic test components", () => {
    test("functional component", () => {
        let scope = container(),
            test = "hello";
        function Test() {
            return <h1>hello</h1>;
        }
        render(<Test />, scope);

        expect(scope.querySelector("h1").textContent).toBe("hello");
    });
    test("functional component read props", () => {
        let scope = container(),
            props = { id: "my-id" };

        function Test(props) {
            expect(props).toEqual(props);
            return <h1>hello</h1>;
        }

        render(<Test {...props} />, scope);

        expect(scope.querySelector("h1").textContent).toBe("hello");
    });
});
