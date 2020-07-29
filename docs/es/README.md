![Atomico](../brand/logo-header.svg)

[![CircleCI](https://circleci.com/gh/atomicojs/atomico.svg?style=svg)](https://circleci.com/gh/atomicojs/atomico)
[![npm](https://badgen.net/npm/v/atomico)](http://npmjs.com/atomico)
[![gzip](https://badgen.net/bundlephobia/minzip/atomico)](https://bundlephobia.com/result?p=atomico)

Atómico una microlibreria para la creacion de webcomponents usando solo funciones, hooks y virtual-dom.

```jsx
import { h, c } from "atomico";

const MyWebComponent = () => <host>mi primer webcomponent con atomico</host>;

customElements.define("my-web-component", c(MyWebComponent));
```

## Links

1. [¿Que es Atomico?](#que-es-atomico)
2. [¿Ventajas del enfoque funcional?](#ventajas-del-enfoque-funcional)
3. Api
    1. [Props](./props.md)
    2. [Hooks](./hooks.md)
    3. [Virtual-dom](./hooks.md)
    4. [Typescript](./typescript.md)
4. Guias
    1. [Inicio rapido](./started.md)
    1. [Generador de proyecto](./scaffolding.md)

## ¿Que es Atomico?

Atómico es una microlibreria de sintaxis moderna creada por Matias Trujillo alias @uppercod, que busca simplificar la creacion de webcomponents remplazando la necesidad de usar clases y contextos(`this`) por funciones y scope para sostener lógica, atributos, propiedades, métodos y eventos, ejemplo:

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

Del ejemplo anterior podemos destacar:

1. `MyWebComponent` : Función que representa la totalidad del webcomponent.

2. `const [count, setCount] = useProp("count")` : Función Hook de sintaxis similar a useState, pero con la diferencia de que useProp refleja el estado como propiedad del componente.

3. `const increment = () => setCount(count + 1);` Función que actualizara nuestro contador.

4. `<host increment={increment}>`: Virtual-dom que asocia la función increment como método del webcomponent.

5. `MyComponent.props.count` : Objeto que asocia la propiedad y atributo count a nuestro webcomponent:

    1. `type: Number` : Declara que el valor asociado a la propiedad `count` solo puede ser de tipo numero.
    2. `value: 0`: Declara que el valor asociado a la propiedad `count` solo puede ser de tipo numero.

## Ventajas del enfoque funcional

**Abstracción de lógica**: Es una buena practica abstraer todo lo que compone una función en un modulo, para así sostener un mejor mantenimiento y reutilización lógica.

```js
import { useProp } from "atomico";
export const useCounter = (prop) => {
    const [state, setState] = useProp(prop);
    const increment = () => setState(state + 1);
    return [state, increment];
};
```

> Las clases impiden este comportamiento ya que asocian la lógica a métodos y contextos apalancando la reutilización a la herencia de clases, por lo que ud deberá heredar toda la clase para simplemente utilizar un método. **recuerde la sola herencia del HTMLElement apalanca mas de 291 propiedades y métodos que no pueden ser sobrescritos.**

**Compresión de código** : El código basado en scope es mas pequeño al ser mitificado vs el codigo basado en contextos, ya que este no debe referenciar nombres fijos, ejemplo:

```jsx
const [state, setState] = useProp("count");
return <host>{state}</host>;
// minificado
let [s, c] = u("count");
return h("host", null, s);
```

**Legibilidad de mantenimiento**: El código basado en funciones no depende del conocimiento del contexto, solo se limita a su scope.
