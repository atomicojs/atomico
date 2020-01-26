type NodeType = Function | Element | null | string;

type Children = any;

type CallbackReducer<T = any, S = any> = (state: T, action: S) => T;

type CallbackReducerState<
    R extends CallbackReducer
> = R extends CallbackReducer<infer T> ? T : never;

type CallbackSetState<T> = (value: T | (() => T)) => void;

type CallbackEffect = () => void | (() => void);

type CallbackDispatch = (value: any) => void;

type ArgumentList = ReadonlyArray<any>;

type VnodeValue = string | boolean | Function | null | undefined;

type PropTypes =
    | NumberConstructor
    | StringConstructor
    | BooleanConstructor
    | ObjectConstructor
    | PromiseConstructor
    | SymbolConstructor
    | FunctionConstructor;

interface MutableRef<T> {
    [prop: string]: any;
    current: T;
}

interface Props {
    [prop: string]: any;
}

interface Vnode<T = NodeType> extends Props {
    nodeType: T;
    children?: Children;
}

interface ComponentOptions {
    extends: string;
    waitFor?: string | string[];
}

interface VnodeHost extends Vnode {
    shadowDom?: boolean;
    styleSheet?: string | any[];
}

declare module "atomico" {
    /**
     * interface for the declaration of a custom event
     * ```tsx
     * let myEvent:EventInit = {bubbles:true, detail : "...!"}
     * ```
     */
    export interface EventInit {
        type?: any;
        detail?: any;
        bubbles?: boolean;
        cancelable?: boolean;
        composed?: boolean;
    }
    /**
     * interface to declare Objects as PropSchema, eg
     * ```ts
     * let myProp:PropSchema<number> = {
     *    type : Number,
     *    options : [1,2,10],
     *    value:10
     * }
     * ```
     */
    export interface PropSchema<T = any> {
        type: PropTypes;
        options?: T[];
        value?: T | (() => T);
        reflect?: boolean;
        event?: boolean | EventInit;
    }
    /**
     * interface for the declaration of a component
     * ```tsx
     * const MyComponent = () => <host />;
     *
     * MyComponent.props = {
     *   myString: String,
     *   myBoolean: Boolean,
     *   myNumber: Number,
     *   myObject: Object,
     *   myArray: Array,
     *   myFunction: Function,
     *   myPromise: Promise,
     *   mySymbol: Symbol
     * };
     *
     * MyComponent.error = customDebugError;
     * ```
     */
    export interface Component {
        (props: Props): VnodeHost | Vnode | Vnode[];
        props?: {
            [prop: string]: PropTypes | PropSchema;
        };
        error?: Function;
    }
    /**
     * create a valid vnode for Atomico
     * ```tsx
     * h("h1",{class:"my-style"}, ...children )
     * ```
     */
    export function h(
        nodeType: NodeType,
        props: Props,
        ...children: Children
    ): Vnode;
    /**
     * render the virtual-dom in a target
     * ```tsx
     * render(<host>...</host>, document.querySelector("#app"))
     * ```
     */
    export function render<T>(
        vnode: Vnode | Vnode[] | VnodeValue,
        target: T,
        id?: string | Symbol
    ): T;
    /**
     * Returns an html element to define using `customElements.define`, eg:
     * ```js
     * customElements.define("my-component", customElement(MyComponent))
     * ```
     */
    export function customElement(component: Component): Element;
    /**
     * register a component in the document and return a function for
     * anonymous invocation or tree-shaking in favor of JSX, eg:
     * ```jsx
     * JSXMyComponent = customElement("my-component",MyComponent)
     *
     * function OtherComponent(){
     *     return <host> <JSXMyComponent/> </host>
     * }
     * ```
     */
    export function customElement<T>(
        type: T,
        component: Component,
        options?: ComponentOptions
    ): () => Vnode<T>;

    export function useProp<T>(index: string): [T, CallbackSetState<T>];
    /**
     * Create a local state in the web-component
     */
    export function useState<T>(state: T): [T, CallbackSetState<T>];
    /**
     * Allows you to create side effects, useful for controlling effects that
     * interactive with the DOM or asynchrony
     */
    export function useEffect(callback: CallbackEffect): void;
    /**
     * Create a reference
     */
    export function useRef<T = Element>(current?: T): MutableRef<T>;
    /**
     * Allows access to the component, without the need to declare the reference
     */
    export function useHost(): MutableRef<Element>;
    /**
     * Memorize the return of a callback by limiting its execution through an array of arguments,
     * the callback is executed at the time of rendering only if the arguments change
     */
    export function useMemo<T>(callback: () => T, args: ArgumentList): T;
    /**
     * Allows memorizing the callback based on the second parameter, has an effect similar to useMemo
     */
    export function useCallback<T extends (...args: any[]) => any>(
        callback: T,
        args: ArgumentList
    ): T;
    /**
     * An alternative to useState. Accept a reduce and return the current state paired with a dispatch method.
     */
    export function useReducer<R extends CallbackReducer, S>(
        reducer: R,
        initialState?: S | CallbackReducerState<R>
    ): [CallbackReducerState<R>, CallbackDispatch];
    /**
     * Allows a variable or function to be visible from the component
     */
    export function usePublic<T>(name: string, value: T): T;
    /**
     * Returns a callback that dispatches an event from the component
     */
    export function useEvent(
        name: string,
        config?: EventInit
    ): (detail?: any) => void;
}

declare module "atomico/use-lazy" {
    type LAZY_STATE_LOADING = "loading";
    type LAZY_STATE_ERROR = "error";
    type LAZY_STATE_DONE = "done";

    export const LAZY_STATE_LOADING = "loading";

    export const LAZY_STATE_ERROR = "error";

    export const LAZY_STATE_DONE = "done";
    /**
     *  allows to execute an asynchronous process as a hook
     * ```jsx
     * let [loadComponent, setloadComponent] = useState(false);
     * let [state, result] = useLazy(() => import("./component.js"), loadComponent);
     *
     * return (
     *   <host onclick={() => setloadComponent(true)}>
     *     state: {state} result: {result}
     *   </host>
     * );
     * ```
     */
    export function useLazy(
        callback: () => Promise<any>,
        run: boolean,
        initWithLoading?: boolean
    ): [
        LAZY_STATE_LOADING | LAZY_STATE_ERROR | LAZY_STATE_DONE | undefined,
        any
    ];
}

declare module "atomico/html" {
    /**
     * Virtual-dom through template string, thanks to the library [HTM](https://github.com/developit/htm)
     * ```js
     * html`
     *  <host shadowDom onclick=${handler}>
     *    ${children}
     *    <h1>...</h1>
     *  </host>
     * `;
     * ```
     */
    export function html(
        template: TemplateStringsArray,
        ...values: Vnode[] | VnodeValue[]
    ): Vnode | Vnode[];
    export default html;
}
