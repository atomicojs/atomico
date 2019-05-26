# Atomico

![logo](https://res.cloudinary.com/dz0i8dmpt/image/upload/v1558846223/github/atomico/header.png)

[![CircleCI](https://circleci.com/gh/atomicojs/atomico.svg?style=svg)](https://circleci.com/gh/atomicojs/atomico)
[![npm](https://badgen.net/npm/v/atomico)](http://npmjs.com/atomico)
[![gzip](https://badgen.net/bundlephobia/minzip/atomico)](https://bundlephobia.com/result?p=atomico)

Small library for the creation of interfaces based on web-components, only using functions and hooks.

```jsx
import { h, customElement } from "atomico";

function WebComponent() {
	return <host>hello word</host>;
}

customElement("web-component", WebComponent);
```

1. [installation](#installation)
2. [Hooks](#hooks)
   1. [useState](#usestate)
   2. [useEffect](#useeffect)
   3. [useReducer](#usereducer)
   4. [useMemo](#usememo)
   5. [useRef](#useref)
   6. [useHost](#usehost)
3. modules
   1. [atomico/lazy](./docs/lazy.md)
   2. [atomico/router](./docs/router.md)
4. examples

## Hooks

### What are hooks?

Gooks, allows to add states and effects(life cycle) to functional components, **allowing to reuse the logic between components in a simple and scalable way**.

### Why use hooks?

1. **Reuse of logic between components**, unlike a class its components will not require belonging to the context of `this`.

2. **Simpler and less code**, when using hooks your component will not require a declaration as a class, bringing as a benefit less code as your application scales.

### useState

```js
let [state, setState] = useState(initialState);
```

`setState` function, allows controlling one or more states associated with a component, the declaration`let [state, setState]`, is equivalent to:

1. `state` : current state
2. `setState` : status updater, if `setState` receives a function as a parameter it will receive and must return the next state.

#### Example

```jsx
function WebComponent() {
	let [state, setState] = useState(0);
	return (
		<host>
			<h1>example counter</h1>
			<button onClick={() => setState(state + 1)}>Increment</button>
		</host>
	);
}
```

### useEffect

```js
useEffect(afterRender);
```

`useEffect` function allows you to add side effects to a component.

```jsx
function WebComponent() {
	useEffect(() => {
		document.head.title = "web-component mounted";
		return () => (document.head.title = "web-component unmounted");
	}, []);

	return (
		<host>
			<h1>example useEffect</h1>
		</host>
	);
}
```

> useEffect, supports a second matrix of type of parameter, this allows to compare between renders the immutability of the parameters of the array, if there is a change useEffect will be executed again, **the previous example will execute the function only when the component has been mounted.**

### useReducer

```js
let [state, dispatch] = useReducer(reducer, initialState);
```

`useReducer` is usually preferable to `useState` when you have complex state logic that involves multiple sub-values or when the next state depends on the previous one.

```jsx
const initialState = { count: 0 };

function reducer(state, action) {
	switch (action.type) {
		case "increment":
			return { count: state.count + 1 };
		case "decrement":
			return { count: state.count - 1 };
		default:
			throw new Error();
	}
}

function WebComponent() {
	let [state, dispatch] = useReducer(reducer, initialState);
	return (
		<host>
			Count: {state.count}
			<button onClick={() => dispatch({ type: "increment" })}>+</button>
			<button onClick={() => dispatch({ type: "decrement" })}>-</button>
		</host>
	);
}
```

### useMemo

```jsx
let memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

`useMemo` will only recalculate the stored value when one of the dependencies has changed. This optimization helps avoid costly calculations in each render.

### useRef

```jsx
let ref = useRef(initialValue);
```

`useRef` returns a mutable ref object whose `.current` property is initialized to the passed argument (initialValue). The returned object will persist for the full lifetime of the component.

### useHost

```jsx
let ref = useHost();
```

Returns a ref object, which allows to extract extract the web-component, it is ideal for the construction of hooks that interact with web-components directly.
