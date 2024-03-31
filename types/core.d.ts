import { JSXElements } from "./dom.js";

import { TypeCustom, TypeToConstructor } from "./schema.js";

import * as Hooks from "./hooks.js";
import { H, Render, VNodeRender } from "./vnode.js";

export { Component, Host, Props, c } from "./component.js";
export { createContext, useContext, useProvider } from "./context.js";
export { Sheet, Sheets, css } from "./css.js";
export {
    AtomicoElement,
    DOMEvent,
    DOMListener,
    JSX,
    JSXElement
} from "./dom.js";
export * from "./errors.js";
export * from "./hooks.js";
export { html } from "./html.js";

/**
 * Identify whether a node in the list belongs to a fragment marker instance
 * ```ts
 * [...element.childNodes].filter(child=>child instanceof Mark);
 * ```
 */
export class Mark extends Text {}

export type Type<Types> = TypeToConstructor<Types> & { meta?: Types };

export type CreateRef = <Current>(value?: Current) => Hooks.Ref<Current>;

export const createRef: CreateRef;

export namespace h.JSX {
    interface IntrinsicElements extends JSXElements {
        [tagName: string]: any;
    }
}
/**
 * function-pragma, create the vnode
 */
export const h: H;
export const createElement: H;

/**
 * Function as tag fragment identifier
 */
export const Fragment: (props: { children?: any }) => any;

/**
 * VirtualDOM rendering function
 * ```jsx
 * render(h("host"),document.querySelector("#app"))
 * render(<host/>,document.querySelector("#app"))
 * render(html`<host/>`,document.querySelector("#app"))
 * ```
 */
export const render: Render;

/**
 * dispatch an event from the custom Element.
 * ###  Usage
 * ```js
 * const dispatchChangeValue = useEvent("changeValue")
 * const dispatchChangeValueToParent = useEvent("changeValue", {bubbles:true})
 * ```
 *
 * By using typescript you can define the type as a parameter for the dispatch to be created by useEvent, example::
 *
 * ```tsx
 * const dispatch = useEvent<{id: string}>("changeValue", {bubbles:true});
 *
 * function handler(){
 *      dispatch({id:10}) // Typescript will check the dispatch parameter
 * }
 * ```
 */
export const useEvent: Hooks.UseEvent;

/**
 * Similar to useState, but with the difference that useProp reflects the effect as component property
 * ```js
 * function component(){
 *     const [ myProp, setMyProp ] = useProp<string>("myProp");
 *     return <host>{ myProp }</host>;
 * }
 *
 * component.props = { myProp : String }
 * ```
 */
export const useProp: Hooks.UseProp;

/**
 * create a private state in the customElement
 * ```js
 * function component(){
 *     const [ count, setCount ] = useState(0);
 *     return <host>{ count }</host>;
 * }
 * ```
 */
export const useState: Hooks.UseState;

/**
 * Create or recover a persistent reference between renders.
 * ```js
 * const ref = useRef();
 * ```
 */
export const useRef: Hooks.UseRef;

/**
 * Memorize the return of a callback based on a group of arguments,
 * the callback will be executed only if the arguments change between renders
 * ```js
 * const value = useMemo(expensiveProcessesCallback)
 * ```
 */
export const useMemo: Hooks.UseMemo;

/**
 * Memorize the creation of a callback to a group of arguments,
 * The callback will preserve the scope of the observed arguments
 * ```js
 * const callback = useCallback((user)=>addUser(users, user),[users]);
 * ```
 */
export const useCallback: Hooks.UseCallback;
/**
 * Evaluate the execution of a callback after each render cycle,
 * if the arguments between render do not change the callback
 * will not be executed, If the callback returns a function
 * it will be executed as an effect collector
 */
export const useEffect: Hooks.UseEffect;

/**
 * Evaluate the execution of a callback after each render cycle,
 * if the arguments between render do not change the callback
 * will not be executed, If the callback returns a function
 * it will be executed as an effect collector
 */
export const useLayoutEffect: Hooks.UseLayoutEffect;

/**
 * Evaluate the execution of a callback after each render cycle,
 * if the arguments between render do not change the callback
 * will not be executed, If the callback returns a function
 * it will be executed as an effect collector
 */
export const useRefEffect: Hooks.UseRefEffect;

/**
 * Lets you use the redux pattern as Hook
 */
export const useReducer: Hooks.UseReducer;

/**
 * return to the webcomponent instance for reference
 * ```jsx
 * const ref = useHost();
 * useEffect(()=>{
 *    const {current} = ref;
 *    current.addEventListener("click",console.log);
 * });
 * ```
 */
export const useHost: Hooks.UseHost;

/**
 * Generate an update request to the webcomponent.
 */
export const useUpdate: Hooks.UseUpdate;

/**
 * This hook is low level, it allows to know the render cycles of the hooks
 * @param render - callback that runs between renders
 * @param layoutEffect - callback that is executed after rendering
 * @param effect - callback that is executed after layoutEffect
 */
export const useHook: Hooks.UseHook;

/**
 * This hook allows to observe the state of a promise
 *
 * @param callback promise to observe, preferably static
 * @param args arguments to restart the execution of the promise
 * @param autorun optional, allows to condition the execution of the promise before a boolean,  por defecto `true`
 *
 * @example
 * ```tsx
 * const getId = (id: number)=>{
 *      if(!id) return;
 *      return fetch("./my-data").then((res)=>res.json());
 * }
 *
 * function component({id}){
 *      const promise = usePromise(getId,[id]);
 *
 *      return <host>
 *         { promise.fulfilled
 *              ? <h1>{promise.result.name}</h1>
 *              : promise.pending && <h1>Loading...</h1> }
 *      </host>;
 * }
 * ```
 */
export const usePromise: Hooks.UsePromise;

export const useAsync: Hooks.UseAsync;

export const useAbortController: Hooks.UseAbortController;

export const useSuspense: Hooks.UseSuspense;

export const useInsertionEffect: Hooks.UseInsertionEffect;

export const useId: Hooks.UseId;

export interface Options {
    sheet: boolean;
    ssr?: boolean;
    render?: VNodeRender;
}

/**
 * customize Atomico behavior for non-browser environments,
 * example SSR in node
 */
export const options: Options;

/**
 * Create a template to reuse as a RAW node, example:
 * ```tsx
 * const StaticNode = template(<svg>...</svg>);
 *
 * function component(){
 *      return <host>
 *          <StaticNode cloneNode></StaticNode>
 *      </host>
 * }
 * ```
 */
export function template<T = Element>(vnode: any): T;

/**
 * Allows to declare the simple type of the Any type.
 */
export const Any: null;

export function createType<
    Type,
    Map extends (...args: any[]) => any = (...args: any[]) => Type,
    ToString = (value: ReturnType<Map>) => string
>(map: Map, toString?: ToString): TypeCustom<Map>;
