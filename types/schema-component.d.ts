export type SchemaFunction = (...args: any) => any;

export type SchemaConstructor = new (...args: any) => any;

export type SchemaEvent = {
    new (type: string, eventInitDict?: EventInit): Event;
};

export type SchemaRecord = Record<any, any>;

export type SchemaSerializable =
    | StringConstructor
    | BooleanConstructor
    | NumberConstructor
    | ArrayConstructor
    | ObjectConstructor
    | DateConstructor;

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

export interface SchemaComponentConfig {
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

export type KeyofAttrsFromProps<Props extends SchemaProps> = {
    [prop in keyof Props]-?: Props[prop] extends SchemaPropConfig
        ? Props[prop]["type"] extends SchemaSerializable
            ? CamelToKebab<prop>
            : never
        : Props[prop] extends SchemaSerializable
          ? CamelToKebab<prop>
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

export type CamelToKebab<S> = S extends `${infer T}${infer U}`
    ? `${T extends Lowercase<T> ? "" : "-"}${Lowercase<T>}${CamelToKebab<U>}`
    : S;

export type InferAttrsFromProps<Props extends SchemaProps> = Record<
    Exclude<KeyofAttrsFromProps<Props>, keyof Props>,
    string
>;

export type InferProps<Props extends SchemaProps> = {
    [prop in keyof Props]?: Prop<Props[prop]>;
} & {
    [prop in KeyofPropsWithConfigValue<Props>]: Prop<Props[prop]>;
};

export interface EventFunction<Detail> extends FunctionConstructor {
    type: FunctionConstructor;
    value: (detail: Detail) => boolean;
}
