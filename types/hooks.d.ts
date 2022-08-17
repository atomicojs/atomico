import { EventInit } from "./schema";

/**
 * UseState
 */

type StateValue<Value> = Value extends (value?: any) => infer InferValue
    ? InferValue
    : Value;

type ReturnUseState<Value> = [
    StateValue<Value>,
    (value: StateValue<Value>) => void
];

export type UseState = <OptionalInitialState = any>(
    initialState?: OptionalInitialState
) => ReturnUseState<OptionalInitialState>;

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
export type UseCallback = <CallbackMemo extends () => any>(
    callback: CallbackMemo,
    args?: any[]
) => CallbackMemo;

/**
 * UseEvent
 */
export type UseEvent = (
    eventType: string,
    options?: Omit<EventInit, "type">
) => () => boolean;

/**
 * UseProp
 */
export type UseProp = <T>(eventType: string) => [T, (value: T) => void];

/**
 * UseHook
 */
export type UseHook = <Render extends (arg?: any) => any>(
    render: Render,
    layoutEffect?: () => ReturnType<Render>,
    effect?: () => ReturnType<Render>
) => ReturnType<Render>;

/**
 * UseRef
 */
export type UseRef = <Current = any>(
    current?: Current
) => Current extends undefined ? { current?: Current } : { current: Current };

export type UseHost = <Current>() => { current: Current };

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
    InitState extends any,
    Init extends (state: InitState) => any
>(
    reducer: Reducer,
    initArg?: InitState,
    init?: Init
) => [
    Init extends (initState?: any) => infer R
        ? UseReducerGetState<Reducer, InitState> | R
        : UseReducerGetState<Reducer, InitState>,
    (
        actions: Reducer extends (state: any, actions: infer Actions) => any
            ? Actions
            : any
    ) => void
];
