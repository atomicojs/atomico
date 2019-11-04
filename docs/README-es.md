![Atomico](https://unpkg.com/atomico/docs/brand/logo-black.svg)

[![CircleCI](https://circleci.com/gh/atomicojs/atomico.svg?style=svg)](https://circleci.com/gh/atomicojs/atomico)
[![npm](https://badgen.net/npm/v/atomico)](http://npmjs.com/atomico)
[![gzip](https://badgen.net/bundlephobia/minzip/atomico)](https://bundlephobia.com/result?p=atomico)

Atomico es una pequeña libreria de 3kb para la creacion de interfaces a base de web-components, hooks, props y virtual-dom.

1. [Vision general](#vision-general)
2. [Instalacion](#instalacion)
3. [Creacion de la vista del web-component](#creacion-de-la-vista-del-web-component)
    1. [Jsx](#jsx)
    2. [Template string](#template-string)
    3. [Virtual-dom](#vitual-dom)
4. [Registro del web-component](#registro-del-web-component)
5. [Propiedades y atributos del web-component](#propiedades-y-atributos-del-web-component)
    1. [Props](#props)
    2. [Tipos](#tipos)
6. [Hooks](#hooks)
    1. [Guia de hooks](./hooks-es.md)
7. Ejemplos
    1. [Calculadora](https://webcomponents.dev/edit/emmJ9SYBiOJZhlNIYDJk)
    2. [Relog](https://webcomponents.dev/edit/iOhxFWq5JfiKRJChwb5v)

## Visión general

```jsx
import { h, customElement } from "atomico";

function MyTag({ value }) {
	return <host>Hi! {value}!</host>;
}

MyTag.props = {
	value: String
};

customElement("any-name", MyTag);
```

Donde

-   `h` es el pragma que construye el virtual-dom mediante JSX un compilador como bable.
-   `customElement`: función que registra el web-component en el navegador, ej `<any-name></any-name>`.
-   `MyTag`: función usada para representar el estado del DOM del web-component.
-   `MyTag.props` representa las props que construyen las propiedades y atributos que se encargan de comunicar el estado al web-component

## Instalación

```bash
npm install atomico
```

## Creacion de un web-component

La interfaz de un web-component se define en atomico gracias al virtual-dom, el que puede ser declarado mediante le uso de **Jsx**, **Template string** o un **Objeto declarativo**.

#### Jsx

```jsx
import { h } from "atomico";

function WebComponent() {
	return (
		<host>
			<button onclick={() => console.log("click")}>
				my web-component
			</button>
		</host>
	);
}
```

#### Template string

Gracias al [htm](https://github.com/developit/htm) ud podrá construir el virtual-dom usando la función `html` como enseña a continuación:

```js
import html from "atomico/html";

function MyTag() {
	return html`
		<host>
			<button onclick=${() => console.log("click")}>
				my web-component
			</button>
		</host>
	`;
}
```

#### Virtual dom

**El output ** del ejercicio anterior sea usando [Jsx](#jsx) o [Template string](#template-string) es equivalente a un **objeto declarativo** conocido como virtual-dom enseñado a continuación:

```js
function MyTag() {
	return {
		nodeType: "host",
		children: {
			nodeType: "button",
			onclick() {
				console.log("click");
			},
			children: "my web-component"
		}
	};
}
```

Atomico permite la manipulación del web-component, como parte del virtual-dom para esto ud debera hacer uso del tag `<host/>`, este permite declarar el estado del web-component como cualquier otro nodo, pudiendo modificar atributos, propiedades o asociar eventos ej:

```jsx
let styleSheet = `
	:host{
		display:flex;
		flex-flow:row wrap;
	}
	button{
		border:none;
	}
`;

function MyTag() {
	return (
		<host
			shadowDom
			styleSheet={styleSheet}
			onclick={() => console.log("click!")}
		>
			inside web-component
			<button>1</button>
			<button>2</button>
			<button>3</button>
		</host>
	);
}
```

Note que el uso del `shadowDom` debe ser declarado como parte del virtual-dom.

## Registro del web-component

```jsx
import { h, customElement } from "atomico";

function MyCustomButton() {
	return (
		<host>
			<button>🤓 my custom button</button>
		</host>
	);
}

customElement("my-custom-button", MyCustomButton);
```

Donde :

-   `h` es el pragma que genera el virtual-dom
-   `customElement` es la función que registra el web-component en el navegador, esta transforma la función a una clase capas de comunicarse con el HTMLELement.

Alternativamente ud puede exportar la clase para posterior mente definir el nombre de su web-component, ej:

```js
let HTMLWebComponent = customElement(WebComponent);

customElements.define("my-custom-name", HTMLWebComponent);
```

Donde :

-   `HTMLWebComponent` es la función WebComponent que ya extendió el HTMLElement, volviéndolo un constructor valido para ser declarado por `customElements.define`

## Propiedades y atributos del web-component

Es común comunicar al web-component estados de la interfaz mediante propiedades o atributos, ej:

```html
<!--case attributo-->
<web-component my-field="./my-source">
	<!--case property-->
	<script>
		document.querySelector("web-component").myField = "./my-source";
	</script>
</web-component>
```

La definición de propiedades o atributos en el web-component creado con atomico se logra mediante la propiedad `props` asociada a la función, ej:

```jsx
function WebComponent({ myField }) {
	return (
		<host>
			<h1>{myField}</h1>
		</host>
	);
}

WebComponents.props = {
	myField: {
		type: String,
		value: "hi!"
	}
};
```

### Props

Las props pueden ser configuraciones de simples a complejas, ej

**Configuración simple**

```jsx
WebComponents.props = {
	fieldObject: Object
};
```

**Configuración avanzada**

```jsx
WebComponents.props = {
	fieldObject: {
		type: Object,
		reflect: true,
		dispatchEvent: true,
		get value() {
			return { ...initialObject };
		}
	}
};
```

Donde :

-   `fieldObject.type` define el tipo de data a soportar por la propiedad o atributo
-   `fieldObject.reflect` permite reflejar el estado en el web-component como atributo.
-   `fieldObject.dispatchEvent` permite despachar un evento personalizado ante cada cambio asociado a la propiedad.
-   `fieldObject.value` es el valor que por defecto tomara la propiedad al inicializar.

#### Tipos de propiedades

Estos se declaran mediante el índice `type`.

| Tipo     | Descripción                                                                                          |
| -------- | ---------------------------------------------------------------------------------------------------- |
| String   | el tipo de prop debe ser un String                                                                   |
| Number   | el tipo de prop debe ser un Number                                                                   |
| Boolean  | el tipo de prop debe ser Boolean, se considera booleano valido `[1, 0, "true", "false",true,false]`. |
| Object   | el tipo de prop debe ser un Object, de ser un string aplicara JSON.parse para un análisis de tipo    |
| Array    | el tipo de prop debe ser un Array, de ser un string aplicara JSON.parse para un análisis de tipo     |
| Function | el tipo de prop debe ser una Function, de ser string obtendrá en la ejecucion la función global      |
| Date     | el tipo de prop debe ser una Date, de ser un string aplicara new Date para un análisis de tipo       |

> existen ciertos tipos que solo son soportados como propiedad y no como atributo siendo estos : `Promise`, `Symbol`o cualquier constructor global cuyo tipo se defina mediante `[Object <Type>]`

## Hooks

Los hooks potencial aun mas la creacion de web-components, pudiendo con esto crear estados y efectos que no se acoplan al contexto de las props, esto es de gran utilidad para la creacion de procesos personalizados reutilizables que no dependen del contexto del web-component.

En un ciclo regular cada vez que una propiedad asociada al web-components cambia, se genera una renderización del nuevo estado del DOM asociado al web-components, los hooks por ejemplo pueden forzar esta renderización sin la necesidad de pasar por la actualización de las props manteniendo estados locales, incluso pueden suscribirse al proceso de renderización, por ejemplo useEffect es ejecutado después de renderización de forma asíncrona, para ello lo invito a [ver la guia de hooks](./hooks-es.md)
