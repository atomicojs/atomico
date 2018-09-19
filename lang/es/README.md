<img src="../../brand/logo.png" width="280px"/>
<br/>
Esta pequeña librería le permite crear web-components distribuibles en cualquier entorno que soporte [Classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes), [Custom Elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) y [Custom Events](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events).


## Primeros pasos

Si quiere lograr un componente altamente distribuible lo invitó a experimentar clonando el siguiente repositorio[UpperCod/atomico-starter-component](https://github.com/UpperCod/atomico-starter-component)

Gracias al uso  **Atomico** y **Rollup**, se podra empaquetar su componente para luego ser compartido por ejemplo en **Github**, **Npm** o [**unpkg.com**](https://unpkg.com)

### 1. Creando nuestro primer componente

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

### 2. Añadiendo estilo a nuestro primer componente

El uso del [Shadow Dom](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM) es opcional,  pero en este ejemplo usaremos directamente Shadow Dom, para lograr encapsular el contexto del estilo dentro del  componente. ud solo deberá definir `this.attachShadow({ mode: "open" })`en el constructor.

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

Ud puede ver su componente importado como script, para visualizar su comportamiento.

```html
<body>
   <!--component-->
   <atom-hello></atom-hello>
   <!--init:require-->
   <script src="https://unpkg.com/atomico@0.1.1/dist/atomico.umd.js"></script>
   <script src="dist/atom-hello.umd.js"></script>
   <!--end:require-->
</body>
```

## Ciclo de vida

El ciclo de vida de Atomico se compone de construcción de componente, montaje del componente, actualización de propiedades, renderización y eliminación de componente.

| Método              | Argumento         | Descripción                                                  |
| ------------------- | ----------------- | ------------------------------------------------------------ |
| Constructor         | Constructor       | Se ejecuta al momento de crear el componente, se recomienda definir todas las propiedades a utilizar dentro del constructor |
| elementMount        | event:CustomEvent | Se ejecuta cuando el componente se ha añadido al documento y ha realizado su primer render. |
| elementUpdate       | event:CustomEvent | Se ejecuta una vez lanzada la función render por setState, este ignora el primer render ya que este es recivido por elementMount. |
| elementUnmount      | event:CustomEvent | Se ejecuta cuando el componente ya sea ha elimina del documento |
| elementReceiveProps | event:CustomEvent | Se ejecuta cuando el componente actulizara las propiedades asociadas a `this.props` |


### Observación elementReceiveProps
Por defecto cada vez que se ejecuta este event atomico renderiza la vista, ud puede evitar esto mediante el uso de `event.preventDefault()`, a su vez la propiedad detail dentro del evento entrega las nuevas props para el componente.
## JSX

El Jsx de Atomico se basa en la definición de tipo, por ejemplo si un atributo es una función esta será registrada como evento, en el caso contrario como atributo.

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

## Comunicación entre web-components y documento

Atomico le entrega diversas formas de comunicar el web-component con el documento, sea por ejemplo mediante el uso de :

### children

El algoritmo de diff de atomico tolera el trabajo con nodos reales, por lo que  ud por ejemplo ud podrá hacer uso de los `childNodes` mediante `this.props.children`.

```html
<atom-hello>
   <span>😃</span>
</atom-hello>
```
Uso de `this.props.children` dentro de render.
```javascript
render(){
   return <div>{this.props.children}</div>
}
```

> Estos nodos no son clones, son instancias directas, si ud busca repetir un nodo extraído desde el documento deberá usar cloneNode sobre el nodo.

### Slot

Esta es una etiqueta virtual capaz de importar un nodo desde `this.slots`

```html
<atom-hello>
   <span slot="emoji">😃</span>
</atom-hello>
```

Estos nodos solo son importados al momento del montaje del componente

```javascript
render(){
   return <div><slot name="emoji"/></div>
}
```

>  Estos nodos no son clones, son instancias directas, si ud busca repetir un nodo extraído desde el documento debera usar cloneNode sobre el nodo.

### setAttribute

Si ud ha utilizado `static get props` para la definición de las propiedades asociadas al componente. cambia el comportamiento de esta función a beneficio del componente.

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

Este comportamiento solo funciona dentro de Atomico

```javascript
let tag = document.querySelector("atom-hello");

   tag.setAttribute("click",()=>{
       console.log("ok!")
   })
```

El objetivo de este comportamiento es permitir una comunicación más eficiente entre la definición de propiedades y el web-component, por ejemplo si ud  llama el componente desde react, preact o vue podrá comunicarle al componente valores en raw, ejemplo objetos, booleanos, números o funciones.

>  Se advierte que si el componente se carga antes que la carga del documento, sea por ejemplo insertar el script que crea el componente en el head  permitirá una renderizacion pero no poseerá acceso a los nodos asociados a los impreso dentro del documento, por lo que ud no podrá usar `{this.props.children}` o `<slot name="sample"/>`. 

## Observación del método addEventListener

Este método está optimizado, para eliminar todos los listeners asociados al componente una vez que el componente se ha desmontado del documento.

## Ejemplos

| Titulo | link | 
|-------|------|
| atomico-todo | [github](https://github.com/uppercod/atomico-todo)|
| atom-google-map | [github](https://github.com/atomicojs/atom-google-map)|