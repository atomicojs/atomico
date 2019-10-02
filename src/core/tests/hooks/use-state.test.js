import { createHookCollection, useState } from "../../hooks";

describe("useState", () => {
	it("state modification", () => {
		let { load, hooks } = createHookCollection(function render() {});

		load(() => {
			let [state, setState] = useState(0);
		});

		expect(hooks[0][1][0]).toBe(0);

		load(() => {
			let [state, setState] = useState(0);

			setState(10);
		});
		/**
		 * [0] - hook
		 * [1] - [state,setState]
		 * [0] - state
		 */

		expect(hooks[0][1][0]).toBe(10);
	});
	it("initial state as a function", () => {
		let { load, hooks } = createHookCollection(function render() {});

		load(() => {
			let [state, setState] = useState(() => 10);
		});

		expect(hooks[0][1][0]).toBe(10);
	});
});
