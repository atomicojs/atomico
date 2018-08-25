# Atomico

Atomico is a small experimental library, it has a very small implementation of **virtual-dom**, it uses **Jsx**, its life cycle is based on **CustomElements** and **CustomEvents**.

```js
import {h, Component, register} from "atomico";

register(
   "tag",
   class extends Component{
       static get props(){
           return ["title"]
       }
       // When the component is mounted on the Dom
       onMount(event){
          
       }
       // When the component is disassembled on the Dom
       onUnmount(event){

       }
       // When the component receives new properties from the Dom
       onUpdate(event){
          
       }
       render(){
           return <div>
               {this.props.title}
           </div>
       }
   }   
)
```

## Eventos

**Atomico** captures the events in the construction of the component, for it you must define them as methods of the prototype and before the name of the method the pattern `^/on[A-Z]/`, example **onMount**, **onClick** and **onMousemove**.

If you want to listen to events externally, just use `addEventListener(event,handler)` on the component.

## Lifecycle

The life cycle of **Atomico** is simple and has 3 states, all of them are dispatched as component events.

> Every event by default generates an update of the view, to avoid this update only use `event.preventDefault()`, this will prevent **Atomico** from updating the view.

### onMount( CustomEvent )

When the component is mounted in the document, the **mount** event is dispatched.

### onUnmount( CustomEvent )

When the component is removed from the document.

### onUpdate( CustomEvent )

When the component has attribute mutations. You can know these changes through the `event.detail` property.