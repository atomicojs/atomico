<img src="brand/logo.png" width="280px"/>
<br/>

This small library allows you to create distributable web-components in any environment that supports:

1. [**Classes**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)
2. [**Custom Elements**](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements)
3. [**Custom Events**](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events)

## First steps

If you want to achieve a highly distributable component, you invited him to experiment installing [**cli-bone**](https://github.com/uppercod/cli-bone).

### 0. Installation

**Cli-bone**, i developed it with the purpose of downloading GIT repositories as templates, Bone is responsible for replacing folder names and files.

```bash
## fist install cli-bone
npm install -g cli-bone
## run command
bone uppercod/atomico.template
```

Thanks to the use **Atomico** and [**Rollup**](https://rollupjs.org/guide/en), you can package your component and then be shared for example in **Github**, **Npm** or [**unpkg.com**](https://unpkg.com).

### 1. Creating our first component

```javascript
import { h, Element } from "atomico";
customElements.define(
   "atom-hello",
   class extends Element {
       static get props() {
           return ["text"];
       }
       render() {
           return <h1>hello {this.props.text}</h1>;
       }
   }
);

```

### 2. Adding style to our first component

The use of the [Shadow Dom](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM) is optional, but in this example we will use Shadow Dom directly, in order to encapsulate the context of the style within the component. You should only define `this.attachShadow({mode:"open"})` in the constructor.

```javascript
import { h, Element } from "atomico";
customElements.define(
   "atom-hello",
   class extends Element {
       constructor() {
           this.attachShadow({ mode: "open" });
       }
       static get props() {
           return ["text"];
       }
       styled() {
           return `
               h1{
                   font-size : 30px;
               }
           `;
       }
       render() {
           return <h1>
               <style>{this.styled()}</style>
               hello {this.props.text}
           </h1>;
       }
   }
);
```

### 3. Visualizar el componente

You can see your imported component as a script, to visualize its behavior.

```html
<body>
   <!--component-->
   <atom-hello></atom-hello>
   <!--init:require-->
   <script src="https://unpkg.com/atomico@0.3.4/dist/atomico.umd.js"></script>
   <script src="dist/atom-hello.umd.js"></script>
   <!--end:require-->
</body>
```

## Lifecycle

Atomico's life cycle consists of component construction, component mounted, property update, component rendering and elimination.

| Method              | Argument         | Description                                                  |
| ------------------- | ----------------- | ------------------------------------------------------------ |
| Constructor         | Constructor       | It is executed when creating the component, it is recommended to define all the properties to use within the constructor |
| elementMount        | -- | It is executed when the component has been added to the document and has made its first render |
| elementUpdate       | -- | It is executed once the render function has been launched by setState, it ignores the first render since it is received by elementMount |
| elementUnmount      | -- | It is executed when the component has already been removed from the document |
| elementReceiveProps | props, changes | Run when the component updates the properties associated with `this.props` |


### Observation element Receive Props

This function receives 2 arguments:
1. props : new property to share within the component.
2. changes : list of properties that have changed at the time of `this.setProps` execution.

> You can return `false`, to avoid the update caused by the new properties.

## JSX

The Atomico Jsx is based on the definition of type, for example if an attribute is a function it will be registered as an event, in the opposite case as an attribute.

```javascript
import { h, Element } from "atomico";

export default class extends Element {
   render() {
       return <button class="my-class" click={event => console.log(event)}>
           hello ${this.state.title || "world"}
       </button>;
   }
}

```

## Communication between web-components and document

Atomico gives you various ways to communicate the web-component with the document, for example by using:

### children

The Atomico diff algorithm tolerates working with real nodes, so for example you can use the `childNodes` using` this.props.children`.

```html
<atom-hello>
   <span>😃</span>
</atom-hello>
```

Example of using `this.props.children` within render.

```javascript
render(){
   return <div>{this.props.children}</div>
}
```

> These children are not clones, they are direct instances, if you want to repeat a node extracted from the document you should use `cloneNode` on the node.

### Slot

This is a virtual tag capable of importing a node from `this.slots`

```html
<atom-hello>
   <span slot="emoji">😃</span>
</atom-hello>
```

These nodes are only imported at the time of mount of the component

```javascript
render(){
   return <div><slot name="emoji"/></div>
}
```

> These children are not clones, they are direct instances, if you want to repeat a node extracted from the document you should use `cloneNode` on the node.

### setAttribute

If you have used `static get props` for the definition of the properties associated with the component. changes the behavior of this function to benefit the component.

```javascript
import { h, Element } from "atomico";
customElements.define(
   "atom-hello",
   class extends Element {
       static get props() {
           return ["click"];
       }
       render() {
           return <button click={() => {
                   this.props.click();
               }}>
               hello
           </button>;
       }
   }
);
```

This behavior only works within Atomico

```javascript
let tag = document.querySelector("atom-hello");

   tag.setAttribute("click",()=>{
       console.log("ok!")
   })
```

The objective of this behavior is to allow a more efficient communication between the definition of properties and the web-component, for example if you call the component from reactive, preact or you can communicate to the component values in raw, example objects, booleans, numbers or functions.


## Observing the addEventListener method

This method is optimized, to eliminate all the listeners associated with the component once the component has been removed from the document.

## Examples

| Title | link | 
|-------|------|
| atomico-todo | [github](https://github.com/uppercod/atomico-todo)|
| atom-google-map | [github](https://github.com/atomicojs/atom-google-map)|