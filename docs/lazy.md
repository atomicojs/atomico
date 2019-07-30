# atomico/lazy

This function allows the dynamic importation of components.

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

| Property | Type          | Description                                                                    |
| -------- | ------------- | ------------------------------------------------------------------------------ |
| loading  | string, vnode | the loading property will be tricked while waiting for the module's resolution |

## useLazy

This hooks allows to generate the same effect as lazy, but without depending on HoCs.
