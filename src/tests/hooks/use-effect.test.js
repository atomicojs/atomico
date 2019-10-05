import { h, useEffect } from "../../core/core";
import { customElementScope } from "../utils";

describe("useEffect", () => {
	it("initialize state", async done => {
		function Wc() {
			useEffect(() => {
				expect(true).toBeTruthy();
				return () => {
					expect(true).toBeTruthy();
					done();
				};
			});
			return <host />;
		}

		let node = customElementScope(Wc);

		document.body.appendChild(node);

		await node.rendered;

		node.remove();
	});
});
