# Hooks

La sintaxis de Atomico se basa en la experiencia funcional heredada de React, Atomico aplica este comportamiento funcional para crear web-components con un código legible, sostenible y simple ... Gracias React.

1. core
    1. [useState](#usestate)
    2. [useEffect](#useeffect)
    3. [useMemo](#usememo)
    4. [useRef](#useref)
    5. [useProp](#useprop)
2. atomico/lazy
    1. [useLazy](#uselazy)
3. atomico/router
    1. [useRouter](#userouter)
    2. [useRoute](#useroute)
    3. [useRedirect](#useredirect)
4. atomico/use-state-generator
    1. [useStateGenerator](#usestategenerator)

## useState

crea un estado local en el web-component

```jsx
let [state, setState] = useState(initialState);
```

Donde :

-   `state` es el estado actual del hook.

-   `setState` es una función que modifica el estado actual.

    > **De ser función** será ejecutada recibiendo como argumento el estado actual para retornar el siguiente estado

-   `initialState` es el estado inicial

    > **De ser función** será ejecutada para retornar el estado inicial

#### Ejemplo

```jsx
let [count, setCount] = useState(0);

function increment() {
	setCount(count + 1);
}

<host>
	count : {count}
	<button onclick={increment}>increment</button>
</host>;
```

Donde :

-   `count` es el estado actual, inicializando en `0`
-   `increment` es el actualizador de estado mediante el uso de `setCount`

## useEffect

crea un efecto secundario asociado al ciclo de render, útil para controlar efectos que interactúen con el DOM o asincronía

```jsx
function afterRender() {
	console.log("after render");
	return beforeNewRender;
}

function beforeNewRender() {
	console.log("new render");
}

useEffect(afterRender, optionalArgument);
```

Donde:

-   `afterRender` es una función que se ejecuta después del render asociado al hook
-   `beforeNewRender` es el retorno de la funcion `afterRender` y esta sera ejecutada solo si se genera un nuevo render o se desmonta el hook

Considere que en el ejemplo las funciones se separan para definir su uso, se recomienda que el callback de retorno siempre exista dentro de la función que requiere useEffect, ya que el objetivo es la limpieza de eventos que se generan en el scope ejecución del hook, como se enseña en el siguiente ejemplo:

#### Ejemplo

```jsx
let [route, setRoute] = useState(location.pathname);

useEffect(() => {
	function handler() {
		setRoute(location.pathname);
	}
	window.addEventListener("popstate", handler);
	return () => window.removeEventListener("popstate", handler);
}, []);
```

En el ejemplo useEffect se ejecutara solo una vez indiferente a la cantida de actualizaciones asociada, siendo esto de utilidad para la suscripción de eventos externos al hook.

## useMemo

memoriza el retorno de un callback limitando su ejecución mediante un array de argumentos, este se ejecuta en el momento del render

```jsx
let data = useMemo(() => {
	for (let i = 0; i < length; i++) {
		data.push({ key: i, ...placeholder });
	}
}, [length]);
```

## useRef

permite crear una referencia que se mantiene mutable entre renders.

```js
let ref = useRef(optionalCurrent);
```

Donde:

-   `ref` es un objeto que no muta entre renders
-   `opcionalCurrent` es el estado inicial de la propiedad `ref.current`

#### Ejemplo

```jsx
let ref = useRef();

useEffect(() => {
	ref.current.addEventListener("click", ({ target }) => {
		console.log({ target });
	});
}, [ref]);

<host>
	<button ref={ref}> click </button>
</host>;
```

El en ejemplo la variable `ref` se entrega al virtual-dom, este definirá en el momento de la renderizacion el nodo como `ref.current`, permitiendo acceder a este después del render.

## useProp

accede a una propiedad(props) previamente declarada sobre el contenedor(web-component), **permitiendo manipular desde el ciclo de render el estado de estas propiedades**.

```jsx
let [value, setValue] = useProp(propName);
```

Donde :

-   `value` es el estado actual de la propiedad asociada al web-component
-   `setValue` es una función encargada de actualizar el estado
-   `propsName` es el nombre de la propiedad a modificar por `useProp`

#### Ejemplo

```jsx
let [count, setCount] = useProp("count");

<host>
	count : {count}
	<button onclick={() => setCount(count + 1)}>increment</button>
</host>;
```

Ante cada cambio de count ud podrá leer estos cambios mediante la propiedad count asociada al nodo del DOM asociada al web-component, ej `nodeWebComponent.count`

# atomico/lazy

```jsx
import { useLazy } from "atomico/lazy";
```

## useLazy

crea un nodo asíncrono ideal para el uso de import o request de una sola ejecución

```jsx
let AsyncNode = useLazy(() => import("./dinamic-module"));
```

### Ejemplo

```jsx
let UiHeader = useLazy(() =>
	import("./src/web-components/ui-header/ui-header")
);

return (
	<host>
		<UiHeader loading="...loading"></UiHeader>
	</host>
);
```

# atomico/router

```js
import { useRouter, useRoute, useRedirect } from "atomico/router";
```

## useRouter

define desde un objeto la vista actual a utilizar a base de la ruta actual

```jsx
let paths = {
	"/": () => <WebComponentHome />,
	"/user/:id": ({ id }) => <WebComponentUser id={id} />,
	default: <h1>404</h1>
};
let View = useRouter(paths);
```

Donde :

-   `paths` objeto que define las expreciones para que `useRouter` realize la comprovacion que define a `View`
-   `View` es el retorno de la expresión asociada a `paths`.

## useRoute

define si una ruta esta activa y optiene los parametros de esta

```jsx
let [inRoute, paramsRoute] = useRoute("/:id?");
```

Donde :

-   `inRoute` **Booleano** que defin cvv xc cv e si la expresión concuerda con la expresión dada a `useRoute`.

-   `paramsRoute` **Objeto** que define los parámetros capturados por la expresión dada a `useRoute`.

#### Comodines de useRoute y useRouter

| Comodin    | descripcion               |
| ---------- | ------------------------- |
| `/static`  | Ruta requerida            |
| `/:id`     | parámetros obligatorio    |
| `/:id?`    | parámetro opcional        |
| `/:any...` | parámetro opcional spread |

## useRedirect

```jsx
let goHome = useRedirect("/");
```

# atomico/use-state-generator

```js
import { useStateGenerator, delay } from "atomico/use-state-generator";
```

## useStateGenerator

Este hook permite consumir generadores o funciones asíncronas para definir un estado, este consumo es recursivo por lo que ud puede usarlo para streaming complejos de data y concurrencia.

```jsx
let [state, promise] = useStateGenerator(callbackGenerator, initialState, vars);
```

Donde :

-   `state` es el estado actual del hook.
-   `promise` es una promesa que define si el proceso asincrono de `useStateGenerator` ha finalizado.
-   `callbackGenerator` es una funcion sea asincrona, generador o generador asincrono a consumir por `useStateGenerator`.
-   `initialState`, estado inicial del hook.
-   `vars` es un array de variables a observar entre renders, de ser distinto uno de estos elementos regenera el hook ejecutando nuevamente `callbackGenerator`.

#### Ejemplo

```jsx
import { useStateGenerator, delay}
/** inside web-component */
let length = 10;
let [state] = useStateGenerator((state)=>{
	while(--state){
        yield delay(1000);
        yield state;
    }
    return state;
},0, [length])
```

El ejemplo anterior genera una cuenta regresiva de 10..1, cada paso es de 1000ms.
