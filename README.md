<img src="brand/logo.png" width="280px"/>
<br/>
Atomico is a small experimental library, which allows to simplify the creation of components based on the following features.

- Web components [🔗](https://www.webcomponents.org/introduction) 
- Custom Events [🔗](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events)
- Virtual dom [🔗](https://reactjs.org/docs/faq-internals.html)
- Jsx [🔗](https://reactjs.org/docs/introducing-jsx.html)

## Objective

Simplify the existing potential in web components, by using **JSX** and **Virtual dom** with a minimum size.

## Component example

`{h, Element}` are the only local variables existing by default the library, understand that `{h}` is necessary for the declaration of the JSX pragma.

```js
import {h, Element} from "atomico";

class Tag extends Element{
  static get props(){
      return ["name"];
  }
  // This event is executed when the component is added to the document.
  elementMount(){}
  // This event is executed when you delete the document component
  elementUnmount(){}
  // This event is executed every time the component receives a new property
  elementReceiveProps(){}
  // JSX
  render(){
      return <h1>hola</h1>;
  }
}
customElement.define("tag-atomico",Tag);
```

## Lifecycle

Atomico's life cycle consists of component creation, component elimination and component mutation.

| Method              | Argument         | Description                                                |
| ------------------- | ----------------- | ---------------------------------------------------------- |
| elementMount        | event:CustomEvent | This event is executed when the component is added to the document  |
| elementUnmount      | This event is executed when you delete the document component  |
| elementReceiveProps | event:CustomEvent | This event is executed every time the component receives a new property |

### Event.preventDefault

By default after executing each method of the Atomico life cycle renders the view, you can avoid this by using `preventDefault()`, associated with the `elementMount` event and `elementReceiveProps`.

## JSX

This is based on the definition of type, for example if an attribute is a function it will be registered as an event, in the opposite case as an attribute.

```javascript
import {h, Element} from "atomico";

export default class extends Element{
 render(){
     return <button class="my-class" click={(event)=>console.log(event)}>
         hello ${this.state.title || "world"}
     </button>
 }
}
```

Atomico also manages to communicate the document, for example in this case:

```html
<tag-atomico>
  hello!
</tag-atomico>
```

> note that within the atomic tag the word `hello!` is defined, you can import these nodes directly from `this.props.children`, the diff algorithm tolerates real nodes.

```javascript
import {h, Element} from "atomico";

export default class extends Element{
 render(){
     return <button>
         {this.props.children}
     </button>
 }
}
```

By default `this.props.children`, you can have real nodes imported from document, these are only imported at the time of component construction.

## Slot

You can use the slot tag to import an existing node in the document within the component.

```javascript
<tag-atomico>
  <button slot="button-1">😃</button>
  <button slot="button-2">😎</button>
</tag-atomico>
```

By using the `<slot name="<slot>"/>` tag, you can import guided nodes of the document, these are stored in the property `slots` of the component.

```javascript
import { h, Element } from "atomico";

export default class extends Element {
  render() {
      return (
          <div>
              <div>
                  <slot name="button-1" />
              </div>
              <div>
                  <slot
                      name="button-2"
                      click={() => {
                          console.log("click [slot=button-2]");
                      }}
                  />
              </div>
          </div>
      );
  }
}

```

Note that you can interact with the `<slot/>` tag, adding additional attributes, these will be communicated to the node through the diff process

`<slot/>` only works when there is communication between document and component, it does not apply between component and component, since in this type of communication the receiving component receives the children directly.

## Properties of the component

If you want to hear the mutation of properties associated with the component, you must return with the definition `static get props` an array with the properties to listen to.

```javascript
import { h, Element } from "atomico";

export default class extends Element {
  static get props() {
      return ["title"];
  }
  render() {
      return <h1>{this.props.title}</h1>;
  }
}

```

Each time you change the `title` property, externally, the lifecycle method `elementReceiveProps` will be executed.

## Shadow-dom

Atomico is already prepared to work with the **shadow-dom**, for it just initialize in the constructor the component method `this.attachShadow({mode:"open"})`.

```js
import {h, Element} from "atomico";

export default class extends Element{
  constructor(){
      this.attachShadow({mode:"open"});
  }
  render(){
       return <button class="my-class">
           <style>{`button{ background : transparent; border:none;}`}</style>
           hello ${this.state.title || "world"}
       </button>
  }
}
```

The biggest advantage of using shadow-dom is the ability to isolate the style within the same component.

## Resources

I would be very grateful if you experiment with Atomico, for this I recommend starting with:

### atomico-starter-component

This repo, offers everything to generate distributable components per npm, thanks to **rollup**, the component generated as an example weighs only **600B**.
[Github atomic-starter-component](https://github.com/UpperCod/atomico-starter-component) and [component preview](https://uppercod.github.io/atomico-starter-component/).

Ud puede consumir este componente solo importando como base Atomico y luego componente.

```html
<script src="https://unpkg.com/atomico@0.0.5/dist/atomico.umd.js"></script>
<script src="https://unpkg.com/atomico-starter-component@0.0.0/dist/atomico-starter-component.umd.js"></script>

<atomico-starter-component></atomico-starter-component>
```