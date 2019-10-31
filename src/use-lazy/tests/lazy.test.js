import { h } from "../../core/core";
import { customElementScope } from "../../tests/utils";
import { useLazy } from "../use-lazy";

describe("use-lazy", () => {
	it("async", async done => {
		function Complete() {}
		function WC() {
			let NodeAsync = useLazy(
				new Promise(resolve =>
					setTimeout(() => {
						resolve(Complete);
					}, 1000)
				)
			);

			return <NodeAsync loading="...."></NodeAsync>;
		}
		let node = customElementScope(WC);
	});
});
