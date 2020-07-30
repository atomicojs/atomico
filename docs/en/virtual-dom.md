[home](../../README.md)/**virtual-dom**

# Virtual-dom

Atomico has a unique virtual-dom that can be built using JSX or template string.

**Links:**

1. [JSX](#JSX)
2. [Template string](#template-string)
3. [Return rule](#return-rule)
4. [Special properties](#special-properties)

## JSX

```jsx
import { h } from "atomico";
const MyComponent = () => <host>...</host>;
```

Where:

​ `h` : Pragma function for JSX construction by compilation tools like Babel, Sucrace, Esbuild or Typescripyt

## Template string

```js
import html from "atomico/html";
const MyComponent = () => html`<host>...</host>`;
```

Where:

​ `html` : Function that builds the virtual-dom without the need for compilation, **This is thanks to the [htm](https://github.com/developit/htm) library**

## Return rule

**All webcomponent created with Atomic must always return the special tag `<host />` since this represents the existence of the webcomponent. If you don't return this tag the webcomponent will be unmounted.**

## Special properties

### shadowDom

```jsx
<host shadowDom />
```

property that enables the use of shadow Dom on the node that declares it, the use of shadowDom is not mandatory in Atomico, but it is totally recommended since it encapsulate the style and DOM.

**key**

```jsx
<host>
    <div key="1">item 1</div>
    <div key="2">item 2</div>
    <div key="3">item 3</div>
</host>
```

Property that associates the node with a key as a reference, this key allows referencing the node between renderings, allowing:

1. Optimize node removal by removing unused references in the new list.
2. Optimizes the insertion of new nodes regardless of the order of the current nodes.
3. preservation of webcomponent states regardless of the order in which the new list is presented.

**Remember the use of key forces all nodes associated with the parent to declare this property**

## rendering observations

```jsx
let Header = () => <header></header>;
// invalid
const MyComponent = () => (
    <host>
        <Header></Header>
    </host>
);
// Valid
const MyComponent = () => <host>{Header()}</host>;
```

Atomico does not support declaring functions as a virtual-dom type component, this option is only valid for raw type nodes, example:

```jsx
const MyComponent = () => {
    let Img = new Image();
    return (
        <host>
            <Img src="./image.jpg"></Img>
        </host>
    );
};
```
