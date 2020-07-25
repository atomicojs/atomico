declare module "atomico" {
    namespace JSX {
        interface IntrinsicElements {
            host: Host;
        }
    }

    type Any = null;

    type Types =
        | Any
        | typeof Number
        | typeof String
        | typeof Boolean
        | typeof Promise
        | typeof Object
        | typeof Array
        | typeof Symbol
        | typeof Function;

    interface AriaAttrs {
        "aria-activedescendant": string;
        "aria-atomic": string;
        "aria-autocomplete": string;
        "aria-busy": string;
        "aria-checked": string;
        "aria-colcount": string;
        "aria-colindex": string;
        "aria-colspan": string;
        "aria-controls": string;
        "aria-current": string;
        "aria-describedby": string;
        "aria-details": string;
        "aria-disabled": string;
        "aria-dropeffect": string;
        "aria-errormessage": string;
        "aria-expanded": string;
        "aria-flowto": string;
        "aria-grabbed": string;
        "aria-haspopup": string;
        "aria-hidden": string;
        "aria-invalid": string;
        "aria-keyshortcuts": string;
        "aria-label": string;
        "aria-labelledby": string;
        "aria-level": string;
        "aria-live": string;
        "aria-modal": string;
        "aria-multiline": string;
        "aria-multiselectable": string;
        "aria-orientation": string;
        "aria-owns": string;
        "aria-placeholder": string;
        "aria-posinset": string;
        "aria-pressed": string;
        "aria-readonly": string;
        "aria-relevant": string;
        "aria-required": string;
        "aria-roledescription": string;
        "aria-rowcount": string;
        "aria-rowindex": string;
        "aria-rowspan": string;
        "aria-selected": string;
        "aria-setsize": string;
        "aria-sort": string;
        "aria-valuemax": string;
        "aria-valuemin": string;
        "aria-valuenow": string;
        "aria-valuetext": string;
    }

    interface DefaultHost {
        style: string | Partial<CSSStyleDeclaration>;
        class: string;
        id: string;
        tabindex: string | number;
        role: string;
        [indes: string]: any;
    }

    type VdomTypes = typeof Node | string;

    interface Vdom<T, P> {
        type: T;
        props: P;
        children: any[];
        readonly key?: any;
        readonly shadow?: boolean;
        readonly raw?: boolean;
    }

    export type Host = Partial<GlobalEventHandlers> &
        Partial<AriaAttrs> &
        Partial<DefaultHost>;

    export type EventInit = CustomEventInit<any> & { type: string };

    export interface Schema {
        type: Types;
        /**
         * customize the attribute name, escaping the Camelcase
         */
        attr?: string;
        /**
         * reflects the value of the property as an attribute of the customElement
         */
        reflect?: boolean;
        /**
         * default value when declaring the customElement
         */
        value?: any;
        /**
         * Event to be dispatched at each change in property value
         */
        event?: EventInit;
    }
    /**
     * Type to autofill the props object
     * ```ts
     * Component.props:Props = {
     *  myProp : Number
     *  myProp2 : { type : String, reflect: true }
     * }
     * ```
     */
    export interface Props {
        [x: string]: Types | Schema;
    }
    /**
     * Declares Atomico virtual-dom format and is used to build JSX
     * ```jsx
     * import {h} from "atomico";
     * // JS
     * const Component = ()=>h("host",{onclick(){ console.log("event") }}, "text...");
     * // JSX
     * const Component = ()=><host onclick={()=>{ console.log("event") }}>text...</host>;
     * ```
     */
    export function h<T, P>(type: T, props: P, ...children: any[]): Vdom<T, P>;
    /**
     * dispatch an event from the custom Element
     * ```js
     * let dispatchChangeValue = useEvent("changeValue")
     * let dispatchChangeValueToParent = useEvent("changeValue", {bubbles:true})
     * ```
     */
    export function useEvent(
        type: String,
        eventInit?: Omit<EventInit, "description">
    ): (detail: any) => boolean;
    /**
     * Similar to useState, but with the difference that useProp reflects the effect as component property
     * ```js
     * let component = ()=>{
     *     let [ myProp, setMyProp ] = useProp<string>("myProp");
     *     return <host>{ myProp }</host>;
     * }
     * component.props = { myProp : String }
     * ```
     */
    export function useProp<T = any>(prop: string): [T, (value: T) => T];
    /**
     * create a private state in the customElement
     * ```js
     * let component = ()=>{
     *     let [ count, setCount ] = useState<string>(0);
     *     return <host>{ count }</host>;
     * }
     * ```
     */
    export function useState<T = any>(
        initialState: T | (() => T)
    ): [T, (value: T) => T];
}
