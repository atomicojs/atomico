/**
 * @todo infer the return of value to set the types of the props
 * @todo validate the infer of value in the c function
 * @todo improve types for JSX
 */
/**
 * @see https://www.w3.org/TR/wai-aria-1.1/#state_prop_def
 */
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

interface HTMLProps {
    style: string | Partial<CSSStyleDeclaration> | object;
    class: string;
    id: string;
    slot: string;
    is: string;
    tabindex: string | number;
    role: string;
    shadowDom: boolean;
    width: string | number;
    height: string | number;
    children: any;
    [indes: string]: any;
}

type Tag<T = object> = Partial<GlobalEventHandlers> &
    Partial<AriaAttrs> &
    Partial<HTMLProps> &
    Partial<
        Omit<
            T,
            "style" | "children" | "width" | "height" | "viewBox" | "transform"
        >
    >;

type SVGMapElements = Omit<SVGElementTagNameMap, "a">;

/**@todo associate to specific constructor */
interface SVGProps {
    d: string | number; //path
    x: string | number;
    y: string | number;
    r: string | number;
    cx: string | number;
    cy: string | number;
    x1: string | number;
    x2: string | number;
    y1: string | number;
    y2: string | number;
    systemLanguage: string; // switch
    fill: string;
    gradientTransform: string; // linearGradient
    offset: string; // linearGradient
    points: string | number[];
}

type SVGElementsTagMap = {
    [K in keyof SVGMapElements]: Omit<SVGMapElements[K], keyof SVGProps> &
        SVGProps;
};

type TagMaps = HTMLElementTagNameMap &
    SVGElementsTagMap &
    HTMLElementDeprecatedTagNameMap & {
        host: Tag<{ shadowDom: boolean }>;
    };

/**
 * The behavior of the Vdom is not strict, so you opt for a dynamic statement
 */
interface Vdom<T, P> {
    type: T;
    props: P;
    children: any[];
    readonly key?: any;
    readonly shadow?: boolean;
    readonly raw?: boolean;
}

declare module "atomico/html" {
    export function html(
        strings: TemplateStringsArray,
        ...values: any[]
    ): Vdom<any, any>;

    export default html;
}

declare module "atomico" {
    type TypeAny = null;
    /**
     * Types supported by Atomico.
     */
    type Types =
        | TypeAny
        | typeof Number
        | typeof String
        | typeof Boolean
        | typeof Promise
        | typeof Object
        | typeof Array
        | typeof Symbol
        | typeof Function;

    type SetState<T> = (value: T | ((value: T) => T)) => T;

    type TypesForReflect =
        | typeof String
        | typeof Number
        | typeof Boolean
        | typeof Array
        | typeof Object;

    interface ObjectFill {
        [index: string]: any | null | undefined;
    }
    /**
     * Current will take its value immediately after rendering
     * The whole object is persistent between renders and mutable
     */
    interface Ref<T = HTMLElement> extends Object {
        current?: T;
    }

    type Callback<T> = (...args: any[]) => T;
    /**
     * Used to force the correct definition of the Shema.value
     */
    type FnProp<T> = (value: T) => T;
    /**
     * Type Builders Dictionary
     */
    type TypeConstructor<T> = T extends number
        ? NumberConstructor
        : T extends string
        ? StringConstructor
        : T extends boolean
        ? BooleanConstructor
        : T extends () => {}
        ? FunctionConstructor
        : T extends symbol
        ? SymbolConstructor
        : T extends Promise<any>
        ? PromiseConstructor
        : T extends any[]
        ? ArrayConstructor
        : T extends object
        ? ObjectConstructor
        : any;

    type ContructorType<T> = T extends typeof Number
        ? number
        : T extends typeof String
        ? string
        : T extends typeof Boolean
        ? boolean
        : T extends typeof Function
        ? (...args: any[]) => any
        : T extends typeof Symbol
        ? symbol
        : T extends typeof Promise
        ? Promise<any>
        : T extends typeof Array
        ? any[]
        : T extends typeof Object
        ? ObjectFill
        : any;

    type Reducer<T, A = object> = (state: T, action: A) => T;

    interface FunctionalComponent {
        (props?: ObjectFill | any): any;
        props?: SchemaProps;
    }

    export const Any: TypeAny;

    export type JSXIntrinsicElements = {
        [K in keyof TagMaps]: Tag<TagMaps[K]>;
    };

    export namespace h.JSX {
        interface IntrinsicElements extends JSXIntrinsicElements {
            [tagName: string]: any;
        }
    }

    export type JSXTag = Tag;

    export type EventInit = CustomEventInit<any> & { type: string };

