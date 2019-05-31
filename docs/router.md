# atomico/router

Small router for route management with Atomico.

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

## Route parameters

| typw               | flag           | example              |
| ------------------ | -------------- | -------------------- |
| required           |                | `/folder/folder`     |
| required parameter | `/:folder`     | `/:paramA/:paramB`   |
| optional parameter | `/:folder?`    | `/:paramA?/:paramB?` |
| Spread parameter   | `/:folders...` | `/:folders...`       |

## hooks

### useMatchRoute

```js
let [inRoute, params] = useMatchRoute("/:id");
```

Compare the current route with the capture pattern, **this hooks does not subscribe to history**

### useRoute

```js
let [inRoute, params] = useRoute("/:id");
```

Compare the current route with the capture pattern, **This hooks if you subscribe to history**

### useRedirect

This hook supports a first optional parameter, which modifies its behavior.

#### static redirect

This type of redirect applies memo, so the callback will only mutate if the first parameter mutates.

```jsx
let toHome = useRedirect("/");

<button onClick={toHome}> click </button>;
```

#### dynamic redirect

This redirect is designed for dynamic pathnames.

```jsx
let redirect = useRedirect();

<button onClick={() => redirect("/")}> click </button>;
```

### useHistory

subscribes to the browser history.

```jsx
let [pathname, redirect] = useHistory();
```
