import { createContainer } from "../utils.js";
import { h, render, useState } from "../../index.js";

describe("core/tests/hooks/use-state", () => {
	// verify that useState returns the desired state
	it("basic", () => {
		let scope = createContainer(),
			initialState = 777;

		function Test() {
			let [state, setState] = useState(initialState);
			expect(state).toBe(initialState);
		}
		render(<Test />, scope);
	});
	// verify that useState returns a state by invoking a function
	it("basic function", () => {
		let scope = createContainer(),
			initialState = 777,
			returnState = () => initialState;
		function Test() {
			let [state, setState] = useState(returnState);
			expect(state).toBe(initialState);
		}
		render(<Test />, scope);
	});
	/**
	 * verify that useState modify its status
	 * after 100 ms to state2.
	 */
	it("basic loop", done => {
		let scope = createContainer(),
			state1 = 0,
			state2 = 2;

		function Test() {
			let [state, setState] = useState(state1);
			if (state === state1) {
				setTimeout(() => {
					setState(state2);
					setTimeout(() => {}, 100);
				}, 100);
			} else {
				expect(state).toBe(state2);
				done();
				return;
			}
			expect(state).toBe(state1);
		}

		render(<Test />, scope);
	});
});
