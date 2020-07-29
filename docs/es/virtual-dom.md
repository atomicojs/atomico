# Virtual-dom

Atomico posee un virtual-dom unico que puede ser construido usando JSX o template string. ejemplo:

### JSX

```jsx
import { h } from "atomico";
const MyComponent = () => <host>...</host>;
```

Donde :

​ `h` : Función pragma usada para la construcción del JSX por herramientas de compilación como Babel, Sucrace, Esbuild o Typescripyt

### Template string

```js
import html from "atomico/html";
const MyComponent = () => html`<host>...</host>`;
```

Donde :

​ `html` : Función que construye el virtual-dom sin la necesidad de compilación, **Esto es gracias a la librería htm**

**Ambos métodos para la creacion del virtual-dom son validos para atomico**, pero recuerde que el JSX ofrece autocompletado y mejor compresión de código.

## Regla de retorno.

**Todo webcomponent creado con Atomico siempre debera retornar la etiqueta especial `<host/>` ya que esta representa la existencia del webcomponent. Si ud no retorna esta etiqueta el webcomponent será desmontado.**

## Propiedades especiales

### shadowDom

```jsx
<host shadowDom />
```

propiedad que habilita el uso del shadowDom sobre el nodo que lo declare, el uso del shadowDom no es obligatorio en Atómico, pero es totalmente recomendable dado que encapsular el estilo y DOM.

**key**

```jsx
<host>
    <div key="1">item 1</div>
    <div key="2">item 2</div>
    <div key="3">item 3</div>
</host>
```

Propiedad que asocia el nodo a una llave como referencia, esta llave permite referenciar el nodo entre renderizaciones , permitiendo:

1. Optimiza la eliminación de nodos removiendo las referencias no usadas en la nueva lista.
2. Optimiza la inserción de nuevos nodos indiferente al orden de los nodos actuales.
3. conservación de estados de webcomponents indiferente al orden en que se presenten la nueva lista.

**Recuerde el uso de key obliga a que todos los nodos asociados al padre declare esta propiedad**

## Observaciones de renderización

```jsx
let Header = () => <header></header>;
// invalido
const MyComponent = () => (
    <host>
        <Header></Header>
    </host>
);
// Valido
const MyComponent = () => <host>{Header()}</host>;
```

Atomico no soporta la declaración de funciones como componente tipo virtual-dom, esta opción solo es valida para nodos tipo raw, ejemplo:

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
