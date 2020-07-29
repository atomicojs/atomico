# Props

Los props permite declarar

### Sintaxis

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

La definición simple acelera la lectura la propiedad, esta no incluirá efectos asociados como valor por defecto, reflejar como atributo o emitir eventos ante el cambio, eg:

```javascript
WebComponents.props = {
    propString: String, // attribute, eg: prop-string='hi!'
    propNumber: Number, // attribute, eg: prop-number='10'
    propObject: Object, // attribute, eg: prop-object='{}'
    propArray: Array, // attribute eg: prop-array='[]'
    propDate: Date, // attribute eg: prop-date='2019-12-05',
    propBool: Boolean, // attribute eg: prop-bool
};
```

### Definicion avanzada de props

Mejora la definición simple añadiendo declaraciones utilitarias, permitiendo declarar en un objeto asociado a la prop, tipo, reflejo como atributo, valor por defecto y emisión de eventos ante el cambio.

#### Prop.type

```javascript
// valid declaration
WebComponents.props = { myName: String };
// valid declaration
WebComponents.props = { myName: { type: String } };
```

| Tipo    | Acepta `reflect` |
| :------ | :--------------- |
| String  | Si               |
| Number  | Si               |
| Boolean | Si               |
| Date    | Si               |
| Object  | Si               |
| Array   | Si               |
| Promise | No               |
| Symbol  | No               |
| RegExp  | No               |

#### Prop.reflect

De ser true, reflejara la propiedad como atributo, esto es util para la declaración de estados del CSS, eg:

```jsx
let styleSheet = /*css*/ `
    :host{
        background:black;
    }
    :host([checked]){
        blackground:white;
    }
`;
WebComponent.props = {
    checked: {
        type: Boolean,
        reflect: true,
    },
};
```

#### Prop.event

Permite despachar un evento ante el cambio de valor del prop, si se define como true el evento a emitir tomara el nombre de la prop.

```javascript
WebComponent.props = {
    simpleEvent: {
        type: String,
        event: true,
    },
};
// listener

nodeWebComponent.addEventListener("simpleEvent", handler);
```

si se define mediante un objeto ud podrá configurar el evento asociado a la prop.

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

-   `event.type` : String - opcional, nombre del evento a emitir ante el cambio de la prop
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
        get value() {
            return { ...defaultState };
        },
    },
};
```

{% hint style="warning" %}
Use getter si desea que el valor sea único entre instancias, esto es requerido su usa tipos `Array` y `Object`.
{% endhint %}

### Efectos de la mutación de props

Es común ver este tipo de comportamiento al trabajar con web-components, ej

```javascript
let node = document.querySelector("custom-element");

node.checked = true;

node.checked = !node.checked;
```

Ambos se consideran validos, pero para crear una orientación funcional las props de atomico pueden ser definidas como reductores de estado, ej:

```javascript
node.checked = (currentState) => !currentState;
```

Atómico agrupa las actualizaciones provenientes del las props y las agrupa en un solo render gestionado por una microtask interno, si ud busca ver el efecto secundario de su actualización sobre las props deberá hacer lo siguiente :

```javascript
node.prop1 = 1;
node.prop2 = 2;
node.prop3 = 3;

await node.rendered;

/** any side effects, eg: analysis of the resulting DOM **/
```

{% hint style="info" %}
Su WebComponent no recibe referencias de las props, cada render recibe una instantánea inmutable.
{% endhint %}
