# @atomico/core

<center><img src="./assets/logo-without-margin.png" style="max-width:200px"/></center>

[![CircleCI](https://circleci.com/gh/atomicojs/core.svg?style=svg)](https://circleci.com/gh/atomicojs/core)
[![npm](https://badgen.net/npm/v/@atomico/core)](http://npmjs.com/@atomico/core)
[![gzip](https://badgen.net/bundlephobia/minzip/@atomico/core)](https://bundlephobia.com/result?p=@atomico/core)

It is a small library based on the React API, but with a size as small as Preact, focused on covering components such as functions, HoCs, hooks and web-components.

[![Example](./assets/example.png)](https://codesandbox.io/s/webcomponentexample-np89o)

1. [Installation](#installation)
2. [Components and Web-components](#components-and-web-components)
3. [Components](#Components)
4. [Web-components](#web-components)
   1. [Return rule](#return-rule)
   2. [Web-component as function](#web-component-as-function)
   3. [Web-component as a class](#web-component-as-a-class)
5. [Api homologated by React](#api-homologated-by-react)
   1. [useState](#usestate)
   2. [useEffect](#useeffect)
   3. [useReducer](#usereducer)
   4. [useMemo](#usememo)
   5. [useRef](#usememo)
6. [Hooks for web-components](#hooks-for-web-components)
   1. [useHost](#usehost)
7. [Benefits of Atomico](#benefits-of-atomico)
8. Examples
   1. [Atomico + Web-componets + PWA](https://atomicojs.github.io/examples/atomico-store/public/)

## Installation

```bash
# run
npm init @atomico

? Project Type # You must select a type of project
1. Create Aplication # allows the development of apps, with support of:
				   # dynamic modules, Typescript,
				   # WebComponents, PWA and Karma.
2. Create web-component # Create a WebComponent to be shared by NPM, with support of:
					  # dynamic modules, Typescript,
					  # WebComponents, PWA and Karma.
3. Exit # Escape the CLI
```

## Components and Web-components

Atomico allows a mixed components and web-components, only using functions, some small differences, for example if you declare web-components, this should always return the tag `<host/>`.

### Why mixed?

The components as functions, can manage DOM or logic vs the web-components that explicitly must redo DOM.

The benefit of this is that you can apply high order components (HoCs) to build complex reusable logic structures invisible to the DOM, such as routers or more.

## Components

The components that represent DOM or logic, you can use the hooks to control effects, such as updates, asynchronous waiting or more.

```jsx
function Emoji({ children }) {
	let [show, setState] = useState(0);
	return (
		<div>
			<button onClick={() => setState(!show)}>toggle</button>
			{show && "😃"}
		</div>
	);
}
```

[🔗 link example](https://codesandbox.io/s/usestate-pon5o)

## Web components

Atomico simplifies the generation of web-components, these are declared by a function with a return rule, these should always return the tag `<host>`.

### Return rule

All **web-components** declared must always return the `<host/>` tag, this return must be respected even if you apply high-order components.

### Web-component as function

```jsx
import { useEffect } from "@atomico/core";
import { h, customElement } from "@atomico/element";

function MyWebComponent(props) {
	useEffect(() => console.log("mounted"));
	return (
		<host shadowDom>
			<h1>{props.title}</h1>
			<slot />
		</host>
	);
}

MyWebComponent.observables = {
	title: String
};

customElement("my-web-component", MyWebComponent);
```

[🔗 link example](https://codesandbox.io/s/webcomponent-465ic)

### Web-component as a class

This is a traditional approach, Element is an extension of `HTMLElement`, the benefit of this type of statement is that you should not use bind on the functions associated with events. **You can use the hooks within render**

```jsx
import { h, Element, customElement } from "@atomico/element";

class MyWebComponent extends Element {
	static observables = { show: Boolean };
	toggle() {
		this.show = !this.show;
	}
	render() {
		return (
			<host shadowDom>
				<button onClick={this.toggle}>toggle</button>
				{this.show && "😃"}
			</host>
		);
	}
}

customElement("my-wc", MyWebComponent);
```

## Api homologated by React

### useState

```jsx
let [state, setState] = useState(0);
```

[Doc. from React](https://reactjs.org/docs/hooks-reference.html#usestate), Identical behavior.

### useEffect

```jsx
useEffect(effect);
```

[Doc. from React](https://reactjs.org/docs/hooks-reference.html#useeffect), Similar behavior, but Atomico optionally adds support to the use of asynchronous functions.

#### option 1

```jsx
useEffect(()=>{
	fetch("//api")...
})
```

#### option 2

```jsx
useEffect(async ()=>{
	await fetch("//api")...
})
```

useEffect, supports a second parameter type array, which allows to compare between renders the immutability of these, if there is a change useEffect will be executed again.

```jsx
useEffect(() => {
	// This callback is only executed when props.value changes as immutable
}, [props.value]);
```

useEffect, allows to execute an effect cleaning function through the return of a function.

```jsx
useEffect(() => {
	window.addEventListener("click", handler);
	return () => {
		// This callback is only executed once the component is deleted from the document
		window.removeEventListener("click", handler);
	};
}, []); // <<<<
```

### useReducer

```jsx
let [state, dispatch] = useReducer(reducer, initialState);
```

[Doc. from React](https://reactjs.org/docs/hooks-reference.html#usereducer), Atomico has not added support to the third parameter about useReducer.

useReducer is usually preferable to useState when you have complex state logic that involves multiple sub-values or when the next state depends on the previous one.

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

function Counter() {
	const [state, dispatch] = useReducer(reducer, initialState);
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
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

`useMemo` it will only recalculate the memorized value when one of the dependencies has changed. This optimization helps avoid costly calculations in each render.

### useRef

```jsx
const refContainer = useRef(initialValue);
```

`useRef` returns a mutable ref object whose `.current` property is initialized to the passed argument (`initialValue`). The returned object will persist throughout the component's lifetime.

## Hooks for web-components

### useHost

Returns a ref object, which allows to extract extract the web-component, it is ideal for the construction of hooks that interact with the web-components directly, [🔗 example](https://codesandbox.io/s/webcomponent-465ic)

## Benefits of Atomico

### tree shaking

Atomico has a weakly coupled api, favoring the generation of small bundles, thanks to the tree shaking process.

| Size(Gzip) | Group         | exports                                                 |
| ---------- | ------------- | ------------------------------------------------------- |
| 1.7kB      | virtual-dom   | `{ h, render, options, toList }`                        |
| 1.0kB      | hooks         | `{ useState, useEffect, useMemo, useReducer, useHost }` |
| 1.0kB      | web-component | `{ customElement }`                                     |

### Memo by default in all components

If you are already a React user you may know `React.memo`, this allows you to update only when one of its properties changes as immutable, this technique is known as [Memoization](https://en.wikipedia.org/wiki/ Memoization), Atomico applies this to all components.

```jsx
function Style(props) {
	useEffect(() => {
		console.log("re-render");
	});
	return <style>{props.children}</style>;
}

function MyWebComponent(props) {
	useEffect(() => console.log("mounted"), []);
	let ref = useHost();
	return (
		<host shadowDom>
			<Style>{`
      :host{padding:3rem;display:block}
      input{padding:.5rem 1rem;border-radius:5px;border:none}
      `}</Style>
			<h1>{props.title}</h1>
			<input
				value={props.title}
				onInput={({ target }) => {
					ref.current.title = target.value;
				}}
			/>
			<slot />
		</host>
	);
}
```

[🔗 link example](https://codesandbox.io/s/webcomponentandmemo-s8tkk)

Regardless of the number of times the web-component is updated, the Style component will be ignored by the diff process since its children do not change.
