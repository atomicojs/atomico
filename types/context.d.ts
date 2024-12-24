import { Atomico } from "./dom.js";
import { Ref } from "./hooks.js";

export type DispatchConnectContext = (detail: DetailConnectContext) => any;

export type DetailConnectContext = {
    id: Context<any>;
    connect(value: HTMLElement): void;
};

export type Context<Value> = Atomico<any>;

export type GetValueFromContext<CustomContext extends Context<any>> =
    CustomContext extends Context<infer Type> ? Type : unknown;

export type CreateContext = <Value>(value: Value) => Context<Value>;

export type UseContext = <AtomicoContext extends Context<any>>(
    context: AtomicoContext
) => GetValueFromContext<AtomicoContext>;

export type UseProvider = <CustomContext extends Context<any>>(
    id: CustomContext,
    value: GetValueFromContext<CustomContext>
) => void;

export type ReturnUseConsumer<Value> = Value;

export type UseConsumer = (id: Context<any>) => any;

export const useContext: UseContext;

export const useProvider: UseProvider;

export const createContext: CreateContext;
