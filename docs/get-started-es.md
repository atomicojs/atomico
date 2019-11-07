# Introducción

Atomico es una pequeña libreria de **3KB** para la creacion de interfaces a base de web-components solo usando funciones, virtual-dom y hooks.

## Ejemplo de uso en el navegador

Ver ejemplo en [codepen](https://codepen.io/uppercod/pen/XLqyVO)

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

Y eso es Atomico ¿Fasil no 🤓?, detallemos un poco lo que sucede arriba:

-   `customElement`: función que transforma el componente funcional a un elemento html valido.
-   `html`: función que mediante template-string crea el virtual-dom, esto es gracias a librería [htm](https://github.com/developit/htm)
-   `MyTag`: función que representa el estado del DOM del web-component, cada vez que la propiedad `MyTag.props.value` cambie se generara un nuevo estado del DOM.
-   `MyTag.props`: objeto que declara las propiedades y atributos del web-component. [guia de props](props.md)

###### Complicando un poco las cosas

## ShadowDom y StyleSheet

El **ShadowDom** es asombroso, permite encapsular el css asociado al componente, en resumen lo mismo que intenta hacer las librerías css-in-js, pero nativo en el navegador.

**StyleSheet** es una forma optimizada de declarar el css en Atomico, permite el uso de [adoptedStyleSheets](https://developers.google.com/web/updates/2019/02/constructable-stylesheets) solo si el navegador lo soporta, de no soportarlo el css seguirá funcionando pero mediante un tag `<style>`, Si 😎 un pollyfill dentro de los 3kb de Atomico.

**Para habilitar el uso del shadowDom** debe usar el tag `<host/>` para representar el mismo web-component mediante el virtual-dom.

Abrir ejemplo en [codepen](https://codepen.io/uppercod/pen/XWWqNgq)

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

Donde :

-   `styleSheet` : CSS a usar por el componente.
-   `CustomButton`: función que declara el tag <host/>, note el uso de las propiedades `shadowDom` y `styleSheet` sobre le tag `<host/>` .

**¿Es obligatorio el shadowDom en Atomico?**, no pero es totalmente recomendado si se busca mantener la integridad de la interfaz en un componente

Lo enseñado es solo el comienzo de Atomico, las [props](https://github.com/atomicojs/atomico/blob/master/docs/README-es.md#propiedades-y-atributos-del-web-component) y [hooks](https://github.com/atomicojs/atomico/blob/master/docs/hooks-es.md) son el siguiente nivel de aprendizaje recomendado para ud. Visite el [repositorio en github](https://github.com/atomicojs/atomico/blob/master/docs/README-es.md) para mas contenido.

#### Gracias por leer hasta la ultima línea
