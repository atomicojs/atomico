type CallbackReducer<T = any, S = any> = (state: T, action: S) => T;

type CallbackReducerState<
    R extends CallbackReducer
> = R extends CallbackReducer<infer T> ? T : never;

type CallbackSetState<T> = (value: T | (() => T)) => void;

type CallbackEffect = () => void | (() => void);

type CallbackDispatch = (value: any) => void;

type ArgumentList = ReadonlyArray<any>;

interface MutableRef<T> {
    [index: string]: any;
    current: T;
}

type PropTypes =
    | NumberConstructor
    | StringConstructor
    | BooleanConstructor
    | ObjectConstructor
    | DateConstructor
    | PromiseConstructor
    | SymbolConstructor;

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
     * const MyComponent:Component = (props)=><host/>;
     * ```
     */
    export interface Component {
        (props: { [index: string]: any }): any;
        props?: {
            [index: string]: PropTypes | PropSchema;
        };
        error?: Function;
    }

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
    export function useRef<T>(current?: T): MutableRef<T>;
    /**
     * Allows access to the component, without the need to declare the reference
     */
    export function useHost(): MutableRef<HTMLElement>;
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
    ): (event: Event | CustomEvent) => void;
}
