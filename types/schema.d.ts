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

/**
 * Type Builders Dictionary
 */
export type TypeConstructor<T> = T extends number
    ? NumberConstructor
    : T extends string
    ? StringConstructor
    : T extends boolean
    ? BooleanConstructor
    : T extends FunctionFill
    ? FunctionConstructor
    : T extends symbol
    ? SymbolConstructor
    : T extends PromiseFill
    ? PromiseConstructor
    : T extends ArrayFill
    ? ArrayConstructor
    : T extends object
    ? ObjectConstructor
    : any;

export type ConstructorType<T> = T extends typeof Number
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
    : any;

interface SchemaBase {
    attr?: string;
    event?: EventInit;
}

interface SchemaReflect extends SchemaBase {
    reflect?: boolean;
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

interface SchemaPromise<type extends PromiseFill> extends SchemaBase {
    type: PromiseConstructor;
    value?: type | (() => type);
}

interface SchemaSymbol<type extends symbol> extends SchemaBase {
    type: PromiseConstructor;
    value?: type | (() => type);
}

interface SchemaFunction<type extends FunctionFill> extends SchemaBase {
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

interface SchemaAny extends SchemaBase {
    value?: any;
}

type TypeString<type extends string> = StringConstructor | SchemaString<type>;

type TypeBoolean<type extends boolean> = BooleanConstructor | SchemaBoolean;

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

export type Type<type> = type extends string
    ? TypeString<type>
    : type extends number
    ? TypeNumber<type>
    : type extends boolean
    ? TypeBoolean<type>
    : type extends PromiseFill
    ? TypePromise<type>
    : type extends symbol
    ? TypeSymbol<type>
    : type extends FunctionFill
    ? TypeFunction<type>
    : type extends ArrayFill
    ? TypeObject<type>
    : type extends ObjectFill
    ? TypeObject<type>
    : null | SchemaAny;

export type SchemaInfer<Props> = Required<
    Omit<
        {
            [I in keyof Props]: Type<Props[I]>;
        },
        DOMEventHandlerKeys<Props>
    >
>;

export type SchemaProps = {
    [index: string]:
        | Type<string>
        | Type<number>
        | Type<boolean>
        | Type<PromiseFill>
        | Type<symbol>
        | Type<null>
        | Type<(...args: any[]) => any>
        | Type<any[]>
        | Type<ObjectFill>;
};
