# Atomico + Typescript

## Configuracion

**tsconfig.json** : Atomico solo requiere que ud asocie "jsx" y "jsxFactory", de esta forma typescript incluira el autocompletado para JSX asociadao a Atomico.

```json
{
    "compilerOptions": {
        ...
        "jsx": "preserve",
        "jsxFactory": "h"
        ...
    }
}
```

## Tipos para typescript

### Component<props>

interfas que facilita el autocompletado y detecion de errores al momento de crear webcomponens con Atomico.

#### Ejemplo

```tsx
import { h, c, Component } from "atomicio";

interface Props {
    value: number;
}

const MyComponent: Component<Props> = ({ value }) => (
    <host>Atomico + Typescript</host>
);

MyComponent.props = {
    value: { type: Number, value: 0 },
};
```

La interfaz Component oblia a que todas las propiedades declaras en la interfas se repliquen correctamente en `MyComponent.props`, ej:

```ts
const MyComponent: Component<{ value: string }> = ({ value }) => <host />;

MyComponent.props = { value: Number }; // Ts Error, value solo puede ser String.
```

Component tambien obliga a que su componente al usar JSX siempre retorne la etiqueta `<host/>`.

```tsx
const MyComponent: Component<{ value: string }> = ({ value }) => <host />;
```
