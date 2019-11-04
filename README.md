![Atomico](https://unpkg.com/atomico/docs/brand/logo-black.svg)

[![CircleCI](https://circleci.com/gh/atomicojs/atomico.svg?style=svg)](https://circleci.com/gh/atomicojs/atomico)
[![npm](https://badgen.net/npm/v/atomico)](http://npmjs.com/atomico)
[![gzip](https://badgen.net/bundlephobia/minzip/atomico)](https://bundlephobia.com/result?p=atomico)

Atomico is a small 3kb library for creating interfaces based on web-components, hooks, props and virtual-dom.

If you want to try Atomico and you need help tell me in Twitter [Uppercod](https://twitter.com/uppercod)🤓.

[read in Spanish](./docs/README-es.md)

1. [Overview](#overview)
2. [Installation](#installation)
3. [Creating a web-component](#creating-a-web-component)
    1. [Jsx](#jsx)
    2. [Template string](#template-string)
    3. [Virtual-dom](#vitual-dom)
4. [Defining a web-component](#defining-a-web-component)
5. [Properties and attributes of the web-component](#properties-and-attributes-of-the-web-component)
    1. [Props](#props)
    2. [Types](#tipos)
6. [Hooks](#hooks)
    1. [Hook guide](./hooks.md)
7. Examples
    1. [Calculator](https://webcomponents.dev/edit/emmJ9SYBiOJZhlNIYDJk)
    2. [Watch](https://webcomponents.dev/edit/iOhxFWq5JfiKRJChwb5v)

## Overview

```jsx
import { h, customElement } from "atomico";

function WebComponent({ value }) {
	return <host>Hi! {value}!</host>;
}

WebComponent.props = {
	value: String
};

customElement("any-name", WebComponent);
```

Where:

-   `h`: pragma that builds virtual-dom using JSX using a compiler like babel.
-   `customElement`: function that registers the web component in the browser, eg `<any-name></any-name>`.
-   `WebComponent`: function used to represent the state of the web component's DOM.
-   `WebComponent.props`: represents the props that build the properties and attributes that are responsible for communicating the state to the web-component

## Installation

```bash
npm install atomico
```

## Creating a web-component

The interface of a web-component is defined in atomico thanks to the virtual-dom declared by using **Jsx**, **Template string** or a **Declarative object**.

#### Jsx

```jsx
import { h } from "atomico";

function WebComponent() {
	return (
		<host>
			<button onclick={() => console.log("click")}>
				my web-component
			</button>
		</host>
	);
}
```

#### Template string

Thanks to [htm](https://github.com/developit/htm) you can build the virtual-dom using the `html` function, eg:

```js
import html from "atomico/html";

function MyTag() {
	return html`
		<host>
			<button onclick=${() => console.log("click")}>
				my web-component
			</button>
		</host>
	`;
}
```

#### Virtual dom

**The output** of the previous exercise either using [Jsx](#jsx) or [Template string](#template-string) is equivalent to a **declarative object** known as virtual-dom, eg:

```js
function MyTag() {
	return {
		nodeType: "host",
		children: {
			nodeType: "button",
			onclick() {
				console.log("click");
			},
			children: "my web-component"
		}
	};
}
```

Atomico allows the manipulation of the web-component through the virtual-dom by declaring the tag `<host />`, eg:

```jsx
let styleSheet = `
	:host{
		display:flex;
		flex-flow:row wrap;
	}
	button{
		border:none;
	}
`;

function MyTag() {
	return (
		<host
			shadowDom
			styleSheet={styleSheet}
			onclick={() => console.log("click!")}
		>
			inside web-component
			<button>1</button>
			<button>2</button>
			<button>3</button>
		</host>
	);
}
```

The use of the shadowDom must be declared as part of the virtual-dom.

## Defining a web-component

```jsx
import { h, customElement } from "atomico";

function MyCustomButton() {
	return (
		<host>
			<button>🤓 my custom button</button>
		</host>
	);
}

customElement("my-custom-button", MyCustomButton);
```

Where :

-   `h`: pragma that generates the virtual-dom, for the jsx compiler
-   `customElement`: function that registers the web-component in the browser, this transforms the function to a class that extends HTMLElement

Alternatively you can export the class to later define the name of your web-component, eg:

```js
let HTMLWebComponent = customElement(WebComponent);

customElements.define("my-custom-name", HTMLWebComponent);
```

Where :

-   `HTMLWebComponent`: WebComponent function that already extended the HTMLElement, making it a valid constructor to be declared by `customElements.define`

## Properties and attributes of the web-component

The web-component reaction to external states, previously defined and accessible as properties or attributes, eg:

```html
<!--case attributo-->
<web-component my-field="./my-source">
	<!--case property-->
	<script>
		document.querySelector("web-component").myField = "./my-source";
	</script>
</web-component>
```

The definition of properties or attributes in the web-component created with atomico is through the `props` property associated with the function declared by the component, eg:

```jsx
function WebComponent({ myField }) {
	return (
		<host>
			<h1>{myField}</h1>
		</host>
	);
}

WebComponents.props = {
	myField: {
		type: String,
		value: "hi!"
	}
};
```

### Props

Props can be simple to complex configurations, eg

**Just declaring the type**

```jsx
WebComponents.props = {
	fieldObject: Object
};
```

**Type statement and additional behavior**

```jsx
WebComponents.props = {
	fieldObject: {
		type: Object,
		reflect: true,
		dispatchEvent: true,
		get value() {
			return { ...initialObject };
		}
	}
};
```

Where :

-   `fieldObject.type`: defines the type of data to be supported by the property or attribute.
-   `fieldObject.reflect`:it allows to reflect the state in the web-component as an attribute.
-   `fieldObject.dispatchEvent`: allows dispatching a custom event in each change associated with the property.
-   `fieldObject.value`:It is the value that the property will take by default when initializing.

#### Property types

These are declared by the index `type`.

| Type     | Description                                                                                              |
| -------- | -------------------------------------------------------------------------------------------------------- |
| String   | the type of prop must be a String                                                                        |
| Number   | the type of prop must be a Number                                                                        |
| Boolean  | the type of prop must be a Boolean, it is considered valid Boolean `[1, 0,"true","false", true, false]`. |
| Object   | the type of prop must be a Object, if it is a string, apply JSON.parse for a type analysis               |
| Array    | the type of prop must be a Array, if it is a string, apply JSON.parse for a type analysis                |
| Function | the type of prop must be a Function, if string you will get the global function in execution             |
| Date     | the type of prop must be a Date, if a string applies `new Date` for a type analysis                      |

> There are types that are only supported as property and not as an attribute being these: `Promise`,`Symbol` or any global constructor whose type is defined by `[Object <Type>]`

## Hooks

The potential hooks even more the creation of web-components, being able to create states and effects that do not fit the context of the props, this is very useful for the creation of reusable custom processes that do not depend on the context of the web-component .

In a regular cycle every time a property associated with the web-components changes, a rendering of the new state of the DOM associated with the web-components is generated, the hooks for example can force this rendering without the need to go through the update of the props maintaining local states, they can even subscribe to the rendering process, for example useEffect is executed after rendering asynchronously, for this I invite you to [see the hooks guide](./hooks.md)
