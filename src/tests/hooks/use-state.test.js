import { h, useState } from "../../core/core";
import { customElementScope } from "../utils";

describe("useState", () => {
	it("initialize state", async () => {
		let ref = {};
		let initialState = 10;
		let instances = [];
		function Wc() {
			instances.push((ref.current = useState(initialState)));
			return <host />;
		}

		let node = customElementScope(Wc);

		document.body.appendChild(node);

		await node.rendered;

		expect(ref.current[0]).toBe(initialState);

		ref.current[1]((initialState = initialState * 2));
	});
	it("initial state callable", async () => {
		let ref = {};
		let initialState = 10;
		let instances = [];
		function Wc() {
			instances.push((ref.current = useState(() => initialState)));
			return <host />;
		}

		let node = customElementScope(Wc);

		document.body.appendChild(node);

		await node.rendered;

		expect(ref.current[0]).toBe(initialState);

		ref.current[1]((initialState = initialState * 2));

		await node.rendered;

		expect(ref.current[0]).toBe(initialState);
	});
});
