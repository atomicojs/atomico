import { Component, CreateElement } from "./component.js";

export type DispatchConnectContext = (detail: DetailConnectContext) => any;

export type DetailConnectContext = {
    id: Context<any>;
    connect(value: Context<any>): void;
};

export type ComponentContext<Value> = Component<
    { value: Value },
    { onUpdatedContext: Event }
>;

export type Context<Value> = CreateElement<
    ComponentContext<Value>,
    HTMLElement
> & {
    value: Value;
};

export type CreateContext = <Value>(value: Value) => Context<Value>;

export type UseContext = <AtomicoContext extends Context<any>>(
    context: AtomicoContext,
) => AtomicoContext["value"];

export const useContext: UseContext;

export const createContext: CreateContext;

export type UseProvider = (id: Context<any>, value: any) => void;

export type ReturnUseConsumer<Value> = Value;

export type UseConsumer = (id: Context<any>) => any;
