# @atomico/core

<img src="assets/logo-without-margin.png" style="max-width:320px"/>

[![CircleCI](https://circleci.com/gh/atomicojs/core.svg?style=svg)](https://circleci.com/gh/atomicojs/core)
[![npm](https://badgen.net/npm/v/@atomico/core)](http://npmjs.com/@atomico/core)
[![gzip](https://badgen.net/bundlephobia/minzip/@atomico/core)](https://bundlephobia.com/result?p=@atomico/core)

```jsx
import { h, render } from "@atomico/core";

function Emoji() {
	return <span>👋</span>;
}

render(<Emoji />, document.querySelector("#app"));
```

1. [Motivation](#motivation)
2. [Installation](#Installation)
3. [Virtual-dom](#virtual-dom)
4. [JSX](#jsx)
   1. [Logical conditions](#logical-conditions)
   2. [Eventos](eventos)
   3. [children](#children)
      1. [toList](#tolist)
5. [components as functions](#componentes-como-funciones)
6. [hooks](#hooks)
   1. [Why hooks?](#why-hooks?)
   2. [useState](#usestate)
   3. [useEffect](#useeffect)
   4. [useReducer](#usereducer)
   5. [useMemo](#usememo)
   6. [useRef](#useref)
   7. [useContext](#usecontext)
7. [createContext](#createcontext)
8. [Utilities](#utilities)
   1. [@atomico/element](#@atomico/element)
   2. [@atomico/store](#@atomico/store)
9. [Example](#example)

## Installation

With Atomico you can create modern applications only using the following command.

```bash
npm init @atomico
```

1. **Applications**
   1. **Parceljs** : without additional configuration
   2. **Rollup modern app** : configuration for modern browsers `>=es6`, supports:
      1. TS y JS, with [Sucrase](https://github.com/alangpierce/sucrase),
      2. Code splitting, with [Rollup](https://rollupjs.org/)
      3. PWA, with [Workbox](https://developers.google.com/web/tools/workbox/)
      4. test with Karma y [Jasmine](https://jasmine.github.io/).
2. **Webcomponent**, create a web component ready for publication in npm, it is a configuration for modern browsers `>=es6`, it supports:
   1. TS y JS, with [Sucrase](https://github.com/alangpierce/sucrase).
   2. Test with Karma y [Jasmine](https://jasmine.github.io/).

> You can enter [atomicojs/create](https://github.com/atomicojs/create), to know and contribute to the generated templates.

## Motivation

Como autor busco simplificar la curva de aprendizaje al momento de crear interfaces, para logrear esto he recolectado ideas ya existentes en el mundo de js y las he aplicado de forma eficiente.

## Virtual-dom

Atomico creates interfaces based on an object, this object can be created with [JSX](https://reactjs.org/docs/introducing-jsx.html), [HTM](https://github.com/developit/htm) or manually as the following example shows:

```js
/**
 * @param {object} vnode
 * @param {string|Function} vnode.type
 * @param {object} [vnode.props]
 */
let vnode = {
	type: "h1",
	props: {
		class: "my-class",
		onClick() {
			console.log("click!");
		}
	}
};
```

This object is not decorated by the diff process, so you can make static declarations of virtual nodes.

## JSX

Atomico preferably uses JSX for creation and interfaces.

### Logical conditions

Atomico does not print boolean or null values.

```jsx
// This type of condition forces props.show to be Boolean
function Show() {
	return <div>{props.show && <Emoji />}</div>;
}
// ternary
function Show() {
	return <div>{props.show ? <Emoji /> : ""}</div>;
}
```

### Events

To subscribe events to the node you must use the prefix `on` followed by the type of event.

```jsx
// lowerCase
function Button(props) {
	return <button onclick={props.handlerClick} />;
}
// camelCase
function Button(props) {
	return <button onClick={props.handlerClick} />;
}
```

### children

Children in Atomico work as in React, so if you are looking to iterate over `props.children` you will need to use the toList function, to generate a Array.

#### toList

This function allows to create recursively on props.children, it will always return a flat Array.

```jsx
// simple form
toList(props.children).map(() => <div>{child}</div>);
// recommended way for large iterations.
toList(props.children, (child, index) => <div>{child}</div>);
```

## components as functions

The components within Atomico are the functions, which can express side effects and states only when required.

```jsx
import { h, useEffect } from "@atomico/core";

export function Button(props) {
	useEffect(() => {
		console.log("Component mounted");
		return () => {
			console.log("Component remove");
		};
	});
	return <button>{props.children}</button>;
}
```

## hooks

The hooks inside Atomico are based on the pattern created by **React**, these allow you to add side effects to the function, be it update of states or listen of cycle between updates.

### Why hooks?

Los hooks permiten crear lógica reutilizable como nunca antes, mediante la definición de contextos que permiten escapar del polimorfismo tradicional de una clase, el patrón de hooks permite poseer código débilmente acoplado lo que resulta sumamente útil al momento de mantener o reducir dependencias.

### useState

[useState is based on the one implemented by React](https://reactjs.org/docs/hooks-state.html), it allows to create one or more observable state for the component.

```jsx
import { h, useState } from "@atomico/core";

function Example() {
	const [count, setCount] = useState(0);
	return (
		<div>
			<p>You clicked {count} times</p>
			<button onClick={() => setCount(count + 1)}>Click me</button>
		</div>
	);
}
```

### useEffect

[useEffect is based on the one implemented by React](https://reactjs.org/docs/hooks-effect.html), it allows to add side effects to the component.

```jsx
import { h, useEffect } from "@atomico/core";

function Example() {
	useEffect(() => {
		document.title = "component example mounted";
	});
	return "Example!";
}
```

useEffect also allows you to generate cleanness on the effects invoked within the callback, for this you must return a function.

```jsx
import { h, useEffect } from "@atomico/core";

function Example() {
	useEffect(() => {
		function handler() {
			console.log("Click window");
		}
		window.addEventListener("click", handler);
		return () => window.removeEventListener("click", handler);
	});
	return "Example!";
}
```

useEffect also allows asynchronous behavior.

```jsx
import { h, useEffect } from "@atomico/core";
import { delay } from "./utils";

function Example() {
	useEffect(async () => {
		await delay(200);
		document.title = "component example mounted";
	});
	return "Example!";
}
```

useEffect supports a second argument, this must be an array and it is capable of limiting the execution of useEffect between renders in front of the changes of said array.

```jsx
import { h, useEffect } from "@atomico/core";
import { delay } from "./utils";

function Example(props) {
	useEffect(async () => {
		await delay(200);
		document.title = `component ${props.title} example mounted`;
	}, [props.title]);
	return "Example!";
}
```

### useReducer

[useReducer is based on the one implemented by React](https://reactjs.org/docs/hooks-reference.html#usereducer), it allows to control the state of a component through the pattern of reducers expressed by Redux

```jsx
import { h, useReducer } from "@atomico/core";

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

function Counter({ initialState }) {
	const [state, dispatch] = useReducer(reducer, initialState);
	return (
		<div>
			Count: {state.count}
			<button onClick={() => dispatch({ type: "increment" })}>+</button>
			<button onClick={() => dispatch({ type: "decrement" })}>-</button>
		</div>
	);
}
```

### useMemo

[useMemo is based on the one implemented by React](https://reactjs.org/docs/hooks-reference.html#usememo), it allows you to memorize the return associated with a callback, limiting its execution when the second argument is changed.

```jsx
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

### useRef

[useRef is based on the one implemented by React](https://reactjs.org/docs/hooks-reference.html#useref), it allows to create a mutable object that does not change between renders.

```jsx
const refContainer = useRef(initialValue);
```

### useContext

[useContext is based on the one implemented by React](https://reactjs.org/docs/hooks-reference.html#usecontext) allows you to consume contexts created by [createContext](#createcontext).

```jsx
const value = useContext(MyContext);
```

## createContext

Create 2 components that allow you to manipulate or obtain the context associated with the `createContext` instance.

```jsx
import { h, createContext } from "@atomico/core";

let defaultValue = "default-context";

let Context = createContext(defaultValue);

// access the default value
<Context.Consumer>{value => <h1>{value}</h1>}</Context.Consumer>;

// access the value defined by Context.Provider
<Context.Provider value="parent-context">
	<Context.Consumer>{value => <h1>{value}</h1>}</Context.Consumer>
</Context.Provider>;
```

## Utilities

### @atomico/element

[@atomico/element](https://github.com/atomicojs/element) Allows the creation of web-expressive components used Atomico.

```jsx
import { h, useEffect } from "@atomico/core";
import Element from "@atomico/element";

class MyComponent extends Element {
	static attributes = {
		value: Number
	};
	render(props) {
		useEffect(() => {
			console.log("Component updated");
		});
		return <host shadowDom>{props.number * 2}</host>;
	}
}
```

> `<host/>` is a special tag within atomic that points to the container given to render, this is ideal to manipulate the WC, on the same diff process.

## Examples
