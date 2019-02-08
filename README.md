# Atomico/core

Atomico is a library for the creation of interfaces based on functional components
all thanks to a small implementation of the virtual-dom light (2.7kB) and efficient.

## Index

1. [Objectives](#objectives)
2. [Components](#components)
    1. [Use of events](#use-of-events)
    2. [Using the shadowDom](#using-the-shadowDom)
    3. [Use of contexts](#use-of-contexts)
    4. [Use of lists with key](#lists-with-key)
3. [🔥 Hooks](#hooks)
    1. [useState](#usestate)
    2. [useEffect](#useeffect)
    3. [useRef](#useref)
    4. [useMemo](#usememo)
    5. [useContext](usecontext)
4. [Utilities](#utilities)
    1. [Atomico ❤️ web-component](#atomico-+-web-component)
5. [👷 Help!](#help)

## Objectives 

1. **Small** like other bookstores Atomico seeks to be extremely small.
2. **Moderno** Atomico seeks to implement current technologies within the generation of components, for example the use of **shadowDom** allowing Atomico to fit extremely well to the **web-components**
3. **Simple** since its components will only be functions.


## Components

The components within Atomico are functions that can optionally possess one or more states and life cycle.

```jsx
import { h, render } from "@atomico/core";

function App() {
    return <h1>I'm Atomico!</h1>;
}

render(<App />, document.getElementById("app"));
```

Note that Atomico imports of 2 variables `h` which is the assignment of pragma to transpile the code JSX to JS and `render` that allows to print the content associated with the component.

### Use of events

Events within Atomico are defined not by prefix but by type, these events only apply if the node is an HTMLElement or SVGElement.

```jsx
function handler(event) {
    /**...*/
}
<button click={handler} />;
```

### Using the shadowDom

You can enable the shadowDom to be used within a node, by defining the `shadowDom` property

```jsx
<div shadowDom>
    <style>{`
		:host{width:100px;height:100px}
	`}</style>
    <h1>inside the shadowDom!</h1>
</div>;
```

This allows you to isolate the node from the rest of the document.

### Use of contexts

Contexts within Atomico are simple to manipulate, by defining the `context` property

```jsx
function ChildComponent(props, context) {
    return <h1>{context.message}</h1>;
}
<ParentComponent context={{ message: "I'm context" }}>
    <ChildComponent />
</ParentComponent>;
```
You can also retrieve namespace contexts using [useContext](#usecontext), this is ideal to use within custom hooks.

### Use of lists with key]
 
the use of the `key` property on a tree of nodes allows to keep manipulating the order of the nodes without regenerating the list

```jsx
<ul>
    <li key="1">one</li>
    <li key="2">two</li>
    <li key="3">tree</li>
</ul>;
```

This brings as benefit:

1. Reduce DOM mutations associated with ordering lists of nodes without recreating the element
2. Reduce DOM mutations associated with the elimination of nodes
3. Reduce DOM mutations associated with the insertion of new nodes.

## Hooks

Los [hooks fueron introducidos por React](#hooks), estos tiene la gran ventaja de controlar el componente sin conocer el contexto de invocación, ud lograra un código mas reutilizable que una clase.

The [hooks were introduced by React](https://reactjs.org/docs/hooks-intro.html), these have the great advantage of controlling the component without knowing the invocation context(this), you will achieve a more reusable code than a class.

The hooks reach Atomico to enhance the creation of functional components.

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

The api is based on the [useState of React](https://reactjs.org/docs/hooks-state.html), it allows to link a state to the functional component, you can create as many as you need.

```jsx
import { h, useState } from "@atomico/core";

export function Counter() {
    let [count1, setCount1] = useState(0);
    // You can use a function to create the initial state
    let [count2, setCount2] = useState(() => 0);
    return (
        <div>
            {count1}
            {count2}
            <button click={() => setCount1(count + 1)}>icrement count 1</button>
            <button
                click={() => {
                    // You can use a callback to retrieve the status and return a new one
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

The api is based on the [useEffect of React](https://reactjs.org/docs/hooks-effect.html), it allows adding a callback of the component's life cycle, this has the advantage that it can clean the effects either after each rendering or removal of the element.

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

> The previous example is not beneficial since it does not control the elimination of `setTimeout`

The life cycle you access uses Effects **Created**, **Updated** and **Remove**, the latter is only heard by the return of the first callback.

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

> this example allows you to clean the previously created effects within the same callback.

**useEffect** supports a second argument layers to control the execution of the callback based on an array, example if no property has changed between render the callback associated with useEffect will not change.

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

the api is based on [useMemo de React](https://reactjs.org/docs/hooks-reference.html#usememo), this allows you to remember the return of a callback limiting its execution to the comparison of the second argument between renders. **The second argument must be an arrangement**

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

the api is based on [useRef from React](https://reactjs.org/docs/hooks-reference.html#useref), this creates an object to work as a reference, the initial instance of this object is not lost between renders

```jsx
import { h, useRef } from "@atomico/core";

function Component(){
    let ref = useRef();
    return <button ref={ref}>...</button>;
}
```

## Utilities

### Atomico + web-components

Atomico in its first versions was based on classes, similar to how it operates today LitElement, but this did not bring me benefit, instead I preferred to separate its process from virtual-dom and externally handle the fusion with web-components, registering a component with Atomico is use JSX

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

## Help

I have rewritten the Atomico code in just 2 days and it requires tests, currently it uses Jest, but it is better to migrate to Karma to better verify the handling of code lists and the mutations associated with the Sun, without the use of JSDOM