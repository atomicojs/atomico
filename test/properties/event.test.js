import { container } from "../util";
import { h, render } from "../../src";

describe("Event", () => {
	test("listener and unlistener event", () => {
		let scope = container(),
			ref = {},
			call = 0;

		function onClick() {
			call++;
		}

		function dispatch() {
			ref.current.dispatchEvent(new CustomEvent("click"));
		}

		render(<button ref={ref} onClick={onClick} />, scope);

		dispatch();

		render(<button ref={ref} />, scope);

		dispatch();

		expect(call).toBe(1);
	});
});
