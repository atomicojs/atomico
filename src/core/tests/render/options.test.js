import { createContainer } from "../utils";
import { h, render } from "../../";

describe("core/tests/render: options render", () => {
	it("option.bind", done => {
		let bind = { done };
		let scope = createContainer();
		let ref = {};
		function handler() {
			this.done();
		}
		render(<button onClick={handler} ref={ref} />, scope, { bind });

		ref.current.click();
	});
});
