import { createContainer } from "../utils.js";
import { h, render, useEffect, useRef } from "../../index.js";

describe("core/tests/hooks/use-effect", () => {
	/**
	 * verify that useEffect is executed after the manipulation of the DOM
	 * for if to achieve the reference
	 */
	it("execution after rendering", done => {
		let scope = createContainer();
		function Test() {
			let ref = useRef();
			useEffect(() => {
				expect(ref.current.nodeName).toBe("H1");
				done();
			});
			return <h1 ref={ref}>hello</h1>;
		}
		render(<Test />, scope);
	});
	it("execution before rendering", done => {
		let scope = createContainer();
		function Test() {
			let ref = useRef();
			useEffect(() => {
				return () => {
					expect(ref.current.nodeName).toBe("H1");
					done();
				};
			});
			return <h1 ref={ref}>hello</h1>;
		}
		render(<Test />, scope); // created
		render(null, scope); // remove
	});
});
