export type Any = null;

export type Types =
    | Any
    | typeof Number
    | typeof String
    | typeof Boolean
    | typeof Object
    | typeof Array
    | typeof Promise
    | typeof Function;

export type PropValue = Types | Schema;

export interface Props {
    [prop: string]: PropValue;
}

export interface PropsParam<T>{
    readonly  [P in keyof T] ?: T[P]
}
/**
 * Interface del customElement
 */
export interface Component<P extends Props> {
    (props?: object): any;
    props?: P;
}
/**
 * Estructura como Objeto para la declaracion
 * de props asociadas al customElement.
 */
export interface Schema {
    type: Types;
    attr?: string;
    reflect?: boolean;
    event?: Event;
    value?: any;
}
/**
 * Register or create a customElement, eg:
 * ```js
 * // case 1
 * customElement("my-component",MyComponent)
 * // case 2
 * customElements.define("my-component", customElement(MyComponent));
 * ```
 */
export type customElement = <T>(
    nodeType,
    component?: Component
) => nodeType extends string ? void : typeof HTMLElement;

export interface Event {
    /**
     * type of event to dispatch
     */
    type: string;
    /**
     * indicating whether the event bubbles. The default is false.
     */
    bubbles?: boolean;
    /**
     * indicating whether the event can be cancelled. The default is false.
     */
    cancelable?: boolean;
    /**
     * indicating whether the event will trigger listeners outside of a shadow root.
     */
    composed?: boolean;
    /**
     * adds the detail property to the information of the emitted event
     */
    detail?: any;
}
