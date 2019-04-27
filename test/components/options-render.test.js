import { container } from "../util";
import { h, render } from "../../src";

describe("options render", () => {
	test("option.bind", done => {
		let bind = { done };
		let scope = container();
		let ref = {};
		function handler() {
			this.done();
		}
		render(<button onClick={handler} ref={ref} />, scope, { bind });
		ref.current.click();
	});
});
