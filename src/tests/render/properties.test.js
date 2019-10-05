import { h } from "../../core/core";
import { customElementScope } from "../utils";

describe("properties", () => {
	it("transfer of prop to virtual-dom", async () => {
		let value = "10";

		function Wc({ value }) {
			return <host>{value}</host>;
		}

		Wc.props = {
			value: Number
		};

		let node = customElementScope(Wc);

		document.body.appendChild(node);

		node.value = value;

		await node.rendered;

		expect(node.textContent).toBe(value);

		node.value = value = value + value;

		await node.rendered;

		expect(node.textContent).toBe(value);
	});
	it("property definition from the host tag", async () => {
		let cn = "my-class";

		function Wc({ cn }) {
			return <host class={cn}></host>;
		}

		Wc.props = {
			cn: String
		};

		let node = customElementScope(Wc);

		document.body.appendChild(node);

		node.cn = cn;

		await node.rendered;

		expect(node.className).toBe(cn);
	});
});
