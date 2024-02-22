import { DOMEventHandlerKeys } from "./dom.js";

export type NoTypeFor = null;
export type TypeForJsx = 1;
export type TypeForInstance = 2;

export type EventInit = CustomEventInit<any> & {
    type: string;
    base?: typeof CustomEvent | typeof Event;
};
/**
 * Interface to fill in unknown properties like any | null | undefined
 */
export interface FillObject {
    [index: string]: any;
}

export type FillArray = any[];

export type FillFunction = (...args: any[]) => any;

export type FillPromise = Promise<any>;

export type FillConstructor = abstract new (...args: any) => any;

export type TypeToConstructor<type> = type extends string
    ? StringConstructor
    : type extends number
      ? NumberConstructor
      : type extends boolean
        ? BooleanConstructor
        : type extends FillPromise
          ? PromiseConstructor
          : type extends symbol
            ? SymbolConstructor
            : type extends FillFunction
              ? FunctionConstructor
              : type extends FillArray
                ? ArrayConstructor
                : type extends FillObject
                  ? ObjectConstructor
                  : TypeAny;

export type ConstructorType<T, TypeFor = null> = T extends {
    meta?: infer Type;
}
    ? Type
    : T extends NumberConstructor
      ? number
      : T extends StringConstructor
        ? string
        : T extends BooleanConstructor
          ? boolean
          : T extends TypeCustom<FillFunction>
            ? TypeFor extends NoTypeFor
                ? ReturnType<T["map"]>
                : TypeFor extends TypeForJsx
                  ? TypeCustomGetValue<T["map"]>
                  : ReturnType<T["map"]>
            : T extends FunctionConstructor
              ? FillFunction
              : T extends SymbolConstructor
                ? symbol
                : T extends PromiseConstructor
                  ? FillPromise
                  : T extends ArrayConstructor
                    ? any[]
                    : T extends ObjectConstructor
                      ? FillObject
                      : T extends FillConstructor
                        ? InstanceType<T>
                        : any;

type SchemaEvent = {
    event?: EventInit;
};

type SchemaBase = SchemaEvent & {
    attr?: string;
};

type SchemaReflect<type> = SchemaBase & {
    reflect?: boolean;
} & type;

type SchemaProp<type> = SchemaEvent & type;

type SchemaOnlyPropWrapper<Constructor, Type> =
    | SchemaProp<{
          type: Constructor;
      }>
    | SchemaProp<{
          type: Constructor;
          value: Type;
      }>
    | SchemaProp<{
          type: Constructor;
          value: () => Type;
      }>;

type SchemaReflectWrapper<Constructor, Type> =
    | SchemaReflect<{
          type: Constructor;
      }>
    | SchemaReflect<{
          type: Constructor;
          value: Type;
      }>
    | SchemaReflect<{
          type: Constructor;
          value: () => Type;
      }>;

type SchemaAny<Type> =
    | SchemaReflect<{
          value: Type;
      }>
    | SchemaReflect<{
          value: () => Type;
      }>
    | SchemaReflect<{}>;

type SchemaTypeCustom =
    | TypeCustom<FillFunction>
    | SchemaReflectWrapper<TypeCustom<FillFunction>, any>;

type TypeString<type extends string> =
    | StringConstructor
    | SchemaReflectWrapper<StringConstructor, type>;

type TypeBoolean =
    | BooleanConstructor
    | SchemaReflectWrapper<BooleanConstructor, true | false>;

type TypeNumber<type extends number> =
    | NumberConstructor
    | SchemaReflectWrapper<NumberConstructor, type>;

type TypePromise<type extends FillPromise> =
    | PromiseConstructor
    | SchemaOnlyPropWrapper<PromiseConstructor, type>;

type TypeSymbol<type extends symbol> =
    | SymbolConstructor
    | SchemaOnlyPropWrapper<SymbolConstructor, type>;

type TypeFunction<type extends FillFunction> =
    | FunctionConstructor
    | SchemaOnlyPropWrapper<FunctionConstructor, type>;

