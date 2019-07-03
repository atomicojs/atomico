import { createContainer } from "../utils";
import { h, render } from "../../";

describe("core/tests/render: hydrate", () => {
	it("shadowDom", () => {
		let scope = createContainer();
		let ref = {};

		scope.innerHTML = `<div class="parent"><template data-shadow-dom><h1 class="child">title</h1></template></div>`;

		let dom = {
			div: scope.firstChild,
			h1: scope.querySelector("template").content.querySelector("h1")
		};

		render(
			<div class="parent" shadowDom ref={ref}>
				<h1 class="child">title</h1>
			</div>,
			scope
		);

		let { current } = ref;
		let { shadowRoot } = current;
		expect(current.outerHTML).toBe(`<div class="parent"></div>`);
		expect(shadowRoot.innerHTML).toBe(`<h1 class="child">title</h1>`);
		expect(current).toBe(dom.div);
		expect(shadowRoot.querySelector("h1")).toBe(dom.h1);
	});
});
