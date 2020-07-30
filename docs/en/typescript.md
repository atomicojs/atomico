[home](../../README.md)/en/**typescript**

# Atomico + Typescript

**Links:**

1. [tsconfig](#tsconfig)
2. [Types](#types)

## tsconfig

Atomico only requires that you associate "jsx" and "jsxFactory", this way typescript will include the autocomplete for JSX associated with Atomico.

```
{
    "compilerOptions": {
        ...
        "jsx": "preserve",
        "jsxFactory": "h"
        ...
    }
}
```

## Types

### Component\<props>

interface that facilitates autocompletion and stopping errors when creating webcomponents with Atomico.

#### Example

```tsx
import { h, c, Component } from "atomico";

interface Props {
    value: number;
}

const MyComponent: Component<Props> = ({ value }) => (
    <host>Atomico + Typescript</host>
);

MyComponent.props = {
    value: { type: Number, value: 0 },
};

customElements.define("my-component", c(MyComponent));
```

The Component interface will force all properties declared in the interface to be replicated correctly in `MyComponent.props`, eg:

```ts
const MyComponent: Component<{ value: string }> = ({ value }) => <host />;

MyComponent.props = { value: Number }; // Ts Error, value can only be String.
```

### JSX

The import of the Atomico model associates the configured JSX, it has auto-completion of attributes, events and special labels.

**Atomico allows using raw nodes over as JSX, to avoid errors declare this node as `any`**.

```tsx
const MyComponent: Component = () => {
    let { current } = useHost();
    let SlotLightDom: any = current.querySelector(":scope > [slot]");
    return (
        <host>
            <SlotLightDom />
        </host>
    );
};
```

### Hooks + Typescript

The types for the hooks are auto assigned, but it is recommended to force for a more strict validation.

#### useProp

```ts
let [count, setCount] = useState<number>("count");
```

`count` can only be of type`number`.

#### useEvent

```ts
let dispatchCustomEvent = useEvent<number>("myEvent"); //
```

The argument to the `dispatchCustomEvent` function can only be of type`number`.

#### useState

```ts
let [state, setState] = useState<number>();
```

`state` can only be of type`number`.

#### useMemo

```ts
let value = useMemo<number, [number, string]>(memoCallback, [10, "value"]);
```

`value` can only be of type`number`.

#### useReducer

```ts
let [state, dispatch] = useReducer<TypeState, ActionAdd | ActionRemove>(
    myReducer
);
```

#### useRef

```ts
let ref = useRef<HTMLInputElement>();
```

#### useEffect

```ts
useEffect<[string, number]>(effectCallback, ["value", 10]);
```

### JSXTag\<MyElement>

Construct a valid tag to be declared in `IntrinsicElements`, this inherit extends the Atomic JSX style.
