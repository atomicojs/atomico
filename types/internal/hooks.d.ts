import { ReturnUseState, ReturnUseSuspense } from "hooks";

export type Effect = (state: any, unmounted?: boolean) => any;

export type Hook = {
    value?: any;
    effect?: Effect;
    tag?: symbol | string | number;
};

/**
 * Map of states associated with an increasing position
 */
export type Hooks = {
    [i: number]: Hook;
};

export type SCOPE = {
    i: number;
    id: number | string;
    hooks: Hooks;
    host: any;
    update: any;
};

export type Load = <Callback extends () => any>(
    callback: Callback
) => ReturnType<Callback>;

/**
 * clean all useEffects
 */
export type CleanUseEffects = () => void;

/**
 * clean all useLayoutEffect
 */
export type CleanUseLayoutEffects = () => CleanUseEffects;

/**
 * allows to clean the effects step by step,
 * first execution of the callback cleans the useInsertionEffect,
 * second execution of return of the previous callback cleans the useLayoutEffect and
 * the last execution of the previous return cleans the useEffect
 */
export type CleanEffects = (unmounted?: boolean) => CleanUseLayoutEffects;

export type CreateHooks = (
    update?: () => any,
    host?: any,
    id?: number | string
) => {
    load: Load;
    cleanEffects: CleanEffects;
    isSuspense: () => boolean;
};

export type CollectorCallback = (() => {}) | null | true;

export type CollectorArgs = any[];

export type CollectorEffect = (
    params?: [CollectorCallback, CollectorArgs] | []
) => [CollectorCallback, CollectorArgs];

export type UseAnyEffect<Arg = any> = <Effect extends () => void | (() => any)>(
    effect: Effect,
    args?: Arg[]
) => void;

export type ReturnSetStateUseSuspense = ReturnUseState<ReturnUseSuspense>;
