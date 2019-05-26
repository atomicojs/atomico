import { h, render } from "../../core/index.js";
import { Router, options } from "../index.js";

let delay = ms => new Promise(resolve => setTimeout(resolve, ms));

describe("router/tests/hocs", () => {
	it("Router", async done => {
		let scope = document.createElement("div");
		function App() {
			return (
				<Router>
					<h1 path="/">root</h1>
					<h2 path="/users">users</h2>
					<h3 default>404</h3>
				</Router>
			);
		}

		render(<App />, scope);

		expect(scope.querySelector("h3")).not.toBeNull();

		await delay(10); // useEffect is async, delay for subscribe browsers

		options.redirect("/users");

		await delay(10);

		expect(scope.querySelector("h2")).not.toBeNull();

		await delay(10); // useEffect is async, delay for subscribe browsers

		options.redirect("/");

		await delay(10);

		expect(scope.querySelector("h1")).not.toBeNull();

		done();
	});
});
