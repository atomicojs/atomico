# Introduction

Atomico is a small library of **3KB** for the creation of interfaces based on web-components only using functions, virtual-dom and hooks.

## Example of use in the browser

See example in [codepen](https://codepen.io/uppercod/pen/XLqyVO)

```js
import { customElement } from "https://unpkg.com/atomico";
import html from "https://unpkg.com/atomico/html";

function MyTag(props) {
	return html`
		<h1>
			Hi! ${props.value}
		</h1>
	`;
}

MyTag.props = {
	value: { type: String, value: "Atomico" }
};

customElement("my-tag", MyTag);
```

```html
<my-tag></my-tag>
<script type="module" src="./my-custom-tag.js"><script>
```

And that is Atomico Easy, don't we? Let's talk a little about what just happened.

-   `customElement`: function that transforms the functional component to a valid html element.
-   `html`: function that creates virtual-dom through template-string, this is thanks to library [htm](https://github.com/developit/htm)
-   `MyTag`: function that represents the state of the web component's DOM, every time the `MyTag.props.value` property changes, a new state of the DOM will be generated.
-   `MyTag.props`: object that declares the properties and attributes of the web-component. [prop guide](https://github.com/atomicojs/atomico#properties-and-attributes-of-the-web-component)

###### Adding super powers

## ShadowDom y StyleSheet

The **ShadowDom** is amazing, it allows you to encapsulate the css associated with the component, similar to the objective you try to make the css-in-js libraries, but native to the browser.

**StyleSheet** is an optimized way to declare the css in Atomic, it allows the use of [adoptedStyleSheets](https://developers.google.com/web/updates/2019/02/constructable-stylesheets) only if the browser it supports it, if it does not support it, the css will continue to work but using a `<style>` tag, if 😎 a pollyfill within 3kb of Atomico.

**To enable the use of shadowDom** you must use the `<host />` tag to represent the same web-component using the virtual-dom 👀.

Open example in [codepen](https://codepen.io/uppercod/pen/XWWqNgq)

```js
import { customElement } from "https://unpkg.com/atomico";
import html from "https://unpkg.com/atomico/html";

let stylesheet = `
	button {
		background: black;
		border-radius: 100px;
		color: white;
		padding: 0.6rem 1rem;
		text-transform: uppercase;
		border: none;

	}
`;

function CustomButton() {
	return html`
		<host shadowDom styleSheet=${stylesheet}>
			<button>my button global</button>
		</host>
	`;
}

customElement("custom-button", CustomButton);
```

Where :

-   `styleSheet` : CSS to be used by the component.
-   `CustomButton`: function that declares the `<host/>` tag, check use of the `shadowDom` and`styleSheet` properties on the `<host/>` tag.

**Is the shadowDom required in Atomico?**, no, but it is totally recommended if you want to maintain the integrity of the interface in a component.

this is only the beginning of Atomico, the [props](https://github.com/atomicojs/atomico/#properties-and-attributes-of-the-web-component) and [hooks](https://github.com/atomicojs/atomico/blob/master/docs/hooks.md) are the next level of learning recommended for you. Visit the [repository on github](https://github.com/atomicojs/atomico/) for more content.

#### Thanks for reading to the last line
