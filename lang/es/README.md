# Atomico/core

Atomico es una biblioteca para la creacion de interfaces basada en componentes funcionales 
todo gracias a una pequeña implementación del virtual-dom ligera(2.6kB) y eficiente.

## Índice

1. [Objetivos](#objetivos)
2. [Componentes](#componentes)
    1. [Uso de eventos](#uso-de-eventos)
    2. [Uso del shadowDom](#uso-del-shadowdom)
    3. [Uso de contextos](#uso-de-contextos)
    4. [Listas con clave](#listas-con-clave)
3. [🔥 Hooks](#hooks)
    1. [useState](#usestate)
    2. [useEffect](#useeffect)
    3. [useRef](#useref)
    4. [useMemo](#usememo)
    5. [useContext](usecontext)
4. [Utilidades](#utilidades)
    1. [Atomico ❤️ web-component](#atomico-+-web-component)
5. [👷 Ayuda!](#ayuda)

## Objetivos

1. **Ligero** al igual que otras librerías Atomico busca ser sumamente pequeño < 3kB. 
2. **Moderno** Atomico busca implementar tecnologías actuales dentro de la generación de componentes, sea por ejemplo el uso del **shadowDom** permitiendo que Atomico se acople sumamente bien a los **web-components **
3. **Simple** ya que sus componentes solo serán funciones.



## Componentes

Los componentes dentro de atómico son solo funciones, estas pueden representar una parte de la vista y poder poseer opcionalmente uno o mas estados y ciclo de vida.

```jsx
import { h, render } from "@atomico/core";

function App() {
    return <h1>I'm Atomico!</h1>;
}

render(<App />, document.getElementById("app"));
```

Note que atomico importa de 2 variables `h` que es la asaignacion de pragma para transpilar el codigo JSX a JS y render que permite imprimir el contenido asociado al componente.

### Uso de eventos

Los eventos dentro de atómico se definen no por prefijo sino por tipo, estos eventos solo se aplican si el nodo es un HTMLElement o SVGElement.

```jsx
function handler(event) {
    /**...*/
}
<button click={handler} />;
```

### Uso del shadowDom

Ud puede habilitar el shadow-dom para ser usado dentro de un nodo, mediante la definición de  la propiedad `shadowDom`

```jsx
<div shadowDom>
    <style>{`
		:host{width:100px;height:100px}
	`}</style>
    <h1>inside shadowDom!</h1>
</div>;
```

Esto permite aislar el nodo del resto del documento.

### Uso de contextos

Los contextos dentro de atómico son simples de manipular, mediante la definición de la propiedad `context` 

```jsx
function ChildComponent(props, context) {
    return <h1>{context.message}</h1>;
}
<ParentComponent context={{ message: "I'm context" }}>
    <ChildComponent />
</ParentComponent>;
```

Ud también puede recuperar contextos de espacio de nombre mediante [useContext](#usecontext), este es ideal para usar dentro de hooks personalizados.

### Listas con clave

la propiedad key permite añadir un identificador a un Elemento que debe ser único entre hermanos.

```jsx
<ul>
    <li key="1">one</li>
    <li key="2">two</li>
    <li key="3">tree</li>
</ul>;
```

Esto trae como beneficio:

1. Reducir mutaciones del DOM asociadas a la reordenar listas de nodos sin recrear el elemento 
2. Reducir mutaciones del DOM asociadas a al eliminación de nodos
3. Reducir mutaciones del DOM asociadas a la inserción de nuevos nodos.

## Hooks

Los [hooks fueron introducidos por React](#hooks), estos tiene la gran ventaja de controlar el componente sin conocer el contexto de invocación, ud lograra un código mas reutilizable que una clase.

Los hooks llegan a Atomico para potenciar la creación de componentes funcionales.

```jsx
import { h, useState } from "@atomico/core";

export function Counter() {
    let [count, setCount] = useState(0);
    return (
        <div>
            {count}
            <button click={() => setCount(count + 1)}>icrement</button>
        </div>
    );
}
```

### useState

El api basa en el [useState de react](https://reactjs.org/docs/hooks-state.html), este permite vincular un estado al componente funcional, ud puede crear tantos como ud necesite.

```jsx
import { h, useState } from "@atomico/core";

export function Counter() {
    let [count1, setCount1] = useState(0);
    // ud puede usar una funcion para crear el estado inicial
    let [count2, setCount2] = useState(() => 0);
    return (
        <div>
            {count1}
            {count2}
            <button click={() => setCount1(count + 1)}>icrement count 1</button>
            <button
                click={() => {
                    // note que ud puede usar un callback para recuperar el estado y retornar uno nuevo
                    setCount2(state => state + 1);
                }}
            >
                icrement count 2
            </button>
        </div>
    );
}
```

### useEffect

El api se basa en el [useEffect de react](https://reactjs.org/docs/hooks-effect.html), permite añadir un callback de ciclo de vida del componente, este posee la ventaja que puede limpiar los efectos sea después de cada renderización o eliminación del elemento.

```jsx
import { h, useState, useEffect } from "@atomico/core";

export function AutoCounter() {
    let [count, setCount] = useState(0);
    useEffect(() => {
        setTimeout(() => {
            setCount(count + 1);
        }, 1000);
    });
    return <div>{count}</div>;
}
```

> El ejemplo anterior no es beneficioso ya que no controla la eliminacion de `setTimeout`

EL ciclo de vida al que accede useEffect es **Created** ,**Updated** y **Remove**, este ultimo es solo escuchado por el retorno del primer callback.

```jsx
import { h, useState, useEffect } from "@atomico/core";

export function AutoCounter() {
    let [count, setCount] = useState(0);
    useEffect(() => {
        let timeout = setTimeout(() => {
            setCount(count + 1);
        }, 1000);
        return () => clearTimeout(timeout);
    });
    return <div>{count}</div>;
}
```

> este ejemplo permite limpiar los efectos creados previamente dentro del mismo callback.

**useEffect** admite un segundo argumento capas de controlar la ejecucion del callback a base de un arreglo, ejemplo si ninguna propiedad ha cambiado entre render el callback asociado a useEffect no cambiara.

```jsx
import { h, useState, useEffect } from "@atomico/core";

export function AutoCounter(props) {
    let [count, setCount] = useState(0);
    useEffect(() => {
        let interval = setInterval(() => {
            setCount(++count);
        }, props.ms);
        return () => clearInterval(interval);
    }, [props.ms]);
    return <div>{count}</div>;
}
```



### useMemo

el api se basa en [useMemo de React](https://reactjs.org/docs/hooks-reference.html#usememo), este permite recordad el retorno de un callback limitando su ejecución a la comparación del segundo argumento entre renders. **El segundo argumento debe ser un arreglo**

```jsx
import { h, useMemo } from "@atomico/core";

function Component(){
    let list = useMemo(() => {
        let list = [];
        for (let key = 0; key < props.length; key++) list.push({ key });
        return list;
    }, [props.length]);
}
```

### useRef

el api se basa en [useRef de React](https://reactjs.org/docs/hooks-reference.html#useref), este crea un objeto para trabajar como referencia, la instancia inicial de este objeto no se pierde entre renders

```jsx
import { h, useRef } from "@atomico/core";

function Component(){
    let ref = useRef();
    return <button ref={ref}>...</button>;
}
```

## Utilidades

### Atomico + web-components

Atomico en su primeras versiones se basaba en clases, similar a como opera hoy LitElement, pero esto no me trajo beneficio, en cambio preferi independizar su proceso de virtual-dom y manejar externamente la fusión con web-components, registrar un componente con atomico es usar JSX.

```jsx
import { register } from "@atomico/web-component";

function App(props) {
    return (
        <h1>
            {props.name}
            {props.age * 2}
        </h1>
    );
}

register(
    <my-app name age={Number}>
        {App}
    </my-app>
);
```

## Ayuda

El código de Atomico lo he reescrito en tan solo 2 días y requiere pruebas, actualmente usa Jest, pero es mejor migrar a Karma para verificar de mejor forma el manejo de listas con clave y las mutaciones asociadas al dom, sin el uso de JSDOM