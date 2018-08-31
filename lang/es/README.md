# Atomico

Atomico es una pequeña **librería experimental**, posee una muy pequeña implementación del **Virtual-dom**, utiliza **Jsx**, su ciclo de vida se basa en **Custom Elements** y **Custom Events**.

## Objetivo

Simplificar el potencial ya existente en los Custom Elements, mediante el uso de **JSX** con un tamaño mínimo.

```js
import {h, Element} from "atomico";

class Tag extends Element{
   static get props(){
       return ["name"];
   }
   // Este evento se ejecuta al agregar el componente al documento.
   elementMount(){}
   // Este evento se ejecuta al eliminar el componente del documento
   elementUnmount(){}
   // Este evento se ejecuta cada vez que el componente recibe una nueva propiedad
   elementReceiveProps(){}
   // JSX
   render(){
       return <h1>hola</h1>;
   }
}
customElement.define("tag-atomico",Tag);
```

## Custom Events

El ciclo de vida de los componentes creados con Atomico se propaga por medio de Custom Events, la mayor ventaja que trae esto es que ud puede conocer e interactuar en todo momento con el ciclo de vida del componente de forma externa.

```js
let tag = document.createElement("tag-atomico");

tag.addEventListener("elementMount",()=>{
  
})
```

Ud puede prevenir de forma interna que el componente ejecute la función **setState** que actualiza la vista, esto se logra mediante la función `preventDefault()` asociada al evento.

## Ciclo de vida

El ciclo de vida de Atomico se compone de creación de componente, eliminación de componente y mutación de componente.

|Metodo|Argument|Descripción|
|:-----|:-------|:----------|
|elementMount| event:CustomEvent| Se ejecuta cuando el componente se añade al documento |
|elementUnmount| event:CustomEvent | Se ejecuta cuando el componente se elimina del documento |
|elementReceiveProps| event:CustomEvent | Se ejecuta cuando el componente recibe una nueva propiedad |


## JSX

El Jsx de Atomico se basa en la definición de tipo, por ejemplo si un atributo es una función esta será registrada como evento, en el caso contrario como atributo.

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

Atomico ya esta preparado para trabajar con el **shadow-dom**, para ello solo initialize en el constructor el método del componente `this.attachShadow({mode:"open"})`.

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

> Note que ud también puede retornar un arreglo desde render.