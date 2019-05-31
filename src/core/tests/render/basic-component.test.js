import { createContainer } from "../utils";
import { h, render } from "../../index.js";

describe("core/tests/render: basic test components", () => {
	it("functional component", () => {
		let scope = createContainer(),
			textContent = "hello";
		function Test() {
			return <h1>{textContent}</h1>;
		}
		render(<Test />, scope);

		expect(scope.querySelector("h1").textContent).toBe(textContent);
	});
	it("functional component read props", () => {
		let scope = createContainer(),
			textContent = "hello",
			props = { id: "my-id" };

		function Test(props) {
			expect(props).toEqual(props);
			return <h1>{textContent}</h1>;
		}

		render(<Test {...props} />, scope);

		expect(scope.querySelector("h1").textContent).toBe(textContent);
	});
});
