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
    ? FunctionFill
    : T extends SymbolConstructor
    ? symbol
    : T extends PromiseConstructor
    ? PromiseFill
    : T extends ArrayConstructor
    ? ArrayFill
    : T extends NewFill
    ? InstanceType<T>
    : T extends ObjectConstructor
    ? ObjectFill
    : T extends null
    ? any
    : T;

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

type TypeNew<type extends NewFill> = type | SchemaNew<type>;

type TypeAny = null | SchemaAny;

type TypeUnknown =
    | NewFill
    | {
          type?: NewFill;
          value?: any;
      }
    | TypeAny;

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
    : type extends FunctionFill
    ? TypeFunction<type>
    : type extends ArrayFill
    ? TypeObject<type>
    : type extends ObjectFill
    ? TypeObject<type>
    : type extends NewFill
    ? TypeNew<type>
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
    | Type<ObjectFill>
    | Type<NewFill>
    | Type<null>;

export type SchemaProps = {
    [index: string]: Types;
};

export type SchemaUnknown = {
    [index: string]: TypeUnknown;
};
