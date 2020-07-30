[home](../../README.md)/**props**

# Props

Atomico by associating the prop object with the function declared by the webcomponent allows the creation of properties with Type validation, Trigger change events, Reflect as attributes and more.

**Links**:

1. [Type syntax](#type-syntax).
2. [Simple definition](#simple-definition).
3. [Advanced definition](#advanced-definition).

### Type syntax

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

### Simple definition

The simple definition accelerates the reading of the property, it will not include associated effects as a default value, reflect as an attribute or emit events before the change, eg:

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

### Advanced definition

Improve the simple definition by adding utilitarian declarations, allowing to declare in an object associated to the prop, type, reflection as attribute, default value and emission of events before the change.

#### Prop.type

```javascript
// valid declaration
WebComponents.props = { myName: String };
// valid declaration
WebComponents.props = { myName: { type: String } };
```

| Type     | `reflect` |
| :------- | :-------- |
| String   | Si        |
| Number   | Si        |
| Boolean  | Si        |
| Date     | Si        |
| Object   | Si        |
| Array    | Si        |
| Promise  | No        |
| Symbol   | No        |
| RegExp   | No        |
| Function | No        |

#### Prop.reflect

If it is `true` it reflects the property as an attribute.

```jsx
WebComponent.props = {
    checked: {
        type: Boolean,
        reflect: true,
    },
};
```

#### Prop.event

Lets dispatch an event before the change of value of the prop.

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

Where:

-   `event.type`: String , nombre del evento a emitir ante el cambio de la prop
-   `event.bubbles`: boolean - optional, indicates that the event can be heard by the containers.
-   `event.detail`: Any - optional, allows you to attach custom event information
-   `event.cancelable`: Boolean - optional, indicates that the event can be canceled by a listener
-   `event.composed`: Boolean - optional, allows the event to exceed the shadow-root limit.

The special properties of the event are known as the `EventInit` standard, you can find more details in the [attached documentation](https://developer.mozilla.org/en-US/docs/Web/API/Event/Event).

#### Prop.value

Atomico allows definition of values for prop defects.

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

### Effects of props mutation

```javascript
let node = document.querySelector("custom-element");

node.checked = true;

node.checked = !node.checked;
```

Atomic groups the updates to the DOM, so if you want to know the status of the DOM you should wait for the update to finish using the `updated` property.

```javascript
node.prop1 = 1;
node.prop2 = 2;
node.prop3 = 3;

await node.updated;

node.shadowRoot.querySelector("input");
```
