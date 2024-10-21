import { AtomicoThis, DOMTag, DOMThis, JSXProxy } from "./dom";

export type SchemaFunction = (...args: any) => any;

export type SchemaConstructor = new (...args: any) => any;

export type SchemaEvent = {
    new (type: string, eventInitDict?: EventInit): Event;
};

export type SchemaPropType = SchemaFunction | SchemaConstructor;

export type SchemaPropConfig = {
    type: SchemaPropType;
    value?: () => any;
    event?: {
        type: string;
    } & EventInit & { base: SchemaEvent };
    reflect?: boolean;
};

export type ShemaProp = SchemaPropType | SchemaPropConfig;

export interface SchemaProps {
    [prop: string]: ShemaProp;
}

export interface SchemaConfig {
    props: SchemaProps;
}

export interface ShemaConfigEvent<Detail> extends EventInit {
    detail?: Detail;
    base?: SchemaEvent;
}

export type PropTypeFromType<Type extends SchemaPropType> =
    Type extends EventFunction<infer E>
        ? (detail: E) => boolean
        : Type extends Date
          ? Date
          : Type extends (...args: any[]) => infer R
            ? R
            : Type extends abstract new (...args: any[]) => infer R
              ? R
              : unknown;

export type PropType<Type extends SchemaPropConfig> = Type extends {
    value: () => infer R;
}
    ? R extends PropTypeFromType<Type["type"]>
        ? R
        : PropTypeFromType<Type["type"]>
    : PropTypeFromType<Type["type"]>;

export type Prop<Type extends ShemaProp> = Type extends SchemaPropConfig
    ? PropType<Type>
    : Type extends SchemaPropType
      ? PropType<{ type: Type }>
      : unknown;

export type KeyofPropsWithConfigValue<Props extends SchemaProps> = {
    [prop in keyof Props]-?: Props[prop] extends {
        value: any;
    }
        ? prop
        : never;
}[keyof Props];

export type KeyofPropsWithEvents<Props extends SchemaProps> = {
    [prop in keyof Props]-?: Props[prop] extends EventFunction<any>
        ? prop
        : never;
}[keyof Props];

export type InferPropsWithEvents<Props extends SchemaProps> = InferProps<
    Omit<Props, KeyofPropsWithEvents<Props>>
> & {
    [prop in KeyofPropsWithEvents<Props> as `on${string &
        prop}`]: Props[prop] extends EventFunction<infer Detail>
        ? (event: CustomEvent<Detail>) => any
        : unknown;
};

export type InferProps<Props extends SchemaProps> = {
    [prop in keyof Props]?: Prop<Props[prop]>;
} & {
    [prop in KeyofPropsWithConfigValue<Props>]: Prop<Props[prop]>;
};

export interface EventFunction<Detail> extends FunctionConstructor {
    type: FunctionConstructor;
    value: (detail: Detail) => boolean;
}

export function event<Detail, Config = ShemaConfigEvent<Detail>>(
    config: Config
): EventFunction<Detail>;

export interface View<Config extends SchemaConfig> {
    (props: InferProps<Config["props"]>): any;
}

export function c<Config extends SchemaConfig>(
    view: View<Config>,
    config?: Config
): Atomico<Config>;

export interface Atomico<Config extends SchemaConfig> extends HTMLElement {
    new (
        props?: JSXProxy<
            DOMTag<DOMThis<HTMLElement>, InferPropsWithEvents<Config["props"]>>,
            AtomicoThis<InferProps<Config["props"]>, HTMLElement>
        >
    ): AtomicoThis<InferProps<Config["props"]>, HTMLElement>;
}
