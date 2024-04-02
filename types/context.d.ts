import { Atomico } from "./dom.js";
import { Ref } from "./hooks.js";

export type DispatchConnectContext = (detail: DetailConnectContext) => any;

export type DetailConnectContext = {
    id: Context<any>;
    connect(value: Ref): void;
};

export type Context<Value> = Atomico<
    {
        value: Value;
    },
    {
        value: Value;
    },
    HTMLElement
>;

export type GetValueFromContext<CustomContext extends Context<any>> =
    InstanceType<CustomContext>["value"];

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
