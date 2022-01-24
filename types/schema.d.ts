import { DOMEventHandlerKeys } from "./dom";

export type EventInit = CustomEventInit<any> & {
    type: string;
    base?: typeof CustomEvent | typeof Event;
};
/**
 * Interface to fill in unknown properties like any | null | undefined
 */
export interface ObjectFill {
    [index: string]: any | null | undefined;
}

export type ArrayFill = any[];

export type FunctionFill = (...args: any[]) => any;

export type PromiseFill = Promise<any>;

export type NewFill = abstract new (...args: any) => any;

export type ConstructorType<T> = T extends NumberConstructor
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
    ? PromiseFill
    : T extends ArrayConstructor
    ? any[]
    : T extends ObjectConstructor
    ? ObjectFill
    : T extends NewFill
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

interface SchemaPromise<type extends PromiseFill> extends SchemaOnlyProp {
    type: PromiseConstructor;
    value?: type | (() => type);
}

interface SchemaSymbol<type extends symbol> extends SchemaOnlyProp {
    type: PromiseConstructor;
    value?: type | (() => type);
}

interface SchemaFunction<type extends FunctionFill> extends SchemaOnlyProp {
    type: FunctionConstructor;
    value?: type;
}

interface SchemaArray<type extends ArrayFill> extends SchemaBase {
    type: ArrayConstructor;
    value?: () => type;
}

interface SchemaObject<type extends ObjectFill> extends SchemaBase {
    type: ObjectConstructor;
    value?: () => type;
}

interface SchemaNew<type extends NewFill> extends SchemaOnlyProp {
    type: type;
    value?: InstanceType<type> | (() => InstanceType<type>);
}

interface SchemaConstructor<type extends NewFill> extends SchemaOnlyProp {
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

type TypePromise<type extends PromiseFill> =
    | PromiseConstructor
    | SchemaPromise<type>;

type TypeSymbol<type extends symbol> = SymbolConstructor | SchemaSymbol<type>;

type TypeFunction<type extends FunctionFill> =
    | FunctionConstructor
    | SchemaFunction<type>;

type TypeArray<type extends ArrayFill> = ArrayConstructor | SchemaArray<type>;

type TypeObject<type extends ObjectFill> =
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
    | ArrayConstructor;

type SelfConstructors = Pick<
    Self,
    {
        [I in keyof Self]-?: I extends string
            ? I extends Capitalize<I>
                ? Self[I] extends NewFill
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

type TypeConstructor<type extends NewFill> = type | SchemaConstructor<type>;

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
    : type extends PromiseFill
    ? TypePromise<type>
    : type extends symbol
    ? TypeSymbol<type>
    : type extends TypesSelfValues
    ? TypeConstructor<GetTypeSelf<type>>
    : type extends FunctionFill
    ? TypeFunction<type>
    : type extends ArrayFill
    ? TypeArray<type>
    : type extends ObjectFill
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
    | Type<PromiseFill>
    | Type<symbol>
    | Type<FunctionFill>
    | Type<ArrayFill>
    | TypesSelf
    | Type<ObjectFill>
    | Type<null>;

export type SchemaProps = {
    [index: string]: Types;
};