    export interface SchemaValue<T = Types> {
        type: T;
        /**
         * customize the attribute name, escaping the Camelcase
         */
        attr?: string;
        /**
         * reflects the value of the property as an attribute of the customElement
         */
        reflect?: T extends TypesForReflect ? boolean : never;
        /**
         * Event to be dispatched at each change in property value
         */
        event?: EventInit;
        /**
         * default value when declaring the customElement
         */
        value?: T extends FunctionConstructor
            ? (...args: any[]) => any
            : T extends ArrayConstructor | ObjectConstructor
            ? FnProp<ContructorType<T>>
            : FnProp<ContructorType<T>> | ContructorType<T>;
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
    export type SchemaProps = {
        [x: string]:
            | Types
            | SchemaValue<typeof String>
            | SchemaValue<typeof Number>
            | SchemaValue<typeof Boolean>
            | SchemaValue<typeof Array>
            | SchemaValue<typeof Object>
            | SchemaValue<typeof Function>
            | SchemaValue<typeof Symbol>
            | SchemaValue<typeof Promise>;
    };

    export type Props<P> = {
        [K in keyof P]: P[K] extends SchemaValue
            ? P[K]["value"] extends () => infer R
                ? R
                : ContructorType<P[K]["type"]>
            : ContructorType<P[K]>;
    };
    /**@deprecated */
    export type Component<P = SchemaProps> = P extends SchemaProps
        ? {
              (props: ObjectFill): any;
              props?: P;
          }
        : {
              (props: P): any;
              props: {
                  [C in keyof P]:
                      | TypeConstructor<P[C]>
                      | SchemaValue<TypeConstructor<P[C]>>;
              };
          };

    /**
     * Create the customElement to be declared in the document.
     * ```js
     * import {c,h} from "atomico";
     * let myComponent = <host></host>
     * customElements.define("my-component",c(myComponent));
     * ```
     * @todo Add a type setting that doesn't crash between JS and template-string.
     */

    export function c<T = typeof HTMLElement>(
        component: FunctionalComponent,
        BaseElement?: T
    ): T;
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
    export function h<T = any, P = null>(
        type: T,
        props?: P,
        ...children: any[]
    ): Vdom<T, P>;

    /**
     *
     */
    export function render<T = Element>(
        vdom: Vdom<"host", any>,
        node: T,
        id?: string | symbol
    ): T;
    /**
     * dispatch an event from the custom Element
     * ```js
     * let dispatchChangeValue = useEvent("changeValue")
     * let dispatchChangeValueToParent = useEvent("changeValue", {bubbles:true})
     * ```
     */
    export function useEvent(
        type: String,
        eventInit?: Omit<EventInit, "type">
    ): (detail?: any) => boolean;
    export function useEvent<T>(
        type: string,
        eventInit?: Omit<EventInit, "type">
    ): (detail: T) => boolean;
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
    export function useProp<T = any>(prop: string): [T, SetState<T>];

    /**
     * create a private state in the customElement
     * ```js
     * let component = ()=>{
     *     let [ count, setCount ] = useState(0);
     *     return <host>{ count }</host>;
     * }
     * ```
     */
    export function useState<T>(initialState: T | (() => T)): [T, SetState<T>];
    export function useState<T>(): [T, SetState<T>];
    /**
     * Create or recover a persistent reference between renders.
     * ```js
     * let ref = useRef();
     * ```
     */
    export function useRef<T = any>(current?: T): Ref<T>;
    /**
     * Memorize the return of a callback based on a group of arguments,
     * the callback will be executed only if the arguments change between renders
     * ```js
     * let value = useMemo(expensiveProcessesCallback)
     * ```
     */
    export function useMemo<T = any, Args = any[]>(
        callback: () => T,
        args?: Args
    ): T;
    /**
     * Memorize the creation of a callback to a group of arguments,
     * The callback will preserve the scope of the observed arguments
     * ```js
     * let callback = useCallback((user)=>addUser(users, user),[users]);
     * ```
     */
    export function useCallback<T = any, Args = any[]>(
        callback: Callback<T>,
        args?: Args
    ): Callback<T>;
    /**
     * Evaluate the execution of a callback after each render cycle,
     * if the arguments between render do not change the callback
     * will not be executed, If the callback returns a function
     * it will be executed as an effect collector
     */
    export function useEffect<Args = any[]>(
        callback: () => void | (() => any),
        args?: Args
    ): void;
    /**
     * Lets you use the redux pattern as Hook
     */
    export function useReducer<T = any, A = object>(
        reducer: Reducer<T, A>,
        initialStaet?: T
    ): [T, (action: A) => void];
    /**
     * returns the host associated with the instance of the customElement
     */
    export function useHost(): Ref<HTMLElement>;
}
