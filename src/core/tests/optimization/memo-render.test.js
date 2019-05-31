import { h, render } from "../../index.js";
import { createContainer } from "../utils.js";

describe("core/tests/optimization: prevent render if the properties do not mutate", () => {
	let children = "children";
	it("ignore update by inheritance of children", () => {
		let scope = createContainer();
		let rerenderCount = 0;

		function Test() {
			rerenderCount++;
		}

		render(<Test>{children}</Test>, scope);
		render(<Test>{children}</Test>, scope);
		render(<Test>{children}</Test>, scope);

		expect(rerenderCount).toBe(1);
	});

	it("ignore update due to non-mutation of properties", () => {
		let scope = createContainer();
		let rerenderCount = 0;

		function Test() {
			rerenderCount++;
		}

		render(<Test id="10" />, scope);
		render(<Test id="10" />, scope);
		render(<Test id="10" />, scope);

		expect(rerenderCount).toBe(1);
	});
});
