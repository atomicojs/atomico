![Atomico](./docs/brand/logo-header.svg)

[![CircleCI](https://circleci.com/gh/atomicojs/atomico.svg?style=svg)](https://circleci.com/gh/atomicojs/atomico)
[![npm](https://badgen.net/npm/v/atomico)](http://npmjs.com/atomico)
[![gzip](https://badgen.net/bundlephobia/minzip/atomico)](https://bundlephobia.com/result?p=atomico)

[Español](./docs/es/README.md) - **English**

Atomico a micro-library for creating webcomponents using only functions, hooks and virtual-dom.

```jsx
import { h, c } from "atomico";

const MyComponent = () => <host>mi primer webcomponent con atomico</host>;

const HTMLMyComponent = c(MyComponent);

customElements.define("my-web-component", HTMLMyComponent);
```

**Links:**

1. [What is Atomico?](#what-is-atomico?)
2. Api
    1. [Props](./docs/en/props.md)
    2. [Hooks](./docs/en/hooks.md)
    3. [Virtual-dom](./docs/en/virtual-dom.md)
    4. [Typescript](./docs/en/typescript.md)
3. Guides
    1. [Project generator](./docs/en/scaffolding.md)
4. Resources
    1. [Brand](./docs/brand/README.md)

## What is Atomico?

Atómico is a modern syntax micro-library created by Matias Trujillo alias @UpperCod, which simplifies the creation of webcomponents by replacing the need to use classes and contexts by functions and scope to support logic, attributes, properties, methods and events, example:

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

Where:

1. `MyWebComponent`: Function that represents the webcomponent.

2. `const [count, setCount] = useProp("count")`: Hook function similar to useState, but with the difference that useProp reflects the property status of the component.

3. `const increment = () => setCount(count + 1);`: Function that increases the state.

4. `<host increment={increment}>`: Virtual-dom represented the incremental method.

5. `MyComponent.props.count` : Object, defines the behavior of the `count` property.

    1. `type: Number` : Declare count as type `number`.
    2. `value: 0`: Declares that the initial state of `count` is`0`.
