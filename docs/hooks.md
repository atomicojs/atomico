# Hooks

The Atomico syntax is based on the functional experience inherited from React, Atomico applies this functional behavior to create web-components with a readable, sustainable and simple code... Thanks React.

1. core
    1. [useState](#usestate)
    2. [useEffect](#useeffect)
    3. [useMemo](#usememo)
    4. [useRef](#useref)
    5. [useProp](#useprop)
2. atomico/lazy
    1. [useLazy](#uselazy)
3. atomico/router
    1. [useRouter](#userouter)
    2. [useRoute](#useroute)
    3. [useRedirect](#useredirect)
4. atomico/use-state-generator
    1. [useStateGenerator](#usestategenerator)

## useState

create a local state in the web-component

```jsx
let [state, setState] = useState(initialState);
```

Where :

-   `state`: current status of the hook.

-   `setState`: function that modifies the current state.

    > **If it is a function** it will be executed receiving as argument the current state to return the next state

-   `initialState`: initial state.

    > **If function** will be executed to return the initial state

#### Example

```jsx
let [count, setCount] = useState(0);

function increment() {
	setCount(count + 1);
}

<host>
	count : {count}
	<button onclick={increment}>increment</button>
</host>;
```

Where :

-   `count`: current state initializing at `0`.
-   `increment`: handler that updates the current state thanks to the use of `setCount`

## useEffect

creates a side effect associated with the render cycle, useful for controlling effects that interact with the DOM or asynchrony

```jsx
function afterRender() {
	console.log("after render");
	return beforeNewRender;
}

function beforeNewRender() {
	console.log("new render");
}

useEffect(afterRender, optionalArgument);
```

Where:

-   `afterRender`: function that is executed after the render associated with the hook.
-   `beforeNewRender` return of the `afterRender` function and this will be executed only if a new render is generated or the hook is dismounted

Consider that in the example the functions are separated to define their use, it is recommended that the return callback always exists within the function that requires useEffect, since the objective is the cleaning of events that are generated in the scope of execution of the hook, eg:

#### Example

```jsx
let [route, setRoute] = useState(location.pathname);

useEffect(() => {
	function handler() {
		setRoute(location.pathname);
	}
	window.addEventListener("popstate", handler);
	return () => window.removeEventListener("popstate", handler);
}, []);
```

In the example useEffect it is executed only once indifferent to the associated number of updates, this being useful for the subscription of external events to the hook.

## useMemo

memorize the return of a callback limiting its execution through an array of arguments, this is executed at the time of rendering

```jsx
let data = useMemo(() => {
	for (let i = 0; i < length; i++) {
		data.push({ key: i, ...placeholder });
	}
}, [length]);
```

## useRef

allows you to create a reference that remains mutable between renders.

```js
let ref = useRef(optionalCurrent);
```

Where:

-   `ref`: Persistent mutable object between renders
-   `opcionalCurrent`: initial state of the `ref.current` property

#### Example

```jsx
let ref = useRef();

useEffect(() => {
	ref.current.addEventListener("click", ({ target }) => {
		console.log({ target });
	});
}, [ref]);

<host>
	<button ref={ref}> click </button>
</host>;
```

## useProp

access a previously declared property (props) on the container (web-component), **allowing the state of these properties to be manipulated from the render cycle**.

```jsx
let [value, setValue] = useProp(propName);
```

Where :

-   `value`:is the current state of the property associated with the web-component
-   `setValue`: function responsible for updating the state
-   `propsName`: property name to be modified by `useProp`

#### Example

```jsx
let [count, setCount] = useProp("count");

<host>
	count : {count}
	<button onclick={() => setCount(count + 1)}>increment</button>
</host>;
```

Before each change of count you can read these changes by means of the count property associated to the node of the DOM associated to the web-component, e.g. `nodeWebComponent.count`

# atomico/lazy

```jsx
import { useLazy } from "atomico/lazy";
```

## useLazy

create an ideal asynchronous node for the use of single-run import or request.

```jsx
let AsyncNode = useLazy(() => import("./dinamic-module"));
```

### Ejemplo

```jsx
let UiHeader = useLazy(() =>
	import("./src/web-components/ui-header/ui-header")
);

return (
	<host>
		<UiHeader loading="...loading"></UiHeader>
	</host>
);
```

# atomico/router

```js
import { useRouter, useRoute, useRedirect } from "atomico/router";
```

## useRouter

define from an object the current view to use based on the current route

```jsx
let paths = {
	"/": () => <WebComponentHome />,
	"/user/:id": ({ id }) => <WebComponentUser id={id} />,
	default: <h1>404</h1>
};
let View = useRouter(paths);
```

Where :

-   `paths`:object that defines the expressions for `useRouter` to perform the check that defines`View`
-   `View` return of the expression associated with `paths`.

## useRoute

define if a route is active and get the parameters of this.

```jsx
let [inRoute, paramsRoute] = useRoute("/:id?");
```

Where :

-   `inRoute`: Boolean that defines whether the expression matches the expression given to `useRoute`.

-   `paramsRoute`: Object that defines the parameters captured by the expression given to `useRoute`.

#### Wildcards of useRoute and useRouter

| Wildcard   | Description               |
| ---------- | ------------------------- |
| `/static`  | Required route            |
| `/:id`     | Required Parameter        |
| `/:id?`    | Optional parameter        |
| `/:any...` | optional spread parameter |

## useRedirect

```jsx
let goHome = useRedirect("/");
```

# atomico/use-state-generator

```js
import { useStateGenerator, delay } from "atomico/use-state-generator";
```

## useStateGenerator

This hook allows you to consume asynchronous generators or functions to define a state, this consumption is recursive so you can use it for streaming complex data and concurrency.

```jsx
let [state, promise] = useStateGenerator(callbackGenerator, initialState, vars);
```

Donde :

-   `state`:current status of the hook.
-   `promise`: promise that defines whether the asynchronous process of `useStateGenerator` has ended.
-   `callbackGenerator`: function asynchronous, asynchronous generator or generator to be consumed by `useStateGenerator`.
-   `initialState`: initial state of the hook.
-   `vars`: array of variables to be observed between renders, if one of these elements is different, it regenerates the hook by executing `callbackGenerator` again.

#### Example

```jsx
import { useStateGenerator, delay}
/** inside web-component */
let length = 10;
let [state] = useStateGenerator((state)=>{
	while(--state){
        yield delay(1000);
        yield state;
    }
    return state;
},0, [length])
```

The previous example generates a countdown of 10..1, each step is 1000ms.
