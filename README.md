![logo](https://res.cloudinary.com/dz0i8dmpt/image/upload/v1558846223/github/atomico/header.png)

[![CircleCI](https://circleci.com/gh/atomicojs/atomico.svg?style=svg)](https://circleci.com/gh/atomicojs/atomico)
[![npm](https://badgen.net/npm/v/atomico)](http://npmjs.com/atomico)
[![gzip](https://badgen.net/bundlephobia/minzip/atomico)](https://bundlephobia.com/result?p=atomico)

Small library for the creation of interfaces based on web-components, only using functions and hooks, if you want to try Atomico and you need help tell me in [Twitter Uppercod 🤓](https://twitter.com/Uppercod).

1. [Getting started](#getting-started)
2. [Web-componts with Atomico](#web-componts-with-atomico)
    1. [⚠️ Return Rule](#return-rule)
    2. [tag host](#tag-host)
    3. [Properties declaration](#properties-declaration)
    4. [declaración del web-component](#web-component-declaration)
3. [Hooks](./docs/hooks.md)
4. [Submodules](./docs/submodules.md)
    1. [atomico/html](./docs/submodules.md#atomico-html)
    2. [atomico/lazy](./docs/lazy.md)
    3. [atomico/router](./docs/router.md)
5. Examples
    1. [clock](https://webcomponents.dev/edit/IdsYJfstjqxuFl31IrlM)
    2. [calculator](https://webcomponents.dev/edit/kXoq2IzoqYhKKUoU8Tw2)
    3. [todo](https://atomicojs.github.io/examples/atomico-todo/dist/)
    4. [atomico/router y atomico/lazy](https://atomicojs.github.io/examples/atomico-store/dist/)
    5. [more examples in webcomponents.dev](https://webcomponents.dev/demos/atomico)
6. Advanced
    1. [Optimization](./docs/advanced.md#optimization)
    2. [High order components](./docs/advanced.md#high-order-components)
    3. [template factory](#template-factory)

## Getting started

### cli

```bash
npm init @atomico
```

Create a project ready for css import, component distribution, application development and design system creation.

### npm

```bash
npm install atomico
```

General installation for custom environments.

### unpkg

Ideal for prototyping in the browser, eg:

```html
<script type="module">
	import { customElement } from "https://unpkg.com/atomico@latest/index.js";
	import html from "https://unpkg.com/atomico@latest/html.js";

	function WebComponent() {
		return html`
			<host>
				web-component!
			</host>
		`;
	}

	customElement("web-component", WebComponent);
</script>
```

### webcomponents.dev

This site allows a friendly development, since it allows to visualize, document and distribute our web-components, visit [webcomponents.dev/demos/atomico](https://webcomponents.dev/demos/atomico) to see some examples.

## Web-componts with Atomico

The aesthetics of web components with components is simple and minimalist, [eg live](https://webcomponents.dev/edit/mGt2cM70Zz3pNa60R5Cn)

```jsx
import { h, customElement } from "atomico";

function WebComponent() {
	/** hooks and composition logic */
	let [state, setState] = useState(0);
	/** state of the dom */
	return (
		<host>
			<h1>{state}</h1>
			<button onclick={() => setState(state - 1)}>decrement</button>
			<button onclick={() => setState(state + 1)}>increment</button>
		</host>
	);
}

export default customElement(WebComponent);
```

### return rule

Atomico has a single rule when working with web-components, this should always return the **host** tag, since this tag represents the state of the web-components itself.

### tag host

The host tag represents the same web-component, this tag takes advantage of the diff process applied by the virtual-dom, to affect the state of itself.

#### declarative and optional shadow-dom as property

```jsx
function WebComponent() {
	/** customElement sin shadowDom */
	return <host>...children</host>;
}

function WebComponent() {
	/** customElement con shadowDom */
	return <host shadowDom>...children</host>;
}
```

#### definition of events, attributes and children

```jsx
function WebComponent() {
	const handler = () => console.log("click!");
	return (
		<host
			shadowDom
			class="web-component"
			onclick={handler}
			style={{ color: red }}
		>
			<style>{`:host{color:crimson}`}</style>
			<h1>my title</h1>
			<button>my button</button>
		</host>
	);
}
```

### Properties declaration

The `props`(properties) are a decorated layer that improves the `observedAttributes` experience, by means of the props you can define properties with which the customElement can read or interact mediate the `useProp` hook, example of declaration.

```jsx
WebComponent.props = {
	/** simple type */
	fieldString: String,
	/** schema style */
	fieldBoolean: {
		type: Boolean,
		reflect: true, // Reflects the value as an attribute
		value: true // Initialize a default value
	}
};
```

### Types of props

The validation compares the primitive type with the input value, if it comes from a string it will be forced to be the declared primitive type, eg `{"name":"Atomico"}` will be transformed to `{name:"Atomico"}`

| Types                        | read attribute | Description                                                                                                                             |
| ---------------------------- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| String                       | ✔️             | The property or attribute must be a string                                                                                              |
| Number                       | ✔️             | The property or attribute must be a number                                                                                              |
| Boolean                      | ✔️             | The property or attribute must be a boolean                                                                                             |
| Object                       | ✔️             | The property or attribute must be a object                                                                                              |
| Array                        | ✔️             | The property or attribute must be a array                                                                                               |
| Date                         | ✔️             | the property or attribute must be a valid date for `new Date`                                                                           |
| Function                     | ✔️             | if it is an attribute, the specified function will be obtained from window, eg `window[prop]`                                           |
| Map, Promise, Symbol, RegExp | ❌             | Functional type checking under any global object that has the `name` property, these properties do not have interaction as an attribute |

### Web-component declaration

The functional behavior is not valid for `customElements.define`, to achieve a successful registration you must use the `customElement` function.

```tsx
/**
 * Allows the creation or registration of the customElement
 * @param {(string|Function)} tagName - if it is a function, an HTMLElement is returned
 * @param {Function} [component] - if defined, it returns a valid function as a JSX component
 * @return {(HTMLElement|Function)}
 */
customElement(tagName, component);
```

#### Example

```jsx
import { customElement } from "atomico";
import WebComponent from "./web-components";

/** ✔️ valid for anonymous export */
customElements.define("custom-element", customElement(WebComponent));

<custom-element />; // jsx

/** ✔️ valid for global declaration */
let CustomElement = customElement("custom-element", WebComponent);

<CustomELement />; // jsx
```