type TypeArray<type extends FillArray> =
    | ArrayConstructor
    | SchemaReflectWrapper<ArrayConstructor, type>;

type TypeObject<type extends FillObject> =
    | ObjectConstructor
    | SchemaReflectWrapper<ObjectConstructor, type>;

type TypeAny<type = any> = null | SchemaAny<type>;

type Self = typeof window;

type SelfIgnore =
    | StringConstructor
    | NumberConstructor
    | BooleanConstructor
    | FunctionConstructor
    | ObjectConstructor
    | PromiseConstructor
    | SymbolConstructor
    | ArrayConstructor;

type SafeGlobal =
    | "Event"
    | "URL"
    | "Range"
    | "Image"
    | "Crypto"
    | "File"
    | "Date"
    | "Set"
    | "Map"
    | "RegExp"
    | "Animation"
    | `${string}Event`
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
    | `HTML${string}`
    | `SVG${string}`
    | `Audio${string}`
    | `Document${string}`
    | `Weak${string}`
    | `CSS${string}`
    | `File${string}`;

type SelfConstructors = Pick<
    Self,
    {
        [I in keyof Self]-?: I extends string
            ? I extends Capitalize<I>
                ? Self[I] extends FillConstructor
                    ? Self[I] extends SelfIgnore
                        ? never
                        : I extends SafeGlobal
                          ? I
                          : never
                    : never
                : never
            : never;
    }[keyof Self]
>;

type SelfConstructorValues = {
    [I in keyof SelfConstructors]-?: SelfConstructors[I];
}[keyof SelfConstructors];

type TypeConstructor<type extends FillConstructor> =
    | type
    | SchemaOnlyPropWrapper<type, InstanceType<type>>;

type TypesSelf = {
    [I in keyof SelfConstructors]-?: TypeConstructor<SelfConstructors[I]>;
}[keyof SelfConstructors];

type TypesSelfValues = {
    [I in keyof SelfConstructors]-?: InstanceType<SelfConstructors[I]>;
}[keyof SelfConstructors];

type GetTypeSelf<value extends TypesSelfValues> = {
    [I in keyof SelfConstructors]-?: value extends InstanceType<
        SelfConstructors[I]
    >
        ? keyof value extends keyof InstanceType<SelfConstructors[I]>
            ? SelfConstructors[I]
            : never
        : never;
}[keyof SelfConstructors];

type TypesDiscard<type> = type extends FillFunction
    ? TypeFunction<type>
    : type extends FillObject
      ? TypeObject<type>
      : TypeAny<type>;

export type Type<type> = type extends string
    ? TypeString<type>
    : type extends number
      ? TypeNumber<type>
      : type extends boolean
        ? TypeBoolean
        : type extends TypeCustom<FillFunction>
          ? SchemaTypeCustom
          : type extends FillPromise
            ? TypePromise<type>
            : type extends symbol
              ? TypeSymbol<type>
              : type extends FillArray
                ? TypeArray<type>
                : type extends DOMStringMap
                  ? TypeObject<type>
                  : type extends TypesSelfValues
                    ? GetTypeSelf<type> extends never
                        ? TypesDiscard<type>
                        : TypeConstructor<GetTypeSelf<type>>
                    : TypesDiscard<type>;

export type SchemaInfer<Props> = Required<
    Omit<
        {
            [I in keyof Props]: Type<Props[I]>;
        },
        DOMEventHandlerKeys<Props>
    >
>;

export type TypeCustom<Map extends FillFunction> = {
    name: "Custom";
    map: Map;
    serialize?: (value: ReturnType<Map>) => string;
};

export type TypeCustomGetValue<Custom extends FillFunction> =
    Parameters<Custom> extends [infer First] ? First : undefined;

export type Types =
    | Type<string>
    | Type<number>
    | Type<boolean>
    | Type<TypeCustom<FillFunction>>
    | Type<FillPromise>
    | Type<symbol>
    | Type<FillFunction>
    | Type<FillArray>
    | TypesSelf
    | Type<FillObject>
    | Type<null>;

export type SchemaProps = {
    [index: string]: Types;
};
