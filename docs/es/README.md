![Atomico](../brand/logo-header.svg)

[![CircleCI](https://circleci.com/gh/atomicojs/atomico.svg?style=svg)](https://circleci.com/gh/atomicojs/atomico)
[![npm](https://badgen.net/npm/v/atomico)](http://npmjs.com/atomico)
[![gzip](https://badgen.net/bundlephobia/minzip/atomico)](https://bundlephobia.com/result?p=atomico)

**Español** - [Ingles](../../README.md)

Atómico una microlibreria para la creacion de webcomponents usando solo funciones, hooks y virtual-dom.

```jsx
import { h, c } from "atomico";

const MyWebComponent = () => <host>mi primer webcomponent con atomico</host>;

customElements.define("my-web-component", c(MyWebComponent));
```

**Links:**

1. [¿Que es Atomico?](#que-es-atomico)
2. Api
    1. [Props](./props.md)
    2. [Hooks](./hooks.md)
    3. [Virtual-dom](./hooks.md)
    4. [Typescript](./typescript.md)
3. Guias
    1. [Generador de proyecto](./scaffolding.md)
4. Recursos
    1. [Brand](../brand/README.md)

## ¿Que es Atomico?

Atómico es una microlibreria de sintaxis moderna creada por Matias Trujillo alias @uppercod, que busca simplificar la creacion de webcomponents remplazando la necesidad de usar clases y contextos por funciones y scope para sostener lógica, atributos, propiedades, métodos y eventos, ejemplo:

```jsx
const MyComponent = () => {
    const [count, setCount] = useProp("count");
    const increment = () => setCount(count + 1);
    return <host increment={increment}>count: {count}</host>;
};

MyComponent.props = {
    count: { type: Number, value: 0 },
};
```

Donde:

1. `MyWebComponent`: Función que representa del webcomponent.

2. `const [count, setCount] = useProp("count")`: Función Hook similar a useState, pero con la diferencia de que useProp refleja el estado como propiedad del componente.

3. `const increment = () => setCount(count + 1);`: Función que incrementa el estado.

4. `<host increment={increment}>`: Virtual-dom representado el método incremental.

5. `MyComponent.props.count`: Objeto que define el comportamiento de la propiedad `count`.

    1. `type: Number` : Declara `count` como tipo `number`.
    2. `value: 0`: Declara que el estado inical de `count` es `0`.
