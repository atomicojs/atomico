![Atomico](https://raw.githubusercontent.com/atomicojs/atomico/brand/logo-header.svg)

[![npm](https://badgen.net/npm/v/atomico)](http://npmjs.com/atomico)
[![gzip](https://badgen.net/bundlephobia/minzip/atomico)](https://bundlephobia.com/result?p=atomico)

Atomico a micro-library for creating webcomponents using only functions, hooks and virtual-dom.

```jsx
import { c } from "atomico";

function myComponent({ message }) {
    return <host>Hello, {message}</host>;
}

myComponent.props = { message: String };

customElements.define("my-web-component", c(myComponent));
```

**Links:**

1. [What is Atomico?](https://atomicojs.github.io)
2. [Documentation](https://atomico.gitbook.io/doc)
    1. [🧬 Props(Properties)](https://atomico.gitbook.io/doc/guides/props)
    2. [🧩 Virtual-dom](https://atomico.gitbook.io/doc/guides/virtualdom)
    3. [🎣 Hooks](https://atomico.gitbook.io/doc/guides/hooks)
3. Resources
    1. [Brand](https://github.com/atomicojs/atomico/tree/brand)

## What is Atomico?

Atomico is a modern syntax micro-library created by Matias Trujillo alias @UpperCod, which simplifies the creation of webcomponents by replacing the need to use classes and contexts by functions and scope to support logic, attributes, properties, methods and events, example:

```jsx
import { c, useProp } from "atomico";

function myComponent() {
    const [count, setCount] = useProp("count");
    const increment = () => setCount(count + 1);
    return <host increment={increment}>count: {count}</host>;
}

myComponent.props = {
    count: { type: Number, value: 0 },
};

customElements.define("my-component", c(myComponent));
```

Where:

1. `myComponent`: Function that represents the webcomponent.

2. `const [count, setCount] = useProp("count")`: Hook function similar to useState, but with the difference that useProp reflects the property status of the component.

3. `const increment = () => setCount(count + 1);`: Function that increases the state.

4. `<host increment={increment}>`: Virtual-dom represented the incremental method.

5. `myComponent.props.count` : Object, defines the behavior of the `count` property.

    1. `type: Number` : Declare count as type `number`.
    2. `value: 0`: Declares that the initial state of `count` is`0`.
