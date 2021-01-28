import { TagMaps } from "./types/dom";

import {
    EventInit,
    ObjectFill,
    SchemaValue,
    SchemaProps,
    ContructorType,
} from "./types/schema";

/**
 * Base callback for useState
 */
type SetState<Return> = (value: Return | ((value: Return) => Return)) => Return;
/**
 * Base callback for useReducer
 */
type Reducer<T, A = object> = (state: T, action: A) => T;

/**
 * Current will take its value immediately after rendering
 * The whole object is persistent between renders and mutable
 */
interface Ref<CurrentTarget = HTMLElement> extends ObjectFill {
    current?: CurrentTarget;
}
/**
 *
 */
type Callback<Return> = (...args: any[]) => Return;
/**
 * Used to force the correct definition of the Shema.value
 */
type FunctionSchemaValue<T> = (value: T) => T;

export type Props<P> = {
    [K in keyof P]: P[K] extends SchemaValue
        ? P[K]["value"] extends () => infer R
            ? R
            : ContructorType<P[K]["type"]>
        : ContructorType<P[K]>;
};

/**
 * Type for TS declaring Any
 * @example
 * ```js
 * components.props = {
 *  anyValue : Any,
 *  anyValue : { type: Any },
 * }
 * ```
 */
export type Any = null;

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
export interface Component {
    (props?: ObjectFill | any): any;
    props?: SchemaProps;
}
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
    component: Component,
    BaseElement?: T
): T;

export namespace h.JSX {
    interface IntrinsicElements extends TagMaps {
        [tagName: string]: any;
    }
}
/**
 * Context inherited by the Atomico setup
 */
export interface HostContext {
    updated: Promise<void>;
    unmounted: Promise<void>;
    readonly symbolId: unique symbol;
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
    initialStaet?: T
): [T, (action: A) => void];
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
export function useHost<Base = HTMLElement>(): Ref<Base & HostContext>;
