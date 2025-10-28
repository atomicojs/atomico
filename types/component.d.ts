import { Atomico } from "./dom.js";
import {
    CustomType,
    EventProp,
    InferProps,
    SchemaComponentConfig,
    SchemaComponentGenericConfig,
    ShemaConfigEvent,
    Type
} from "./schema.js";

export interface EmptyProps {
    props: {};
}

/**
 * The event function creates a property as an event. This property will always be
 * received as a prop and can be used to dispatch custom events from the component.
 */
export function event<Detail = null, Config = ShemaConfigEvent<Detail>>(
    config?: Config
): EventProp<Detail>;

/**
 * `callback` allows you to create a function that will be received as a component
 * property and is expected to return a value. This serves as an alternative to using events,
 * enabling you to delegate logic to the parent component while allowing the child component to process that logic.
 */
export function callback<
    Type extends (...args: any[]) => any
>(): CustomType<Type>;

export interface View<Config extends SchemaComponentConfig> {
    (props: InferProps<Config["props"]>): any;
}

export type DefineConfig<Config> = Config extends SchemaComponentConfig
    ? Config
    : Config extends SchemaComponentGenericConfig
    ? Config & EmptyProps
    : EmptyProps;

export type C = <
    Config extends SchemaComponentConfig | SchemaComponentGenericConfig
>(
    view: View<DefineConfig<Config>>,
    config?: Config
) => Atomico<DefineConfig<Config>>;

export const c: C;
