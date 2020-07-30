[inicio](./README.md)/es/**typescript**

# Atomico + Typescript

**Links:**

1. [tsconfig](#tsconfig)
2. [Tipos](#Tipos)

## Configuración

**tsconfig.json** : Atomico solo requiere que ud asocie "jsx" y "jsxFactory", de esta forma typescript incluirá el autocompletado para JSX asociado a Atomico.

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

## Tipos

### Component\<props>

interfaz que facilita el autocompletado y detención de errores al momento de crear webcomponens con Atomico.

#### Ejemplo

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

La interfaz Component obligara a que todas las propiedades declaras en la interfaz se repliquen correctamente en `MyComponent.props`, ej:

```ts
const MyComponent: Component<{ value: string }> = ({ value }) => <host />;

MyComponent.props = { value: Number }; // Ts Error, value solo puede ser String.
```

### JSX

La importación del modulo Atómico asociara el JSX configurado, este ofrece autocompletado de atributos, eventos y etiquetas especiales.

**Atomico permite usar nodos raw sobre como JSX, par evitar errores declare este nodo como `any`**.

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

Los tipos para los hooks son auto asignados, pero es recomendable forzando para una validación sea más estricta.

#### useProp

```ts
let [count, setCount] = useState<number>("count");
```

#### useEvent

```ts
let dispatchCustomEvent = useEvent<number>("myEvent"); //
```

El argumento para la función `dispatchCustomEvent` solo puede ser del tipo `number`.

#### useState

```ts
let [state, setState] = useState<number>();
```

`state` solo puede ser del tipo `number`.

#### useMemo

```ts
let value = useMemo<number, [number, string]>(memoCallback, [10, "value"]);
```

`value` solo puede ser del tipo `number`.

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

Construye una etiqueta valida para ser declarada en `IntrinsicElements`, este hereda extiende el estilo de JSX de Atomico.
