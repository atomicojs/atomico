import { createHookCollection, useEffect } from "../../hooks";

describe("useEffect", () => {
	it("reference modification", async () => {
		let { load, clean } = createHookCollection(function render() {});
		let ref = {};

		load(() => {
			useEffect(() => {
				ref.value = "effect";
				return () => {
					ref.value = "clear effect";
				};
			});
		});

		expect(ref.value).toBe("effect");

		clean();

		expect(ref.value).toBe("clear effect");
	});
});
