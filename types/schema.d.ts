import { DOMEventHandlerKeys } from "./dom";

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

export type TypeToConstructor<Type> = Type extends string
    ? StringConstructor
    : Type extends number
    ? NumberConstructor
    : Type extends boolean
    ? BooleanConstructor
    : Type extends FillPromise
    ? PromiseConstructor
    : Type extends symbol
    ? SymbolConstructor
    : Type extends FillFunction
    ? FunctionConstructor
    : Type extends FillArray
    ? ArrayConstructor
    : Type extends FillObject
    ? ObjectConstructor
    : TypeAny;

export type ConstructorType<T, JSX = null> = T extends {
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
    ? JSX extends null
        ? ReturnType<T["map"]>
        : TypeCustomGetValue<T["map"]>
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

type SchemaReflect<Type> = SchemaBase & {
    reflect?: boolean;
} & Type;

type SchemaProp<Type> = SchemaEvent & Type;

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

type TypeString<Type extends string> =
    | StringConstructor
    | SchemaReflectWrapper<StringConstructor, Type>;

type TypeBoolean =
    | BooleanConstructor
    | SchemaReflectWrapper<BooleanConstructor, true | false>;

type TypeNumber<Type extends number> =
    | NumberConstructor
    | SchemaReflectWrapper<NumberConstructor, Type>;

type TypePromise<Type extends FillPromise> =
    | PromiseConstructor
    | SchemaOnlyPropWrapper<PromiseConstructor, Type>;

type TypeSymbol<Type extends symbol> =
    | SymbolConstructor
    | SchemaOnlyPropWrapper<SymbolConstructor, Type>;

type TypeFunction<Type extends FillFunction> =
    | FunctionConstructor
    | SchemaOnlyPropWrapper<FunctionConstructor, Type>;

type TypeArray<Type extends FillArray> =
    | ArrayConstructor
    | SchemaReflectWrapper<ArrayConstructor, Type>;

type TypeObject<Type extends FillObject> =
    | ObjectConstructor
    | SchemaReflectWrapper<ObjectConstructor, Type>;

type TypeAny<Type = any> = null | SchemaAny<Type>;

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

type TypeConstructor<Type extends FillConstructor> =
    | Type
    | SchemaOnlyPropWrapper<Type, InstanceType<Type>>;

type TypesSelf = {
    [I in keyof SelfConstructors]-?: TypeConstructor<SelfConstructors[I]>;
}[keyof SelfConstructors];

type TypesSelfValues = {
    [I in keyof SelfConstructors]-?: InstanceType<SelfConstructors[I]>;
}[keyof SelfConstructors];

type GetTypeSelf<Value extends TypesSelfValues> = {
    [I in keyof SelfConstructors]-?: Value extends InstanceType<
        SelfConstructors[I]
    >
        ? keyof Value extends keyof InstanceType<SelfConstructors[I]>
            ? SelfConstructors[I]
            : never
        : never;
}[keyof SelfConstructors];

type TypesDiscard<Type> = Type extends FillFunction
    ? TypeFunction<Type>
    : Type extends FillObject
    ? TypeObject<Type>
    : TypeAny<Type>;

export type Type<Type> = Type extends string
    ? TypeString<Type>
    : Type extends number
    ? TypeNumber<Type>
    : Type extends boolean
    ? TypeBoolean
    : Type extends TypeCustom<FillFunction>
    ? SchemaTypeCustom
    : Type extends FillPromise
    ? TypePromise<Type>
    : Type extends symbol
    ? TypeSymbol<Type>
    : Type extends FillArray
    ? TypeArray<Type>
    : Type extends DOMStringMap
    ? TypeObject<Type>
    : Type extends TypesSelfValues
    ? GetTypeSelf<Type> extends never
        ? TypesDiscard<Type>
        : TypeConstructor<GetTypeSelf<Type>>
    : TypesDiscard<Type>;

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
