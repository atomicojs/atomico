import { h, render, useEffect } from "../../core/index.js";
import { lazy } from "../index.js";

function ShowLoad({ children }) {
	return <button>{children}</button>;
}

function ShowLoading({ children }) {
	return <span>{children}</span>;
}

describe("lazy/tests/lazy", () => {
	it("lazy", async done => {
		let LazyComponent = lazy(
			() =>
				new Promise(resolve =>
					setTimeout(() => resolve({ default: ShowLoad }), 100)
				)
		);

		let scope = document.createElement("div");

		function Step1() {
			useEffect(() => {
				expect(scope.querySelector("span")).not.toBe(null);
			});
		}

		function Step2() {
			useEffect(() => {
				expect(scope.querySelector("button")).not.toBe(null);
				done();
			});
		}

		render(
			<LazyComponent
				loading={
					<ShowLoading>
						<Step1 />
					</ShowLoading>
				}
			>
				<Step2 />
			</LazyComponent>,
			scope
		);
	});
});
