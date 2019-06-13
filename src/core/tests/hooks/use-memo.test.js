import { createContainer } from "../utils";
import { h, render, useMemo } from "../../";

describe("core/tests/hooks/use-memo", () => {
	it("without execution", () => {
		let scope = createContainer(),
			executionCounter = 0;

		function Test() {
			let data = useMemo(() => {
				executionCounter++;
				return [];
			}, []);
		}

		for (let i = 0; i < 10; i++) {
			render(<Test id={i} />, scope);
		}
		expect(executionCounter).toBe(1);
	});
});
