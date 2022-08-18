import { Component, CreateElement } from "./component";

export type context<Value> = Component<
    { value: Value },
    { onUpdatedContext: Event }
>;

export type Context<Value> = CreateElement<context<Value>, HTMLElement> & {
    value: Value;
};

export type CreateContext = <Value>(value: Value) => Context<Value>;

export type UseContext = <AtomicoContext extends Context<any>>(
    context: AtomicoContext
) => AtomicoContext["value"];

export const useContext: UseContext;

export const createContext: CreateContext;
