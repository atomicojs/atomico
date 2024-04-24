import { AtomicoElement, AtomicoThis, Nullable } from "./dom.js";
import { EventInit } from "./schema.js";

type GetInitialState<InitialState> = InitialState extends (
    ...args: any[]
) => infer Value
    ? Value
    : InitialState;

export type State<State, SetState> = [State, SetState];

/**
 * Current will take its value immediately after rendering
 * The whole object is persistent between renders and mutable
 */
export class Ref<Current = any> {
    current: Current extends AtomicoElement ? InstanceType<Current> : Current;
    readonly on: (fn: (value: Current) => any, id?: any) => () => void;
    [index: string | number | symbol]: any;
}
/**
 * wrapper for SetState
 */
export type SetState<State> = (
    state: State | ((reduce: State) => State)
) => void;

/**
 * Used by UseProp and UseState, construct return types
 */
export type ReturnUseState<Value> = State<Value, SetState<Value>>;

export type UseState = <OptionalInitialState = any>(
    initialState?: OptionalInitialState | (() => OptionalInitialState)
) => ReturnUseState<GetInitialState<OptionalInitialState>>;

type EffectCallback = () => void | (() => any);
/**
 * UseEffect
 */
export type UseEffect = <Args = any>(
    effect: EffectCallback,
    args?: Args[]
) => void;

/**
 * UseLayoutEffect
 */
export type UseLayoutEffect = UseEffect;

/**
 * UseLayoutEffect
 */
export type UseInsertionEffect = UseEffect;

/**
 * UseLayoutEffect
 */
export type UseRefEffect = (effect: EffectCallback, args: Ref<any>[]) => void;

/**
 * UseMemo
 */
export type UseMemo = <CallbackMemo extends () => any>(
    callback: CallbackMemo,
    args?: any[]
) => ReturnType<CallbackMemo>;

/**
 * UseCallback
 */
export type UseCallback = <CallbackMemo extends (...args: any[]) => any>(
    callback: CallbackMemo,
    args?: any[]
) => CallbackMemo;

/**
 * UseEvent
 */
export type UseEvent = <Detail = any>(
    eventType: string,
    options?: Omit<EventInit, "type">
) => (detail?: Detail) => boolean;

/**
 * UseProp
 */

type SetProp<State> = (
    state: Nullable<State> | ((reduce?: State) => Nullable<State>)
) => void;

/**
 * Used by UseProp and UseState, construct return types
 */
export type ReturnUseProp<Value> = State<
    Value | undefined,
    SetState<Value | undefined | null>
>;

export type UseProp = <T = any>(prop: string) => ReturnUseProp<T>;

/**
 * UseHook
 */
export type UseHook = <Render extends (arg?: any) => any>(
    render: Render,
    effect?: (
        value: ReturnType<Render>,
        unmounted: boolean
    ) => ReturnType<Render>,
    tag?: symbol
) => ReturnType<Render>;

/**
 * UseRef
 */
export type UseRef = <Current = any>(current?: Current) => Ref<Current>;

export type UseHost = <Current = AtomicoThis>() => Required<Ref<Current>>;

export type UseUpdate = () => () => void;

export type ReturnPromise<result> =
    | {
          pending: true;
          fulfilled?: false;
          rejected?: false;
          aborted?: false;
          result?: never;
      }
    | {
          fulfilled: true;
          result: result;
          rejected?: false;
          aborted?: false;
          pending?: false;
      }
    | {
          rejected: true;
          pending?: false;
          fulfilled?: false;
          aborted?: false;
          result?: unknown;
      }
    | {
          aborted: true;
          result: DOMException;
          rejected?: false;
          pending?: false;
          fulfilled?: false;
      }
    | {
          rejected?: undefined;
          pending?: undefined;
          fulfilled?: undefined;
          aborted?: undefined;
          result?: undefined;
      };

export type UsePromise = <Callback extends (...args: any[]) => Promise<any>>(
    callback: Callback,
    args: Parameters<Callback>,
    autorun?: boolean
) => ReturnPromise<Awaited<ReturnType<Callback>>>;

/**
 * UseReducer
 */
type UseReducerGetState<
    Reducer extends (arg: any, actions?: any) => any,
    InitState
> = InitState extends null | undefined
    ? ReturnType<Reducer>
    : ReturnType<Reducer> | InitState;

export type UseReducer = <
    Reducer extends (state: any, actions: any) => any,
    InitState extends ReturnType<Reducer>,
    Init extends (state: InitState) => ReturnType<Reducer>
>(
    reducer: Reducer,
    initArg?: InitState,
    init?: Init
) => [
    ReturnType<Reducer>,
    (
        actions: Reducer extends (state: any, actions: infer Actions) => any
            ? Actions
            : any
    ) => void
];

export type ReturnUseSuspense =
    | {
          pending: true;
          fulfilled?: false;
          rejected?: false;
          aborted?: false;
      }
    | {
          pending?: false;
          fulfilled: true;
          rejected?: false;
          aborted?: false;
      }
    | {
          pending?: false;
          fulfilled?: false;
          rejected?: true;
          aborted?: true;
      };

/**
 * @param fps - allows to delay in FPS the update of states
 */
export type UseSuspense = (fps?: number) => ReturnUseSuspense;

export type UseAsync = <Callback extends (...args: any[]) => Promise<any>>(
    callback: Callback,
    args: Parameters<Callback>
) => Awaited<ReturnType<Callback>>;

export type UseAbortController = <Args extends any[]>(
    args: Args
) => AbortController;

/**
 * Returns an ID as a string, this ID can have 2 prefixes
 * `s`erver and `c`lient
 * @example
 * ```tsx
 * const id = useId();
 * <input id={id}/>
 * ```
 */
export type UseId = () => string;
