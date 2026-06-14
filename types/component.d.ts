import { Atomico } from "./dom.js";
import {
    CustomType,
    EventProp,
    InferProps,
    SchemaComponentConfig,
    SchemaComponentGenericConfig,
    EventConfig
} from "./schema.js";

export interface EmptyProps {
    props: {};
}

/**
 * ## event
 * The event function allows you to create an event-type prop, enabling full JSX autocomplete and providing an event dispatcher directly through the prop.
 * ```tsx
 * const MyComponent = c(
 *    (props) => (
 *        <host>
 *            <button onclick={() => props.myEvent()}>custom event!</button>
 *        </host>
 *    ),
 *    { props: { myEvent: event() } }
 * );
 * ```
 * **where**
 * 1. `{ props: { myEvent: event() } }`: declares the event
 * 2. `onclick={() => props.myEvent()}`: dispatches the event from the rendering scope. This prop is a wrapper, aiming to provide an API similar to Element.click().
 *
 * ## Types and Params
 * ```tsx
 * type CustomDetail = {id: number};
 * event<CustomDetail>({composed: true, bubbles:true, cancelable: true });
 * ```
 * Thanks to the typescript, you can work strong types on the event instance
 */
export function event<Detail = null, Config = EventConfig<Detail>>(
    config?: Config
): EventProp<Detail>;

/**
 * the `callback` function allows you to create a function that will be received as a component
 * property and is expected to return a value. This serves as an alternative to using events,
 * enabling you to delegate logic to the parent component while allowing the child component to process that logic.
 */
export function callback<
    Type extends (...args: any[]) => any
>(): CustomType<Type>;

export function type<T>(value: any): CustomType<T>;

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
