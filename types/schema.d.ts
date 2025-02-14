import { Sheets } from "./css.js";

export type SchemaFunction = (...args: any) => any;

export type SchemaConstructor = new (...args: any) => any;

export type SchemaEvent = {
    new (type: string, eventInitDict?: EventInit): Event;
};

export type SchemaRecord = { [index: string | number | symbol]: any };

export type SchemaEventInit = EventInit & {
    base?: SchemaEvent;
    type?: string;
    detail?: any;
};

export type SchemaSerializable =
    | StringConstructor
    | BooleanConstructor
    | NumberConstructor
    | ArrayConstructor
    | ObjectConstructor
    | DateConstructor;

export type SchemaPropType = SchemaFunction | SchemaConstructor;

export type ShemaProp = SchemaPropType | TypeWithConfig;

export type TypeWithConfig<Type = SchemaPropType, Value = any> = {
    type: Type;
    value?: () => Value;
    event?: {
        type: string;
    } & SchemaEventInit;
    reflect?: boolean;
};

export type Type<
    Type extends abstract new (...args: any[]) => any,
    Value = unknown
> =
    | Type
    | TypeWithConfig<
          Type,
          Value extends unknown ? InstanceType<Type> : unknown
      >;

export interface PropTypes {
    [prop: string]:
        | Types
        | TypeString
        | TypeNumber
        | TypeBoolean
        | TypePromise
        | TypeArray
        | TypeObject;
}

export interface SchemaComponentStylesConfig {
    styles?: Sheets;
}

export interface SchemaComponentConfig extends SchemaComponentStylesConfig {
    props: PropTypes;
    styles?: Sheets;
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

export type PropType<Type extends TypeWithConfig> = Type extends {
    value: () => infer R;
}
    ? R extends PropTypeFromType<Type["type"]>
        ? R
        : PropTypeFromType<Type["type"]>
    : PropTypeFromType<Type["type"]>;

export type Prop<Type extends ShemaProp> = Type extends TypeWithConfig
    ? PropType<Type>
    : Type extends SchemaPropType
    ? PropType<{ type: Type }>
    : unknown;

export type KeyofPropsWithConfigValue<Props extends PropTypes> = {
    [prop in keyof Props]-?: Props[prop] extends {
        value: any;
    }
        ? prop
        : never;
}[keyof Props];

export type KeyofPropsWithEvents<Props extends PropTypes> = {
    [prop in keyof Props]-?: Props[prop] extends EventFunction<any>
        ? prop
        : never;
}[keyof Props];

export type KeyofAttrsFromProps<Props extends PropTypes> = {
    [prop in keyof Props]-?: Props[prop] extends TypeWithConfig
        ? Props[prop]["type"] extends SchemaSerializable
            ? CamelToKebab<prop>
            : never
        : Props[prop] extends SchemaSerializable
        ? CamelToKebab<prop>
        : never;
}[keyof Props];

export type InferPropsWithEvents<Props extends PropTypes> = InferProps<
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

export type InferAttrsFromProps<Props extends PropTypes> = Record<
    Exclude<KeyofAttrsFromProps<Props>, keyof Props>,
    string
>;

export type InferProps<Props extends PropTypes> = {
    [prop in keyof Props]?: Prop<Props[prop]>;
} & {
    [prop in KeyofPropsWithConfigValue<Props>]: Prop<Props[prop]>;
};

export interface EventFunction<Detail> {
    type: FunctionConstructor;
    value: () => Detail extends null
        ? () => boolean
        : (detail: Detail) => boolean;
}

export type Global = typeof globalThis;

export type GlobalIgnore =
    | SchemaSerializable
    | PromiseConstructor
    | SymbolConstructor
    | FunctionConstructor;

export type GlobalKeys =
    | "Event"
    | "URL"
    | "Range"
    | "Image"
    | "Crypto"
    | "File"
    | "Date"
    | "Set"
    | "Blob"
    | "BlobEvent"
    | "Map"
    | "RegExp"
    | "Animation"
    | `WebSocket`
    | `BroadcastChannel`
    | `AbortController`
    | `Request`
    | `Response`
    | `Worker`
    | `SharedWorker`
    | `CSSStyleSheet`
    | `${string}Event`
    | `${string}Array`
    | `Event${string}`
    | `Payment${string}`
    | `Event${string}`
    | `Clipboard${string}`
    | `Animation${string}`
    | `Form${string}`
    | `Font${string}`
    | `DOM${string}`
    | `Touch${string}`
    | `Mutation${string}`
    | `Intersection${string}`
    | `Message${string}`
    | `Text${string}`
    | `HTML${string}`
    | `SVG${string}`
    | `Audio${string}`
    | `Document${string}`
    | `Weak${string}`
    | `File${string}`;

export type GlobalConstructors = Pick<
    Global,
    {
        [name in keyof Global]-?: Global[name] extends abstract new (
            ...args: any[]
        ) => any
            ? name extends GlobalKeys
                ? name
                : never
            : never;
    }[keyof Global]
>;

export type Types = {
    [name in keyof GlobalConstructors]-?: Type<GlobalConstructors[name]>;
}[keyof GlobalConstructors];

export type TypeString = Type<StringConstructor>;

export type TypeBoolean = Type<BooleanConstructor>;

export type TypeNumber = Type<NumberConstructor>;

export type TypeArray = Type<ArrayConstructor, unknown[]>;

export type TypePromise = Type<PromiseConstructor, Promise<unknown>>;

export type TypeObject = Type<ObjectConstructor, SchemaRecord>;
