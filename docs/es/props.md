# Props

Atomico mediante la asociación del objeto prop a la función que declara el webcomponent permite la creación de propiedades con validación de Tipo, Disparar eventos de cambio, Reflejar como atributos y más.

### Sintaxis.

```javascript
WebComponent.props = {
    simpleProp: String,
    advaceProp: {
        type: String,
        reflect: true,
        value: "default string",
        event: {
            type: "UpdateAdvanceProp",
            bubbles: true,
        },
    },
};
```

### Definición simple

La definición simple acelera la lectura la propiedad, esta no incluirá efectos asociados como valor por defecto, reflejar como atributo o emitir eventos ante el cambio, ej:

```javascript
WebComponents.props = {
    propString: String,
    propNumber: Number,
    propObject: Object,
    propArray: Array,
    propDate: Date,
    propBool: Boolean,
};
```

### Definición avanzada de props

Mejora la definición simple añadiendo declaraciones utilitarias, permitiendo declarar en un objeto asociado a la prop, tipo, reflejo como atributo, valor por defecto y emisión de eventos ante el cambio.

#### Prop.type

```javascript
// valid declaration
WebComponents.props = { myName: String };
// valid declaration
WebComponents.props = { myName: { type: String } };
```

| Tipo     | Acepta `reflect` |
| :------- | :--------------- |
| String   | Si               |
| Number   | Si               |
| Boolean  | Si               |
| Date     | Si               |
| Object   | Si               |
| Array    | Si               |
| Promise  | No               |
| Symbol   | No               |
| RegExp   | No               |
| Function | No               |

#### Prop.reflect

Si es `true` reflejara la propiedad como atributo.

```jsx
WebComponent.props = {
    checked: {
        type: Boolean,
        reflect: true,
    },
};
```

#### Prop.event

Permite despachar un evento ante el cambio de valor del prop.

```jsx
WebCompoent.props = {
    advanceEvent: {
        type: String,
        event: {
            type: "myCustomEvent",
            bubbles: true,
            detail: "any message",
            cancelable: true,
            composed: true,
        },
    },
};
```

Donde :

-   `event.type` : String, nombre del evento a emitir ante el cambio de la prop
-   `event.bubbles` : Boolean - opcional, indica que el evento puede ser escuchado por los contenedores.
-   `event.detail` : Any - opcional, permite adjuntar informacion custom del evento
-   `event.cancelable` : Boolean - opcional, indica que el evento puede ser cancelado por algun oyente
-   `event.composed` : Boolean - opcional, permite que el evento sobrepase el limite del shadow-root

Las propiedades especiales del evento son las conocidas como el estándar `EventInit` , puede conocer mas detalle en la [documentación adjunta](https://developer.mozilla.org/en-US/docs/Web/API/Event/Event)

#### Prop.value

Atomico permite la definición de valores por defectos de las props.

```javascript
WebComponents.props = {
    valueNormal: {
        type: Number,
        value: 100,
    },
    valueObject: {
        type: Object,
        value: () => ({ ...defaultState }),
    },
};
```

### Efectos de la mutación de props

Es común ver este tipo de comportamiento al trabajar con webcomponents, ej

```javascript
let node = document.querySelector("custom-element");

node.checked = true;

node.checked = !node.checked;
```

Ambos se consideran validos, pero para crear una orientación funcional las props de atomico pueden ser definidas como reductores de estado, ej:

```javascript
node.checked = (currentState) => !currentState;
```

Atomico agrupa las actualizaciones del DOM, por lo que si ud busca conocer el estado del DOM debera esperar el termino de la actualizacion mediante la propiedad `updated`.

```javascript
node.prop1 = 1;
node.prop2 = 2;
node.prop3 = 3;

await node.updated;

node.shadowRoot.querySelector("input");
```
