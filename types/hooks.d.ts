import { AtomicoThis, Nullable } from "./dom.js";
import { ReturnValidityState } from "./internal/hooks.js";
import { SchemaEventInit, SchemaRecord } from "./schema.js";

type GetInitialState<InitialState> = InitialState extends (
    ...args: any[]
) => infer Value
    ? Value
    : InitialState;

export type State<State, SetState> = [State, SetState];

export type ElementTypes<Target = any> = Target extends abstract new (
    ...args: any
) => infer This
    ? This
    : Target;
/**
 * Current will take its value immediately after rendering
 * The whole object is persistent between renders and mutable
 */
export type Ref<Target = any> = {
    current?: ElementTypes<Target>;
};
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
    options?: Omit<SchemaEventInit, "type">
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
    render: Render
) => ReturnType<Render>;

/**
 * UseWhen
 */
export type UseWhen = (
    id: symbol | string,
    callback: (param?: any) => any
) => void;

/**
 * UseRef
 */
export type UseRef = <Target = any>(current?: Target) => Ref<Target>;

export type UseHost = <Target = AtomicoThis>() => Required<Ref<Target>>;

export type UseUpdate = () => () => void;

export type ReturnPromise<result> =
    | {
          pending: true;
          fulfilled?: false;
          rejected?: false;
          aborted?: false;
          result?: result;
          error?: unknown;
          startTime: number;
          endTime?: number;
      }
    | {
          fulfilled: true;
          result: result;
          error?: never;
          rejected?: false;
          aborted?: false;
          pending?: false;
          startTime: number;
          endTime: number;
      }
    | {
          rejected: true;
          pending?: false;
          fulfilled?: false;
          aborted?: false;
          result?: result;
          error: unknown;
          startTime: number;
          endTime: number;
      }
    | {
          aborted: true;
          result?: result;
          error: unknown;
          rejected?: false;
          pending?: false;
          fulfilled?: false;
          startTime: number;
          endTime: number;
      }
    | {
          rejected?: undefined;
          pending?: undefined;
          fulfilled?: undefined;
          aborted?: undefined;
          result?: undefined;
          error?: undefined;
          startTime?: undefined;
          endTime?: undefined;
      };

export type UsePromise = <Callback extends (...args: any[]) => Promise<any>>(
    callback: Callback,
    args: Parameters<Callback> extends [] ? any[] : Parameters<Callback>,
    options?: boolean | { autorun?: boolean; memo?: boolean }
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
    args: Parameters<Callback> extends [] ? any[] : Parameters<Callback>,
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

export type UseListener = (
    ref: Ref,
    type: string,
    listener: (event: unknown) => any,
    options?: AddEventListenerOptions | boolean
) => void;

export type UseSlot = <Target extends Node>(
    ref: Ref<HTMLSlotElement>,
    filter?: (child: Node) => boolean
) => ElementTypes<Target>[];

export type UseNodes = <Target extends Node>(
    filter?: (node: Node) => boolean
) => ElementTypes<Target>[];

/**
 * Generate a second render, this render escapes the current
 * one and is useful for collaborative work between LightDOM and shadowDOM
 */
export type UseRender = (callback: () => any, args?: any[]) => void;

export type UseFormSubmit = (
    callback: (form: HTMLFormElement) => void,
    options?: AddEventListenerOptions
) => void;

export type UseFormAssociated = (
    callback: (form: HTMLFormElement) => void
) => void;

export type UseFormDisabled = (callback: (disabled: boolean) => void) => void;

export type UseFormReset = (callback: () => void) => void;

export type UseInternals = () => ElementInternals;

export type UseFormValue = (
    prop: string
) => [string, (state: string | boolean | number) => void];

export type UseFormValidity = (
    callback: () => ReturnValidityState,
    args: any[]
) => [string, ValidityState];

export type UseFormProps = <T = any>(
    propName?: string,
    propValue?: string
) => ReturnUseProp<T>;

export type UseParent = <Element extends string | typeof HTMLElement>(
    element: Element,
    composed?: boolean
) => Ref<Element extends HTMLElement ? Element : HTMLElement>;

export type SetObjectState<State> = (
    state: Partial<State> | ((reduce: State) => Partial<State>)
) => void;

export type UseObjectState = <State extends SchemaRecord = SchemaRecord>(
    initialState?: State
) => [State, SetObjectState<State>];

