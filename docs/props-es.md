# Props

Atomico añade al web-component un sistema de tipos en tiempo de ejecucion, este permite interactuar con el web-component de formas intereantes.

### Observaciones de prototipo

Atomico nunca remplazara una propiedad definida previamente como prototipo del web-component

## Ejemplo avanzado de tipos

```jsx
function MyTag({ checked, toggle }) {
  return (
    <host>
      <button onclick={toggle}>toggle</button>
      {checked ? "😴" : "😃"}
    </host>
  );
}

MyTags.props = {
  checked: Boolean,
  toggle: {
    type: Function,
    value() {
      this.checked = !this.checked;
    }
  }
};
```
