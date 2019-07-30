# submodules

## atomico/html

permite generar virtual-dom mediante template string, gracias a la biblioteca [htm](https://github.com/developit/htm), el template string, es mas amigable con el uso del tag style, recomiendo ver el [plugins inline html](https://github.com/pushqrdx/vscode-inline-html) para vsc creado para lit-html, ya que permite resaltar html.

```js
import { customElement } from "atomico";
import html from "atomico/html";

function WebComponent() {
	return html`
		<host>
			web-component!
		</host>
	`;
}
customElement("web-component", WebComponent);
```

## atomico/router

Small router for route management with Atomico, [documentacion](./router.md)

```jsx
import { h, customElement } from "atomico";
import { lazy } from "atomico/lazy";
import { Router } from "atomico/router";

let PageHome = lazy(() => import("./pages/home"));
let PageUsers = lazy(() => import("./pages/users"));
let PageConfig = lazy(() => import("./pages/config"));
let NotFound = () => <h1>404</h1>;

function App() {
	return (
		<host>
			<Router>
				<PageHome path="/" loading="loading home..." />
				<PageUsers path="/users" loading="loading users..." />
				<PageConfig path="/users" loading="loading config..." />
				<NotFound default />
			</Router>
		</host>
	);
}

customElement("my-app", App);
```

## atomico/lazy

This function allows the dynamic importation of components. [documentacion](./lazy.md)

```jsx
import { h, customElement } from "atomico";
import { lazy } from "atomico/lazy";
import Loading from "./wc-components/loading";

let PageHome = lazy(() => import("./pages/home"));

function App() {
	return (
		<host>
			<PageHome loading={<Loading title="loading home..." />} />
		</host>
	);
}

customElement("my-app", App);
```
