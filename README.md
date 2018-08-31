# Atomico

Atomico is a small **experimental library**, has a very small implementation of **Virtual-dom**, uses **Jsx**, its life cycle is based on **Custom Elements** and **Custom Events**.

## Objective

Simplify the existing potential in Custom Elements, by using **JSX** with a minimum size.

```js
import {h, Element} from "atomico";

class Tag extends Element{
   static get props(){
       return ["name"];
   }
   // This event is executed when the component is added to the document.
   elementMount(){}
   // This event is executed when you delete the document component.
   elementUnmount(){}
   // This event is executed every time the component receives a new property.
   elementReceiveProps(){}
   // JSX
   render(){
       return <h1>hola</h1>;
   }
}
customElement.define("tag-atomico",Tag);
```

## Custom Events

The life cycle of the components created with Atomico is spread through Custom Events, the biggest advantage that this brings is that you can know and interact at all times with the life cycle of the component externally.

```js
let tag = document.createElement("tag-atomico");

tag.addEventListener("elementMount",()=>{
  
})
```

You can internally prevent the component from executing the **setState** function that updates the view, this is achieved through the `preventDefault()` function associated with the event.

## Lifecycle

Atomico's life cycle consists of component creation, component elimination and component mutation.

| Method | Argument | Description |
|:-------|:---------|:------------|
|elementMount| event:CustomEvent| It is executed when the component is added to the document |
|elementUnmount| event:CustomEvent | Executed when the component is removed from the document |
|elementReceiveProps| event:CustomEvent | Executed when the component receives a new property |


## JSX

it is based on the definition of type, for example if an attribute is a function it will be registered as an event, in the opposite case as an attribute.

```js
import {h, Element} from "atomico";

export default class extends Element{
   render(){
       return <button class="my-class" click={(event)=>console.log(event)}>
           hello ${this.state.title || "world"}
       </button>
   }
}
```

## Shadow-dom

Atomico is already prepared to work with the **shadow-dom**, for it just initialize in the constructor the component method `this.attachShadow({mode:"open"})`.

```js
import {h, Element} from "atomico";

export default class extends Element{
   constructor(){
       this.attachShadow({mode:"open"});
   }
   render(){
       return [
           <style>{`
               button{
                   background : transparent;
                   border:none;
               }
           `}</style>,
           <button class="my-class">
               hello ${this.state.title || "world"}
           </button>
       ]
   }
}
```

> Note that you can also return an array from render.