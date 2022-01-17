import { Atomico, AtomicoThis, DOMProps, JSXElements } from "./dom";

import {
    EventInit,
    ObjectFill,
    SchemaProps,
    ConstructorType,
    SchemaInfer,
} from "./schema";
import { Sheets } from "./css";

export { DOMEvent } from "./dom";
export { css, Sheet, Sheets } from "./css";
export { html } from "./html";

/**
 * Base callback for useState
 */
type SetState<Return> = (value: Return | ((value: Return) => Return)) => Return;
/**
 * Base callback for useReducer
 */
type Reducer<T, A = object> = (state: T, action: A) => T;

/**
 *
 */
type Callback<Return> = (...args: any[]) => Return;
/**
 * Identify whether a node in the list belongs to a fragment marker instance
 * @example
 * ```ts
 * [...element.childNodes].filter(child=>child instanceof Mark);
 * ```
 */
export interface Mark extends Text {}
/**
 * Current will take its value immediately after rendering
 * The whole object is persistent between renders and mutable
 */
export interface Ref<CurrentTarget = HTMLElement> extends ObjectFill {
    current?: CurrentTarget extends Atomico<any, any>
        ? InstanceType<CurrentTarget>
        : CurrentTarget;
}

/**
 * Infer the types from `component.props`.
 * @example
 * ```tsx
 * function component({value}: Props<typeof component.props >){
 *      return <host/>
 * }
 *
 * component.props = {value:Number}
 * ```
 */

type GetProps<P> = P extends { props: SchemaProps }
    ? GetProps<P["props"]>
    : P extends {
          readonly "##props"?: infer P;
      }
    ? P
    : {
          [K in keyof P]?: P[K] extends {
              value: infer V;
          }
              ? V extends () => infer T
                  ? T
                  : V
              : P[K] extends { type: infer T }
              ? ConstructorType<T>
              : ConstructorType<P[K]>;
      };

export type Props<P> = GetProps<P>;

export type VDomType = string | Node | null;

export type VDomProps<Props> = Props extends null
    ? ObjectFill
    : ObjectFill & Props;

export type VDomChildren<Children> = Children extends null
    ? any[]
    : Children extends any[]
    ? Children
    : Children[];
/**
 * Atomico virtual dom interface
 * @example
 * ```jsx
 * <host/>
 * ```
 */
export interface VDom<Type extends VDomType, Props = null, Children = null> {
    type: Type;
    props: VDomProps<Props>;
    children: VDomChildren<Children>;
    readonly key?: any;
    readonly shadow?: boolean;
    readonly raw?: boolean;
}

/**
 * Functional component validation
 */
export type Component<props = null> = props extends null
    ? {
          (props: ObjectFill): any;
          props?: SchemaProps;
          styles?: Sheets;
      }
    : props extends SchemaProps
    ? Component<Props<props>>
    : {
          (props: DOMProps<props>): any;
          props: SchemaInfer<props> & {
              readonly "##props"?: Partial<props>;
          };
          styles?: Sheets;
      };

export type CreateElement<C, Base> = C extends { props: infer P }
    ? Atomico<Props<Omit<P, "slot">>, Base>
    : Atomico<{}, Base>;
/**
 * Create the customElement to be declared in the document.
 * ```js
 * import {c,h} from "atomico";
 * let myComponent = <host></host>
 * customElements.define("my-component",c(myComponent));
 * ```
 * @todo Add a type setting that doesn't crash between JS and template-string.
 */

export function c<T = typeof HTMLElement, C = Component>(
    component: C,
    BaseElement?: T
): CreateElement<C, T>;

export namespace h.JSX {
    interface IntrinsicElements extends JSXElements {
        [tagName: string]: any;
    }
}
/**
 * virtualDOM constructors
 * @param type
 * @param props
 * @param children
 */
export function h<Type extends VDomType, Props = null, Children = null>(
    type: Type,
    props?: Props,
    ...children: Children[]
): VDom<Type, Props, Children>;
/**
 * VirtualDOM rendering function
 * @example
 * ```jsx
 * render(h("host"),document.querySelector("#app"))
 * render(<host/>,document.querySelector("#app"))
 * render(html`<host/>`,document.querySelector("#app"))
 * ```
 */
export function render<T = Element>(
    vdom: VDom<"host", any>,
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
export function useEvent<T = any>(
    type: String,
    eventInit?: Omit<EventInit, "type">
): UseEvent<T>;

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
export function useProp<T = any>(prop: string): UseProp<T>;
/**
 * create a private state in the customElement
 * ```js
 * let component = ()=>{
 *     let [ count, setCount ] = useState(0);
 *     return <host>{ count }</host>;
 * }
 * ```
 */
export function useState<T>(initialState: T | (() => T)): UseState<T>;
export function useState<T>(): UseState<T>;
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
    callback: (args: Args) => T,
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
    callback: (args: Args) => void | (() => any),
    args?: Args
): void;
/**
 * Evaluate the execution of a callback after each render cycle,
 * if the arguments between render do not change the callback
 * will not be executed, If the callback returns a function
 * it will be executed as an effect collector
 */
export function useLayoutEffect<Args = any[]>(
    callback: (args: Args) => void | (() => any),
    args?: Args
): void;
/**
 * Lets you use the redux pattern as Hook
 */
export function useReducer<T = any, A = object>(
    reducer: Reducer<T, A>,
    initialState?: T
): UseReducer<T, A>;
/**
 * return to the webcomponent instance for reference
 * @example
 * ```jsx
 * const ref = useHost();
 * useEffect(()=>{
 *    const {current} = ref;
 *    current.addEventListener("click",console.log);
 * });
 * ```
 */
export function useHost<Base = HTMLElement>(): UseHost<Base>;

/**
 * Generate an update request to the webcomponent.
 */
export function useUpdate(): () => void;

export interface options {
    sheet: boolean;
    ssr?: (element: AtomicoThis) => void;
}

export type UseProp<T> = [T, SetState<T>];

export type UseState<T> = [T, SetState<T>];

export type UseReducer<T, A> = [T, (action: A) => void];

export type UseEvent<T> = (detail?: T) => boolean;

export type UseHost<T> = Ref<T & AtomicoThis>;

export function template<T = Element>(vnode: any): T;
