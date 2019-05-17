# @atomico/core

<center><img src="../../assets/header.png" width="100%"/></center>

[![CircleCI](https://circleci.com/gh/atomicojs/core.svg?style=svg)](https://circleci.com/gh/atomicojs/core)
[![npm](https://badgen.net/npm/v/@atomico/core)](http://npmjs.com/@atomico/core)
[![gzip](https://badgen.net/bundlephobia/minzip/@atomico/core)](https://bundlephobia.com/result?p=@atomico/core)

Es una pequeña librería basada en el api de React, pero con un tamaño tan pequeño como Preact, centrada en dar cobertura a componentes como funciones, HoCs, hooks y web-components.

[![Example](../../assets/example.png)](https://codesandbox.io/s/webcomponentexample-np89o)

1. [Instalación](#instalacion)
2. [Componentes y web-components](#componentes-y-web-components)
3. [Componentes](#componentes)
4. [Web-components](#web-components)
   1. [Regla de retorno](#regla-de-retorno)
   2. [Web-component como funcion](#web-component-como-funcion)
   3. [Web-component como clase](#web-component-como-clase)
5. [Api homologada de React](#api-homologada-de-react)
   1. [useState](#usestate)
   2. [useEffect](#useeffect)
   3. [useReducer](#usereducer)
   4. [useMemo](#usememo)
   5. [useRef](#usememo)
6. [Hooks para web-components]
   1. [useHost](#usehost)
7. [Beneficios de Atomico](#beneficios-de-atomico)
8. Ejemplos
   1. [Atomico + Web-componets + PWA](https://atomicojs.github.io/examples/atomico-store/public/)

## Instalacion

```bash
# run
npm init @atomico

? Project Type # You must select a type of project
1. Create Aplication # allows the development of apps, with support of:
				   # dynamic modules, Typescript,
				   # WebComponents, PWA and Karma.
2. Create web-component # Create a WebComponent to be shared by NPM, with support of:
					  # dynamic modules, Typescript,
					  # WebComponents, PWA and Karma.
3. Exit # Escape the CLI
```

## Componentes y Web-components

Atomico permite un componentes y web-components de forma mixta, solo usando funciones, las algunas pequeñas diferencias, por ejemplo si ud declara web-componentes, este simpre debera retornar el tag `<host/>`

### ¿Por que mixto?

Los componentes como funciones, pueden gestionar DOM o logica vs el web-components que explisitamente debe reprecentar DOM.

El mayor beneficio de este es que ud podrá aplicar componentes de alto orden(HoCs) para construir estructuras complejas de lógica reutilizable invisibles para el DOM, como enrutadores o mas.

## Componentes

Los componentes que representan DOM o logica, ud puede hacer uso de los hooks para el control de efectos, como actualizaciones, esperas asíncronas o mas.

```jsx
function Emoji({ children }) {
	let [show, setState] = useState(0);
	return (
		<div>
			<button onClick={() => setState(!show)}>toggle</button>
			{show && "😃"}
		</div>
	);
}
```

[🔗 link ejemplo](https://codesandbox.io/s/usestate-pon5o)

## Web components

Atomico provee un entorno mixto de sistema de componentes funcionales y declaraciones de estos como web-components, con la intención de proveer una lógica mas escalable al momento construir aplicaciones.

### Regla de retorno

Todo **web-components** declarado debe siempre retornar el tag `<host/>`, esta retorno debe respetarse incluso si ud aplica componentes de alto orden.

### Web-component como funcion

Este enfoque permite simplificar la escritura del web-component.

```jsx
import { useEffect } from "@atomico/core";
import { h, customElement } from "@atomico/element";

function MyWebComponent(props) {
	useEffect(() => console.log("mounted"));
	return (
		<host shadowDom>
			<h1>{props.title}</h1>
			<slot />
		</host>
	);
}

MyWebComponent.observables = {
	title: String
};

customElement("my-web-component", MyWebComponent);
```

[🔗 link ejemplo](https://codesandbox.io/s/webcomponent-465ic)

### web-component como clase

Este es un enfoque tradicional, Element es una extensión de `HTMLElement`, el mayor beneficio de este tipo de escritura es que ud no deberá bandear las funciones asociadas a eventos. **Ud puede hacer uso de los hooks dentro de render**

```jsx
import { h, Element, customElement } from "@atomico/element";

class MyWebComponent extends Element {
	static observables = { show: Boolean };
	toggle() {
		this.show = !this.show;
	}
	render() {
		return (
			<host shadowDom>
				<button onClick={this.toggle}>toggle</button>
				{this.show && "😃"}
			</host>
		);
	}
}

customElement("my-wc", MyWebComponent);
```

## Api homologada de React

### useState

```jsx
let [state, setState] = useState(0);
```

[Documentacion desde React](https://reactjs.org/docs/hooks-reference.html#usestate), el comportamiento es idéntico.

### useEffect

```jsx
useEffect(effect);
```

[Documentacion dede React](https://reactjs.org/docs/hooks-reference.html#useeffect), el comportamiento es similar, pero Atomico añade opcionalmente soporte a al uso funciones asíncronas.

#### opción 1

```jsx
useEffect(()=>{
	fetch("//api")...
})
```

#### opción 2

```jsx
useEffect(async ()=>{
	await fetch("//api")...
})
```

useEffect, admite un segundo parámetro tipo array, que permite comparar entre renders la inmutabilidad de estos, de existir un cambio useEffect será ejecutado nuevamente.

```jsx
useEffect(() => {
	// Este callback solo se ejecutara cuando props.value cambie como inmutable
}, [props.value]);
```

useEffect, permite ejecutar una función de limpieza de efectos mediante el retorno de una función.

```jsx
useEffect(() => {
	window.addEventListener("click", handler);
	return () => {
		// Esta callback solo se ejecutara una vez que el componente se elimina del documento
		window.removeEventListener("click", handler);
	};
}, []);
```

### useReducer

```jsx
let [state, dispatch] = useReducer(reducer, initialState);
```

[Documentacion desde React](https://reactjs.org/docs/hooks-reference.html#usereducer), Atomico no ha añadido soporte al tercer parámetro sobre useReducer.

useReducer es generalmente preferible a useState cuando tiene una lógica de estado compleja que involucra varios subvalores o cuando el siguiente estado depende del anterior.

```jsx
const initialState = { count: 0 };

function reducer(state, action) {
	switch (action.type) {
		case "increment":
			return { count: state.count + 1 };
		case "decrement":
			return { count: state.count - 1 };
		default:
			throw new Error();
	}
}

function Counter() {
	const [state, dispatch] = useReducer(reducer, initialState);
	return (
		<host>
			Count: {state.count}
			<button onClick={() => dispatch({ type: "increment" })}>+</button>
			<button onClick={() => dispatch({ type: "decrement" })}>-</button>
		</host>
	);
}
```

### useMemo

```jsx
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

`useMemo`solo volverá a calcular el valor memorizado cuando una de las dependencias haya cambiado. Esta optimización ayuda a evitar cálculos costosos en cada render.

### useRef

```jsx
const refContainer = useRef(initialValue);
```

`useRef`devuelve un objeto ref mutable cuya `.current`propiedad se inicializa al argumento pasado ( `initialValue`). El objeto devuelto persistirá durante toda la vida útil del componente.

## Hooks para web-components

### useHost

Retorna un objeto ref, que permite extraer extraer el web-component, es ideal para la construcción de hooks que interactúen con el web-components de forma directa, [🔗 ejemplo](https://codesandbox.io/s/webcomponent-465ic)

## Beneficios de Atomico

### tree shaking

Atómico posee un api débilmente acoplada, favoreciendo a la generación de bundle pequeños, gracias al proceso de tree shaking.

| Size(Gzip) | Group         | exports                                                 |
| ---------- | ------------- | ------------------------------------------------------- |
| 1.7kB      | virtual-dom   | `{ h, render, options, toList }`                        |
| 1.0kB      | hooks         | `{ useState, useEffect, useMemo, useReducer, useHost }` |
| 1.0kB      | web-component | `{ customElement }`                                     |

### Memo por defecto en todos los componentes

Si ud ya es usuario de React es posible que conozca `React.memo`, este permite solo actualizar solo cuando una de sus propiedades cambie como inmutable, esta técnica se conoce como [Memoization](https://en.wikipedia.org/wiki/Memoization), Atomico aplica esto a todo los componentes.

```jsx
function Style(props) {
	useEffect(() => {
		console.log("re-render");
	});
	return <style>{props.children}</style>;
}

function MyWebComponent(props) {
	useEffect(() => console.log("mounted"), []);
	let ref = useHost();
	return (
		<host shadowDom>
			<Style>{`
      :host{padding:3rem;display:block}
      input{padding:.5rem 1rem;border-radius:5px;border:none}
      `}</Style>
			<h1>{props.title}</h1>
			<input
				value={props.title}
				onInput={({ target }) => {
					ref.current.title = target.value;
				}}
			/>
			<slot />
		</host>
	);
}
```

[🔗 link ejemplo](https://codesandbox.io/s/webcomponentandmemo-s8tkk)

Indiferente a la cantidad de veces que se actualice el web-componente, el componente Style será ignorado por el proceso de diff ya que su children no cambia
