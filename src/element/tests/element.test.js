import { h } from "../../core";
import { Element, customElement, css } from "../";
import { hashCustomElement } from "./utils";

class CustomElement extends Element {
	static props = {
		fieldString: String,
		fieldNumber: Number,
		fieldBoolean: Boolean,
		fieldObject: Object,
		fieldArray: Array
	};
	render() {
		return (
			<host>
				<h1>hola</h1>
			</host>
		);
	}
}

let innerRootExample = hashCustomElement(CustomElement);

describe("element/tests/element", () => {
	it("Test field type string", async done => {
		let node = innerRootExample(`field-string="hello"`);

		await node.mounted;

		expect(node.fieldString).toBe("hello");

		done();
	});
	it("Test field type number", async done => {
		let node = innerRootExample(`field-number="100"`);

		await node.mounted;

		expect(node.fieldNumber).toBe(100);

		done();
	});
	it("Test field type boolean", async done => {
		let node = innerRootExample(`field-boolean`);

		await node.mounted;

		expect(node.fieldBoolean).toBe(true);

		done();
	});
	it("Test field type object", async done => {
		let node = innerRootExample(`field-object='{"field":true}'`);

		await node.mounted;

		expect(node.fieldObject).toEqual({ field: true });

		done();
	});

	it("Test field type array", async done => {
		let node = innerRootExample(`field-array='[]'`);

		await node.mounted;

		expect(node.innerHTML).toBe("<h1>hola</h1>");

		done();
	});

	it("Test customElement", async done => {
		function MyWc({ value }) {
			return <host>function {value}</host>;
		}

		MyWc.props = { value: Number };

		let innerElement = hashCustomElement(customElement(MyWc));

		let node = innerElement(`value="10"`);

		await node.mounted;

		expect(node.textContent).toBe("function 10");

		done();
	});
	it("Test shadowDom with styleSheet", async () => {
		let styleSheet = css`
			:host {
				display: flex;
				width: 100px;
				height: 100px;
			}
		`;

		function MyWc() {
			return <host shadowDom styleSheet={styleSheet} />;
		}
		let innerElement = hashCustomElement(customElement(MyWc));

		let node = innerElement();

		await node.mounted;

		let { display, width, height } = window.getComputedStyle(node);

		expect({ display, width, height }).toEqual({
			display: "flex",
			width: "100px",
			height: "100px"
		});
	});

	it("Test schema prop", async () => {
		function MyWc() {
			return <host />;
		}

		MyWc.props = {
			field: {
				type: Boolean,
				reflect: true,
				value: true
			}
		};

		let innerElement = hashCustomElement(customElement(MyWc));

		let node = innerElement();

		await node.mounted;

		expect(node.hasAttribute("field")).toBe(true);

		node.field = false;

		await node.process;

		expect(node.hasAttribute("field")).toBe(false);
	});
});
