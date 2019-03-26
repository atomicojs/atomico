import { container } from "../util";
import { h, render } from "../../dist/atomico";

describe("basic test components", () => {
	test("functional component", () => {
		let scope = container(),
			textContent = "hello";
		function Test() {
			return <h1>{textContent}</h1>;
		}
		render(<Test />, scope);

		expect(scope.querySelector("h1").textContent).toBe(textContent);
	});
	test("functional component read props", () => {
		let scope = container(),
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
