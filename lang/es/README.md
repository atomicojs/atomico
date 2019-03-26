# @atomico/core

<img src="../../assets/logo-without-margin.png" style="max-width:320px"/>

[![CircleCI](https://circleci.com/gh/atomicojs/core.svg?style=svg)](https://circleci.com/gh/atomicojs/core)
[![npm](https://badgen.net/npm/v/@atomico/core)](http://npmjs.com/@atomico/core)
[![gzip](https://badgen.net/bundlephobia/minzip/@atomico/core)](https://bundlephobia.com/result?p=@atomico/core)

Es una pequeña librería para la creación de interfaces, que busca dar una experiencia de desarrollo ágil y simple.

```jsx
import {h, render} from "@atomico/core";

function Emoji(){
    return <span>👋</span>
}

render(<Emoji/>,document.querySelector("#app"));
```
1. [Motivación](#motivacion)
2. [Virtual-dom](#virtual-dom)
3. [JSX](#jsx)
   1. [Condiciones lógicas](#condiciones-logicas)
   2. [Eventos](eventos)
   3. [children](#children)
      1. [toList](#tolist)
4. [componentes como funciones](#componentes-como-funciones)
5. [hooks](#hooks)
   1. [¿por que hooks?](#¿por-que-hooks?)
   2. [useState](#usestate)
   3. [useEffect](#useeffect)
   4. [useReducer](#usereducer)
   5. [useMemo](#usememo)
   6. [useRef](#useref)
   7. [useContext](#usecontext)
6. [createContext](#createcontext)
7. [Utilidades](#utilidades)
   1. [@atomico/element](#@atomico/element)
   2. [@atomico/store](#@atomico/store)
8. [Ejemplo](#ejemplo)

## Motivación

Como autor busco simplificar la curva de aprendizaje al momento de crear interfaces, para logrear esto he recolectado  ideas ya existentes en el mundo de js  y  las he aplicado de forma eficiente.

## Virtual-dom

Atomico crea interfaces a base de un objeto, este objeto puede ser  creado con [JSX](https://reactjs.org/docs/introducing-jsx.html), [HTM](https://github.com/developit/htm) o manualmente como enseña el siguiente ejemplo:

```js
/**
* @param {object} vnode
* @param {string|Function} vnode.type
* @param {object} [vnode.props]
*/
let vnode = {
    type:"h1",
    props:{
        class:"my-class",
        onClick(){
            console.log("click!");
        }
    }
}
```

Este objeto no es decorado por el proceso de diff, por lo que ud podra hacer declaraciones estaticas de nodos virtuales.

## JSX

Atomico utiliza  preferentemente JSX para la creación e interfaces.

### Condiciones lógicas

Atomico no imprime valores booleanos o nulos.

```jsx
// Este tipo de condicion obliga a que props.show sea booleano
function Show() {
	return <div>{props.show && <Emoji />}</div>;
}
// ternaria
function Show() {
	return <div>{props.show ? <Emoji /> : ""}</div>;
}
```

### Eventos

Para suscribir eventos al nodo debe usar el prefijo `on` seguido del tipo de evento.

```jsx
// lowerCase
function Button(props) {
	return <button onclick={props.handlerClick} />;
}
// camelCase
function Button(props) {
	return <button onClick={props.handlerClick} />;
}
```

### children

Los niños en Atomico funcionan como en React, por lo que si ud busca iterar sobre `props.children`  necesitara usar la función toList, para generar una matriz.

#### toList

Esta función permite iterar de forma recursiva sobre props.children,  siempre retornara una matriz plana.

```jsx
// forma simple   
toList(props.children).map(()=><div>{child}</div>) 
// forma recomendada para grandes iteraciones.
toList(props.children,(child,index)=><div>{child}</div>)
```

## componentes como funciones

Los componentes dentro de Atomico son solo funciones, que pueden expresar efectos secundarios y estados solo cuando es requerido.

```jsx
import {h,useEffect} from "@atomico/core";

export function Button(props){
    useEffect(()=>{
        console.log("Component mounted");
        return ()=>{
            console.log("Component remove");
        }
    })
    return <button>{props.children}</button>
}
```

## hooks

Los hooks dentro de Atomico se basan en el patrón creado por **React**, estos permiten añadir efectos secundarios sobre la función, sea actualización de estados o escuchar de ciclo entre actualizaciones. 

### ¿por que hooks?

Los hooks permiten crear lógica reutilizable como nunca antes, mediante la definición de contextos que permiten  escapar del polimorfismo tradicional de una clase, el patrón de hooks permite poseer código débilmente acoplado lo que resulta sumamente útil al momento de mantener o reducir dependencias.

### useState

[useState se basa en el implementado por React](https://reactjs.org/docs/hooks-state.html), permite crear uno o mas estado observable por el componente.

```jsx
import { h, useState } from "@atomico/core";

function Example() {
	const [count, setCount] = useState(0);
	return (
		<div>
			<p>You clicked {count} times</p>
			<button onClick={() => setCount(count + 1)}>Click me</button>
		</div>
	);
}
```

### useEffect

[useEffect se basa en el implementado por React](https://reactjs.org/docs/hooks-effect.html), permite añadir efectos secundarios  al componente.

```jsx
import {h, useEffect} from "@atomico/core";

function Example(){
  useEffect(()=>{
    document.title = "component example mounted";
  })
  return "Example!";
}
```

useEffect también permite generar limpieza sobre los efectos invocados dentro del callback, para esto deberá retornar una función.

```jsx
import { h, useEffect } from "@atomico/core";

function Example() {
	useEffect(() => {
		function handler() {
			console.log("Click window");
		}
		window.addEventListener("click", handler);
		return () => window.removeEventListener("click", handler);
	});
	return "Example!";
}

```

useEffect también permite un comportamiento asíncrono.

```jsx
import { h, useEffect } from "@atomico/core";
import { delay } from "./utils";

function Example() {
	useEffect(async () => {
		await delay(200);
		document.title = "component example mounted";
	});
	return "Example!";
}
```

useEffect admite un segundo argumento este debe ser una matriz y es capas de limitar la ejecución de useEffect entre renders frente a los cambios de dicha matriz.

```jsx
import { h, useEffect } from "@atomico/core";
import { delay } from "./utils";

function Example(props) {
	useEffect(async () => {
		await delay(200);
		document.title = `component ${props.title} example mounted`;
	}, [props.title]);
	return "Example!";
}
```

### useReducer

[useReducer se basa en el implementado por React](https://reactjs.org/docs/hooks-reference.html#usereducer), permite controlar el estado de un componente mediante le patron de reductores expresado por Redux

```jsx
import { h, useReducer } from "@atomico/core";

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

function Counter({ initialState }) {
	const [state, dispatch] = useReducer(reducer, initialState);
	return (
		<div>
			Count: {state.count}
			<button onClick={() => dispatch({ type: "increment" })}>+</button>
			<button onClick={() => dispatch({ type: "decrement" })}>-</button>
		</div>
	);
}
```

### useMemo

[useMemo se basa en el implementado por React](https://reactjs.org/docs/hooks-reference.html#usememo), permite memorizar el retorno asociado a un callback, limitando la ejecución del mismo ante el cambio del segundo argumento dado.

```jsx
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

### useRef

[useRef se basa en el implementado por React](https://reactjs.org/docs/hooks-reference.html#useref), permite crear un objeto mutable que no cambia entre renders.

```jsx
const refContainer = useRef(initialValue);
```

### useContext

[useContext se basa en el implementado por React](https://reactjs.org/docs/hooks-reference.html#usecontext) permite consumir contextos creados por [createContext](#createContext).

```jsx
const value = useContext(MyContext);	
```

## createContext

Crea 2 componentes que permiten manipular u obtener el contexto asociado a la instancia de `createContext`.

```jsx
import { h, createContext } from "@atomico/core";

let defaultValue = "default-context";

let Context = createContext(defaultValue);

// accederá al valor por defecto
<Context.Consumer>{value => <h1>{value}</h1>}</Context.Consumer>;

// accederá al valor definido por Context.Provider
<Context.Provider value="parent-context">
	<Context.Consumer>{value => <h1>{value}</h1>}</Context.Consumer>
</Context.Provider>;
```

## Utilidades

### @atomico/element

[@atomico/element](https://github.com/atomicojs/element) Permite la creación de web-componentes expresivos usado Atomico.

```jsx
import { useEffect } from "@atomico/core";
import { Element } from "@atomico/element";

class MyComponent extends Element {
	static attributes = {
		value: Number
	};
	render(props) {
		useEffect(() => {
			console.log("Component updated");
		});
		return <host shadowDom>{props.number * 2}</host>;
	}
}
```

> `<host/>` es un tag especial dentro de atómico que apunta al contenedor dado a render, este es ideal para manipular el WC, sobre el mismo proceso de diff.

### @atomico/store

[@atomico/store](https://github.com/atomicojs/store) permite consumir acciones y definir un estado a base del retorno de dichas acciones, **@atomico/store** es capas de consumir Promesas, Generadores, funciones asíncronas y generadores asíncronos.

```jsx
import {Store} from "@atomico/store";

function *takeoff(){
    yield "tree" // state {rocket:"tree"}
    yield "thow" // state {rocket:"two"}
    yield "one"  // state {rocket:"one"}
    return "🚀 takeoff!" // state {rocket: "🚀 takeoff!"}
}

let store = Store({rocket:{takeoff}})

store.actions.rocket.takeoff().then(()=>{
    console.log("done")
})
    
store.subscribe((state)=>{
    console.log(state) 
})
```

## Ejemplos