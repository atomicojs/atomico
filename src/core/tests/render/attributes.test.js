import { createContainer } from "../utils";
import { h, render } from "../../";

describe("core/tests/render: attributes", () => {
	it("style.setProperty", () => {
		let scope = createContainer();
		let ref = {};
		let prop = "background-color";
		let value = "teal";
		let style = {
			[prop]: value
		};
		render(<button ref={ref} style={style} />, scope);

		expect(ref.current.style.getPropertyValue(prop)).toBe(value);
	});
	it("json", () => {
		let scope = createContainer();
		let ref = {};
		let value = { index: 10 };
		let stringValue = JSON.stringify(value);

		render(<button ref={ref} json={value} />, scope);

		expect(ref.current.getAttribute("json")).toBe(stringValue);

		console.log(ref.current);
	});
});
