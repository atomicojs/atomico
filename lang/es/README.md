# Atomico

<img src="../../brand/logo.svg" width="220px"/>
<br/>
<br/>
Atomico es una pequeña librería experimental, que permite simplificar la creación de componentes a base de las siguientes características.

- Web components [🔗](https://www.webcomponents.org/introduction) 
- Custom Events [🔗](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events)
- Virtual dom [🔗](https://reactjs.org/docs/faq-internals.html)
- Jsx [🔗](https://reactjs.org/docs/introducing-jsx.html)

## Objetivo

Simplificar el potencial ya existente en los web components, mediante el uso de **JSX** con un tamaño mínimo.

## Ejemplo de componente

`{h, Element}` son las únicas variables locales existentes por defecto la librería, entienda que `{h}` es necesario para la declaración del JSX pragma.

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

## Ciclo de vida

El ciclo de vida de Atomico se compone de creación de componente, eliminación de componente y mutación de componente.

| Método              | Argumento         | Descripción                                                |
| ------------------- | ----------------- | ---------------------------------------------------------- |
| elementMount        | event:CustomEvent | Se ejecuta cuando el componente se añade al documento      |
| elementUnmount      | event:CustomEvent | Se ejecuta cuando el componente se elimina del documento   |
| elementReceiveProps | event:CustomEvent | Se ejecuta cuando el componente recibe una nueva propiedad |

### Event.preventDefault

Por defecto después de ejecutar cada método del ciclo de vida atomico renderiza la vista, ud puede evitar esto mediante el uso de `preventDefault()`, asociado al evento `elementMount ` y  `elementReceiveProps`.

## JSX

El Jsx de Atomico se basa en la definición de tipo, por ejemplo si un atributo es una función esta será registrada como evento, en el caso contrario como atributo.

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

Atomico también logra comunicarse el documento, sea por ejemplo en este caso

```html
<tag-atomico>
  hello!
</tag-atomico>
```

> note que dentro del tag atomico se define la palabra `hello!`, ud puede importar estos nodos directamente de `this.props.children`, el algoritmo de diff tolera nodos reales.

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

Por defecto `this.props.children`, puede poseer nodos reales importados desde documento, estos solo se importan al momento de la construcción del componente.

## Slot

ud puede usar el tag slot para importar un nodo ya existente en el documento dentro del componente

```javascript
<tag-atomico>
  <button slot="button-1">😃</button>
  <button slot="button-2">😎</button>
</tag-atomico>
```

Mediante el uso del tag `<slot name="<slot>"/>`, ud podrá importar de forma guiada nodos del documento, estos son almacenados en la propiedad slots del componente.

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

Note que ud puede interactuar con el tag `<slot/>`, añadiendo atributos adicionales, estos serán comunicados al nodo mediante el proceso de diff

`<slot/>`solo funciona cuando hay comunicación entre documento y componente,  no aplica entre componente y componente, ya que en este tipo de comunicación el componente receptor recibe el los hijos directamente.

## Propiedades del componente

Si ud desea escuchar la mutación de atributos asociados al componente deberá retornar mediante la definición `static get props` un arreglo con las propiedades a escuchar.

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

Cada vez que mute title, se ejecutará el método del ciclo de vida `elementReceiveProps`

## Shadow-dom

Atomico ya esta preparado para trabajar con el **shadow-dom**, para ello solo initialize en el constructor el método del componente `this.attachShadow({mode:"open"})`.

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

la mayor ventaja que le trae el uso del shadow-dom es la capacidad de aislar el estilo dentro del mismo componente.# Atomico

Atomico es una pequeña librería experimental, que permite simplificar la creación de componentes a base de las siguientes características.

- Web components [🔗](https://www.webcomponents.org/introduction) 
- Custom Events [🔗](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events)

* Virtual dom [🔗](https://reactjs.org/docs/faq-internals.html)
* Jsx [🔗](https://reactjs.org/docs/introducing-jsx.html)

## Objetivo

Simplificar el potencial ya existente en los web components, mediante el uso de **JSX** con un tamaño mínimo.

## Ejemplo de componente

`{h, Element}` son las únicas variables locales existentes por defecto la librería, entienda que `{h}` es necesario para la declaración del JSX pragma.

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

## Ciclo de vida

El ciclo de vida de Atomico se compone de creación de componente, eliminación de componente y mutación de componente.

| Método              | Argumento         | Descripción                                                |
| ------------------- | ----------------- | ---------------------------------------------------------- |
| elementMount        | event:CustomEvent | Se ejecuta cuando el componente se añade al documento      |
| elementUnmount      | event:CustomEvent | Se ejecuta cuando el componente se elimina del documento   |
| elementReceiveProps | event:CustomEvent | Se ejecuta cuando el componente recibe una nueva propiedad |

### Event.preventDefault

Por defecto después de ejecutar cada método del ciclo de vida atomico renderiza la vista, ud puede evitar esto mediante el uso de `preventDefault()`, asociado al evento `elementMount ` y  `elementReceiveProps`.

## JSX

El Jsx de Atomico se basa en la definición de tipo, por ejemplo si un atributo es una función esta será registrada como evento, en el caso contrario como atributo.

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

Atomico también logra comunicarse el documento, sea por ejemplo en este caso

```html
<tag-atomico>
  hello!
</tag-atomico>
```

> note que dentro del tag atomico se define la palabra `hello!`, ud puede importar estos nodos directamente de `this.props.children`, el algoritmo de diff tolera nodos reales.

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

Por defecto `this.props.children`, puede poseer nodos reales importados desde documento, estos solo se importan al momento de la construcción del componente.

## Slot

ud puede usar el tag slot para importar un nodo ya existente en el documento dentro del componente

```javascript
<tag-atomico>
  <button slot="button-1">😃</button>
  <button slot="button-2">😎</button>
</tag-atomico>
```

Mediante el uso del tag `<slot name="<slot>"/>`, ud podrá importar de forma guiada nodos del documento, estos son almacenados en la propiedad slots del componente.

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

Note que ud puede interactuar con el tag `<slot/>`, añadiendo atributos adicionales, estos serán comunicados al nodo mediante el proceso de diff

`<slot/>`solo funciona cuando hay comunicación entre documento y componente,  no aplica entre componente y componente, ya que en este tipo de comunicación el componente receptor recibe el los hijos directamente.

## Propiedades del componente

Si ud desea escuchar la mutación de atributos asociados al componente deberá retornar mediante la definición `static get props` un arreglo con las propiedades a escuchar.

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

Cada vez que mute title, se ejecutará el método del ciclo de vida `elementReceiveProps`

## Shadow-dom

Atomico ya esta preparado para trabajar con el **shadow-dom**, para ello solo initialize en el constructor el método del componente `this.attachShadow({mode:"open"})`.

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

la mayor ventaja que le trae el uso del shadow-dom es la capacidad de aislar el estilo dentro del mismo componente.