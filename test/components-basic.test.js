import { h, render } from "../src/index";
import { container } from "./util";

describe("basic test components", () => {
    it("functional component", () => {
        let scope = container(),
            test = "hello",
            ref = {};

        function Test(props) {
            return <h1 ref={props.ref}>hello</h1>;
        }
        render(<Test ref={ref} />, scope);

        assert.equal(ref.current.textContent, "hello");
    });
    it("functional component read props", () => {
        let scope = container(),
            props = { id: "my-id" },
            ref = {};

        function Test(props) {
            expect(props).to.deep.equal({ ...props, children: [] });
            return <h1 ref={props.ref}>hello</h1>;
        }

        render(<Test {...props} ref={ref} />, scope);

        assert.equal(ref.current.textContent, "hello");
    });
    it("functional component read context", () => {
        let scope = container(),
            context = { id: "my-id" },
            ref = {};

        function Test(props, localContext) {
            expect(localContext).to.deep.equal(context);
            return <h1 ref={props.ref}>hello</h1>;
        }

        render(<Test context={context} ref={ref} />, scope);

        assert.equal(ref.current.textContent, "hello");
    });
});
