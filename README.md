# Atomico

![logo](https://res.cloudinary.com/dz0i8dmpt/image/upload/v1558846223/github/atomico/header.png)

[![CircleCI](https://circleci.com/gh/atomicojs/atomico.svg?style=svg)](https://circleci.com/gh/atomicojs/atomico)
[![npm](https://badgen.net/npm/v/atomico)](http://npmjs.com/atomico)
[![gzip](https://badgen.net/bundlephobia/minzip/atomico)](https://bundlephobia.com/result?p=atomico)

Small library for the creation of interfaces based on web-components, only using functions and hooks, if you want to try Atomico and you need help tell me in [Twitter Uppercod 🤓](https://twitter.com/Uppercod).

[![example](https://res.cloudinary.com/dz0i8dmpt/image/upload/v1559964304/github/atomico/carbon_6.png)](https://codesandbox.io/s/web-component-example-zhpbq?fontsize=14&module=%2Fsrc%2Fweb-components%2Fatomico-counter%2Findex.js)

1. [Installation, `npm init @atomico`](#installation)
2. [Installation in the browser](#installation-in-the-browser)
3. [Hooks](#hooks)
    1. [useState](#usestate)
    2. [useEffect](#useeffect)
    3. [useReducer](#usereducer)
    4. [useMemo](#usememo)
    5. [useRef](#useref)
    6. [useHost](#usehost)
4. Modules
    1. [atomico/lazy](./docs/lazy.md)
    2. [atomico/router](./docs/router.md)
5. [Examples](https://github.com/atomicojs/examples)
    1. [small Store, PWA](https://atomicojs.github.io/examples/atomico-store/dist)
    1. [Small ToDo, 4kB](https://atomicojs.github.io/examples/atomico-todo/dist)
6. [Observables](#observables)
    1. [Types of observables](#types-of-observables)
7. [Styling a web-component](#styling-a-web-component)
8. [Advanced](#advanced)
    1. [Components](#components)
    2. [Memorization](#memorization)
    3. [customElement](#customelement)
    4. [Template Factory](#template-factory)
    5. [children](#children)

## Installation

Atomico has a project generator, you can initialize using `npm init @atomico`.

**⚠️ Remember Atomico is a modern package, which is distributed and maintained as an MJS module**

```cmd
npm init @atomico

Welcome to Atomico, let's create your project

√ name? ... project-name
√ description? ... project-description

Ready!, check the folder ./project-name and ./project-name/README.md

Next step, commands!

  cd project-name
  yarn | npm i
```

Alternatively, if you have an existing project you can incorporate Atomico simply using, JS pragma used by Atomico is defined as part of the module exporting `h` or`createELement`.

```bash
npm install atomico
```

## Installation in the browser

Bundle is distributed in MJS and is browser friendly, you can prototype without a bundle manager. to facilitate this Atomico distributes a module called html that is a configuration generated thanks to [htm](https://github.com/developit/htm). **This way of working is only for prototypes, as an author I recommend the use of [Rollup](https://rollupjs.org/) for the creation of distributable applications or web-components.**

```html
<!--declare your web-component-->

<web-component message="Hello!"></web-component>

<!--create your web-component-->
<script type="module">
	import { customElement } from "https://unpkg.com/atomico@0.8.8";
	import html from "https://unpkg.com/atomico@0.8.8/html.js";

	function WebComponent({ message }) {
		return html`
			<host shadowDom>
				${message}
			</host>
		`;
	}

	WebComponent.observables = {
		message: String
	};

	customElement("web-component", WebComponent);
</script>
```

## Hooks

### What are hooks?

Hooks, allows to add states and effects(life cycle) to functional components, **allowing to reuse the logic between components in a simple and scalable way**.

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

[🔗 Example in codesanbox](https://codesandbox.io/s/webcomponentexample-np89o?fontsize=14&module=%2Fsrc%2Fweb-components%2Fuse-state%2Findex.js)

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

[🔗 Example in codesanbox](https://codesandbox.io/s/webcomponentexample-np89o?fontsize=14&module=%2Fsrc%2Fweb-components%2Fuse-effect%2Findex.js)

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

## Observables

The observables are a layer of the statico method `observedAttributes` characteristic of web-components. using a key object and value you can define attributes and properties, the key format of the observable is camelCase, which Atomico will transform into a valid attribute, example`myProperty`will be the attribute`my-property`.

```jsx
import { h, customElement } from "atomico";

function WebComponent({ message, showMessage }) {
	return <host>my {showMessage && message}!</host>;
}

WebComponent.observables = {
	message: String,
	showMessage: Boolean
};

customElement("web-component", WebComponent);
```

Example of use from HTML

```html
<web-component show-message message="Atomico"></web-component>
```

Example of use from the JS

```js
let wc = document.querySelector("web-component");

wc.showMessage = true;
wc.message = "Atomico";
```

### Types of observables

The types are defined by the use of primitive constructors, eg `String`, `Number` or `Object`.

| Type     | Description                                                                      |
| -------- | -------------------------------------------------------------------------------- |
| String   | -                                                                                |
| Number   | -                                                                                |
| Boolean  | It is reflected, this status is shown as an attribute in the web-component       |
| Object   | -                                                                                |
| Array    | -                                                                                |
| Promise  | -                                                                                |
| Function | If this one comes from an attribute Atomico will look for the callback in window |

## Styling a web-component

To nest encapsulated styles within the web-component, you must enable the use of shadowDom, use `<host shadowDom>`.

### Tag style

Style generation can be declared inside the `<style>` tag, this form allows the generation of dynamic styles.

```jsx
import { h, customElement, css } from "atomico";

function WebComponent() {
	return (
		<host shadowDom>
			<style>{`
				:host {
					color: red;
				}
			`}</style>
			hello!
		</host>
	);
}

customElement("web-component", WebComponent);
```

### Import css

You can import using the plugins [@atomico/rollup-plugin-import-css](https://github.com/atomicojs/rollup-plugin-import-css), css in flat format, preprocessed by postcss, by default this already delivered minified.

```jsx
import { h, customElement, css } from "atomico";
import style from "./style.css";

function WebComponent() {
	return (
		<host shadowDom>
			<style>{style}</style>
			hello!
		</host>
	);
}

customElement("web-component", WebComponent);
```

### CSSStyleSheet

Atomico supports the definition of styles created by the [CSSStyleSheet](https://wicg.github.io/construct-stylesheets/#proposed-solution) constructor.

```jsx
import { h, customElement, css } from "atomico";

function WebComponent() {
	return <host shadowDom>hello!</host>;
}

WebComponent.styles = [
	css`
		:host {
			color: red;
		}
	`
];

customElement("web-component", WebComponent);
```

## Advanced

### Components

Atomico allows a hybrid use between react style components and web-components, the components can use hooks like `useEffect`, `useState`, `useMemo`, `useRef` and `useReducer`. **With these you can apply the pattern of HIGH ORDER COMPONENTS**, `atomico/router` and `atomico/lazy` are apis created with this pattern.

### Memorization

Atomico applies the memorization pattern to all components, the effect is similar to applying `React.memo`.
**This allows to generate optimizations to the tree of dom**, avoiding that a component is forced by an update from parent if this has not modified its properties, this is applicable both for web-component and components, eg:

```jsx
function PartComponent({ message }) {
	useEffect(() => {
		console.log("update");
	});
	return <div>{message}</div>;
}

function WebComponent() {
	let [value = 0, setValue] = useObservable("value");
	return (
		<host>
			<PartComponent message="PartComponent!" />
			{counter}
			<button onClick={() => setValue((value += 1))}>increment</button>
		</host>
	);
}

WebComponent.observable = {
	value: Number
};
```

> The `<PartComponent/>` component is only rendered once, since the `message` property does not mutate, this is useful when applying complex trees, through this optimization you can avoid the proceeding of virtual-dom forced by the parent.

### customElement

This function allows you to register a web-component and return a functional instance of it.
useful to declare the web-component, not as tagHtml but as a component, this is useful to apply tree-shaking, since you can address the import, eg:

```jsx
import { customElement } from "atomico";
export default customElement("web-component", WebComponent);
```

#### Statement as tag-html

```jsx
import "./web-component.js";
function MyApp() {
	return (
		<host>
			<web-component />
		</host>
	);
}
```

#### Statement as a component

**Prefer this option if you are conformed the DOM trees from Atomico**

```jsx
import WebComponent from "./web-component.js";
function MyApp() {
	return (
		<host>
			<WebComponent />
		</host>
	);
}
```

### Template Factory

Atomico facilitates the creation of completely isolated and reusable interfaces between components, thanks to the HoCs pattern you can compose conditional interfaces in a simple way.

```jsx
import styleButton from "./style-button.css";
import styleInput from "./style-input.css";
import styleRadio from "./style-radio.css";

function TypeButton() {
	return (
		<host shadowDom>
			<style>{styleButton}</style>
		</host>
	);
}

function TypeInput() {
	return (
		<host shadowDom>
			<style>{styleInput}</style>
		</host>
	);
}

function TypeRadio() {
	return (
		<host shadowDom>
			<style>{styleRadio}</style>
		</host>
	);
}

function FormInput({ type }) {
	switch (type) {
		case "button":
			return <TypeButton />;
		case "radio":
			return <TypeRadio />;
		default:
			return <TypeRadio />;
	}
}

FormInput.observables = {
	type: String
};

customElement("atom-form-input", FormInput);
```

```html
<atom-form-input type="button"></atom-form-input>
<atom-form-input type="radio"></atom-form-input>
<atom-form-input type="text"></atom-form-input>
```

> You can even use `atomico/lazy` for asynchronous loads.

### children

When using HoCs, the invoked component will return the `children` property, already known to React users.
it has the same behavior as React, so children is not always an array. so that this is always an array you must use the `toList` function, eg:

```jsx
import {toList} from "atomico";

toList(values:any,map?:Function):VNode[];
```

#### Example

```jsx
import { toList } from "atomico";

function Part({ children }) {
	return (
		<div>
			{toList(children, child => (
				<button>{child}</button>
			))}
		</div>
	);
}

function WebComponent() {
	return (
		<host>
			<Part>
				<span>1</span>
				<span>2</span>
				<span>3</span>
			</Part>
			<Part>
				<span>1</span>
			</Part>
		</host>
	);
}
```
