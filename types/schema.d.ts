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

export type ConstructorType<T> = T extends {
    meta?: infer Type;
}
    ? Type
    : T extends NumberConstructor
    ? number
    : T extends StringConstructor
    ? string
    : T extends BooleanConstructor
    ? boolean
    : T extends FunctionConstructor
    ? (...args: any[]) => any
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

interface SchemaEvent {
    event?: EventInit;
}

interface SchemaBase extends SchemaEvent {
    attr?: string;
}

interface SchemaReflect extends SchemaBase {
    reflect?: boolean;
}

interface SchemaOnlyProp extends SchemaEvent {
    attrs?: false;
    reflect?: false;
}

interface SchemaString<type extends string> extends SchemaReflect {
    type: StringConstructor;
    value?: type | (() => type);
}

interface SchemaBoolean extends SchemaReflect {
    type: BooleanConstructor;
    value?: true | false | (() => true | false);
}

interface SchemaNumber<type extends number> extends SchemaReflect {
    type: typeof Number;
    value?: type | (() => type);
}

interface SchemaPromise<type extends FillPromise> extends SchemaOnlyProp {
    type: PromiseConstructor;
    value?: type | (() => type);
}

interface SchemaSymbol<type extends symbol> extends SchemaOnlyProp {
    type: PromiseConstructor;
    value?: type | (() => type);
}

interface SchemaFunction<type extends FillFunction> extends SchemaOnlyProp {
    type: FunctionConstructor;
    value?: type;
}

interface SchemaArray<type extends FillArray> extends SchemaBase {
    type: ArrayConstructor;
    value?: () => type;
}

interface SchemaObject<type extends FillObject> extends SchemaBase {
    type: ObjectConstructor;
    value?: () => type;
}

interface SchemaConstructor<type extends FillConstructor>
    extends SchemaOnlyProp {
    type: type;
    value?: InstanceType<type> | (() => InstanceType<type>);
}

interface SchemaAny extends SchemaBase {
    type?: null;
    value?: any;
}

type TypeString<type extends string> = StringConstructor | SchemaString<type>;

type TypeBoolean = BooleanConstructor | SchemaBoolean;

type TypeNumber<type extends number> = NumberConstructor | SchemaNumber<type>;

type TypePromise<type extends FillPromise> =
    | PromiseConstructor
    | SchemaPromise<type>;

type TypeSymbol<type extends symbol> = SymbolConstructor | SchemaSymbol<type>;

type TypeFunction<type extends FillFunction> =
    | FunctionConstructor
    | SchemaFunction<type>;

type TypeArray<type extends FillArray> = ArrayConstructor | SchemaArray<type>;

type TypeObject<type extends FillObject> =
    | ObjectConstructor
    | SchemaObject<type>;

type TypeAny = null | SchemaAny;

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

type SelfConstructors = Pick<
    Self,
    {
        [I in keyof Self]-?: I extends string
            ? I extends Capitalize<I>
                ? Self[I] extends FillConstructor
                    ? Self[I] extends SelfIgnore
                        ? never
                        : I
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
    | SchemaConstructor<type>;

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

export type Type<type> = type extends string
    ? TypeString<type>
    : type extends number
    ? TypeNumber<type>
    : type extends boolean
    ? TypeBoolean
    : type extends FillPromise
    ? TypePromise<type>
    : type extends symbol
    ? TypeSymbol<type>
    : type extends DOMStringMap
    ? TypeObject<type>
    : type extends TypesSelfValues
    ? TypeConstructor<GetTypeSelf<type>>
    : type extends FillFunction
    ? TypeFunction<type>
    : type extends FillArray
    ? TypeArray<type>
    : type extends FillObject
    ? TypeObject<type>
    : TypeAny;

export type SchemaInfer<Props> = Required<
    Omit<
        {
            [I in keyof Props]: Type<Props[I]>;
        },
        DOMEventHandlerKeys<Props>
    >
>;

export type Types =
    | Type<string>
    | Type<number>
    | Type<boolean>
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
