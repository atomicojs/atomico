# Atomico

Atomico es una pequeña librería experimental, posee una muy pequeña implementación del **virtual-dom**, utiliza **Jsx**, su ciclo de vida se basa en **CustomElements** y **CustomEvents**

```js
import {h, Component, register} from "atomico";

register(
   "tag",
   class extends Component{
       static get props(){
           return ["title"]
       }
       // Cuando el componente está montado en el Dom
       onMount(event){
          
       }
       // Cuando el componente se desmonta en el Dom
       onUnmount(event){

       }
       // Cuando el componente recibe nuevas propiedades del Dom
       onUpdate(event){
          
       }
       render(){
           return <div>
               {this.props.title}
           </div>
       }
   }   
)
```

## Eventos

**Atomico** captura los eventos en la iniciación del componente, para ello ud debe definirlos como métodos propios del prototipo y anteponer al nombre del método el patron `^/on[A-Z]/`, ejemplo **onMount**, **onClick** y **onMousemove**.

Si ud busca escuchar eventos de forma externa solo use `addEventListener(event,handler)` sobre el componente.

## Ciclo de vida

El ciclo de vida de **Atomico** es simple y posee 3 estados, todos ellos son despachados como eventos, por lo que ud puede conocer los cambios tanto de forma interna como externa al componente.

> Todo evento por defecto genera una actualización de la vista, para evitar esta actualización solo utilize `event.preventDefault()`, esto evitara que **Atomico** actualice la vista.

### onMount( CustomEvent )

Cuando el componente es montado en el documento se despacha el evento **mount**.

### onUnmount( CustomEvent )

Cuando el componente es desmontado del documento.

### onUpdate( CustomEvent )

Cuando el componente posee mutaciones de atributos. ud puede conocer estos cambios mediante la propiedad `event.detail`.