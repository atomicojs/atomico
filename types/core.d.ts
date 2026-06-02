import { JSXElements } from "./dom.js";

import * as Hooks from "./hooks.js";
import { H, Render, VNodeRender } from "./vnode.js";

export { c, event, callback } from "./component.js";
export { createContext, useContext, useProvider } from "./context.js";
export { css, Sheet, Sheets } from "./css.js";
export { DOMEvent, DOMListener, JSX } from "./dom.js";
export * from "./errors.js";
export * from "./hooks.js";
export * from "./schema.js";

/**
 * Identify whether a node in the list belongs to a fragment marker instance
 * ```ts
 * [...element.childNodes].filter(child=>child instanceof Mark);
 * ```
 */
export class Mark extends Text {}

export type CreateRef = <Current>(value?: Current) => Hooks.Ref<Current>;

export const createRef: CreateRef;

export namespace h.JSX {
    interface IntrinsicElements extends JSXElements {
        [tagName: string]: any;
    }
}
/**
 * function-pragma, create the vnode
 * this function is used by JSX transpilers
 * ```jsx
 * h("host", { id: "my-host" }, h("div", null, "Hello World"))
 * ```
 */
export const h: H;
/**
 * Alias for the function-pragma `h`
 * ```jsx
 * createElement("host", { id: "my-host" }, createElement("div", null, "Hello World"))
 * ```
 */
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
 * const MyComponent = c(()=>{
 *     const [ myProp, setMyProp ] = useProp<string>("myProp");
 *     return <host>{ myProp }</host>;
 * },{
 *     props: { myProp : String }
 * })
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
 * create a private object state in the customElement that merges updates automatically
 * ```js
 * function component(){
 *     const [ state, setState ] = useObjectState({ count: 0, title: "" });
 *     return <host>{ state.count }</host>;
 * }
 * ```
 */
export const useObjectState: Hooks.UseObjectState;


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

/**
 * This hook allows to manage asynchronous operations with support for cancellation
 * @param callback async function to be executed
 * @param args arguments that will trigger the re-execution of the async function
 * @example
 * ```tsx
 * function component() {
 *   const result = useAsync(async () => {
 *       const response = await fetch("./my-data");
 *       return await response.json();
 *   }, []);
 *   return <host>{JSON.stringify(result)}</host>;
 * }
 * ```
 */
export const useAsync: Hooks.UseAsync;

export const useAbortController: Hooks.UseAbortController;

/**
 * This hook allows you to observe all internal asynchronous processes,
 * enabling a unified loading state across all async components.
 * Useful for displaying loading screens while the rest of the interface
 * handles asynchronous operations.
 * ⚠️ useSuspense doesn’t prevent rendering — it simply allows you to overlay a layer to unify the loading state.
 * @example
 * ```tsx
 * const suspense = useSuspense();
 * return (
 *   <host>
 *      <Content />
 *      {suspense.pending &&  <LoadScreenComponent/>}
 *  </host>
 *  );
 *  ```
 */
export const useSuspense: Hooks.UseSuspense;

/**
 * Similar to useEffect, but the callback is executed before DOM mutations.
 * This is useful for reading layout from the DOM and synchronously re-rendering.
 */
export const useInsertionEffect: Hooks.UseInsertionEffect;

/**
 * Generate a unique id that remains constant throughout the component's lifecycle.
 * Useful for associating form elements with their labels or for any scenario
 * requiring a stable identifier.
 */
export const useId: Hooks.UseId;

/**
 * Register an event listener on a target element.
 * @param target - The target to which the event listener will be attached. It can be an EventTarget, a RefObject, or a function returning either.
 * @param type - The type of the event to listen for.
 * @param listener - The event listener function that will be called when the event is triggered.
 * @param options - Optional parameters for the event listener, such as capture, once, and passive.
 * ### Example
 * ```tsx
 * const ref = useRef();
 * useListener(ref, "click", (event) => {
 *    console.log("Element clicked!", event);
 * });
 */
export const useListener: Hooks.UseListener;

/**
 * Return the assigned nodes to a slot,
 * @param ref RefObject to slot element
 * @param filter Optional filter function to filter assigned nodes
 *
 * ### Example 1
 * ```tsx
 * const ref = useRef();
 * const slots = useSlot(ref);
 * ```
 * ### Example 2 - with Types and Filter
 * ```tsx
 * const ref = useRef();
 * const filter = (node)=>node instanceof HTMLImageElement;
 * const slots = useSlot<HTMLElementImage>(ref, filter);
 * ```
 */
export const useSlot: Hooks.UseSlot;

/**
 * Return the assigned nodes to a webcomponent, usefull when working with  manual slot assignment.
 * @param filter Optional filter function to filter assigned nodes
 * ### Example
 * ```tsx
 * const nodes = useNodes();
 *
 * <host shadowDom={{slotAssignment:"manual"}}>
 *  <ul>
 *      {nodes.map((el)=>(
 *          <li>
 *              <slot assignNode={el}/>
 *          </li>
 *      ))}
 *  </ul>
 * </host>
 * ```
 */
export const useNodes: Hooks.UseNodes;

/**
 * Render content in the light DOM from within the web component
 * @param render - callback that returns the vnode to be rendered in the light DOM
 * @param deps - dependencies that will trigger the re-rendering of the light DOM
 * ### Example - 1
 *
 * ```tsx
 * const label = "This button is in the light DOM, but it was rendered from within";
 * useRender(() => (
 *     <button>
 *        {label}
 *     </button>
 * ));
 * ```
 *
 * ### Example - 2 with dependencies
 *
 * ```tsx
 * const [counter, setCounter] = useState();
 * useRender(() => <button>{counter}</button>, [counter]);
 * ```
 */
export const useRender: Hooks.UseRender;

/**
 * Return the ElementInternals object associated with the custom element
 * This hook is primitive for working with form-associated custom elements
 */
export const useInternals: Hooks.UseInternals;

/**
 * Allows you to create a component-level state that can be exposed to a form.
 * ⚠️ Always keep in mind that by default, this hook assumes you’ve declared the `name` and `value` props.
 *
 * @param prop - name of the property to be associated with the form
 *
 * ### Example
 * ```tsx
 * const [ value, setValue ] = useFormValue("value");
 * ```
 * By default you can use the "name" and "value" props to associate with the form.
 */
export const useFormValue: Hooks.UseFormValue;

/**
 *
 */
export const useFormSubmit: Hooks.UseFormSubmit;

export const useFormValidity: Hooks.UseFormValidity;

export const useFormAssociated: Hooks.UseFormAssociated;

export const useFormDisabled: Hooks.UseFormDisabled;

export const useFormReset: Hooks.UseFormReset;

/**
 * This hook allows you to looking for the parent element.
 * @example
 * ```
 * // retrieves the first div element that this hook finds.
 * const refDiv = useParent("div")
 *
 * // retrieve the first instance of Custom Element that this hook finds.
 * const refMyCustomElement = useParent(MyCustomElement)
 *
 * // The second parameter allows cross-inclusion of the Dom slot shadow from other components.
 * const refForm = useParent("form", true)
 * ```
 *
 */
export const useParent: Hooks.UseParent;

/**
 * This hook assumes that you’ve declared the name and value props, allowing it to communicate
 * its value to a form in a standard way — just like a native HTML input would.
 * @param prop - Optional, defaults to the `name` prop.
 * @param value - Optional, defaults to the `value` prop.
 * ### Example
 * ```tsx
 * const [ value, setValue ] = useFormValue("value");
 * ```
 */
export const useFormProps: Hooks.UseFormProps;

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
