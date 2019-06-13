import { h, render } from "../../";
import { createContainer } from "../utils";

describe("core/tests/optimization: optimization test in children with component hight-order", () => {
	let children = "children";
	it("ignore update by inheritance of children", () => {
		let scope = createContainer();
		let rerenderCount = 0;

		function Child(props) {
			rerenderCount++;
		}

		function Test(props) {
			return <Child {...props} />;
		}

		render(<Test>{children}</Test>, scope);
		render(<Test>{children}</Test>, scope);
		render(<Test>{children}</Test>, scope);

		expect(rerenderCount).toBe(1);
	});

	it("ignore update due to non-mutation of properties", () => {
		let scope = createContainer();
		let rerenderCount = 0;

		function Child(props) {
			rerenderCount++;
		}
		function Test(props) {
			return <Child {...props} />;
		}

		render(<Test id="10" />, scope);
		render(<Test id="10" />, scope);
		render(<Test id="10" />, scope);

		expect(rerenderCount).toBe(1);
	});
});
