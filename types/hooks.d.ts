import { EventInit, FillObject } from "./schema";
import { AtomicoThis, Atomico, Nullable } from "./dom";

/**
 * Current will take its value immediately after rendering
 * The whole object is persistent between renders and mutable
 */
export interface Ref<Current = any> extends FillObject {
    current?: Current extends Atomico<any, any>
        ? InstanceType<Current>
        : Current;
}

/**
 * wrapper for SetState
 */
type SetState<State> = (state: State | ((reduce: State) => State)) => void;

/**
 * Used by UseProp and UseState, construct return types
 */
type ReturnUseState<Value> = [Value, SetState<Value>];

export type UseState = <OptionalInitialState = any>(
    initialState?: OptionalInitialState
) => ReturnUseState<
    OptionalInitialState extends (...args: any[]) => infer Value
        ? Value
        : OptionalInitialState
>;

/**
 * UseEffect
 */
export type UseEffect = <Effect extends () => void | (() => any)>(
    effect: Effect,
    args?: any[]
) => void;

/**
 * UseLayoutEffect
 */
export type UseLayoutEffect = UseEffect;

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
export type UseProp = <T>(
    eventType: string
) => T extends (...args: any[]) => any
    ? [Nullable<T>, (value: Nullable<T>) => Nullable<T>]
    : ReturnUseState<Nullable<T extends boolean ? boolean : T>>;

/**
 * UseHook
 */
export type UseHook = <Render extends (arg?: any) => any>(
    render: Render,
    layoutEffect?: (
        value: ReturnType<Render>,
        unmounted: boolean
    ) => ReturnType<Render>,
    effect?: (
        value: ReturnType<Render>,
        unmounted: boolean
    ) => ReturnType<Render>
) => ReturnType<Render>;

/**
 * UseRef
 */
export type UseRef = <Current = any>(current?: Current) => Ref<Current>;

export type UseHost = <Current = AtomicoThis>() => Required<Ref<Current>>;

export type UseUpdate = () => () => void;

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
