import { RequiredField } from "./utils";
/**
 * Type Builders Dictionary
 */
type TypeConstructor<T> = T extends number
    ? NumberConstructor
    : T extends string
    ? StringConstructor
    : T extends boolean
    ? BooleanConstructor
    : T extends () => {}
    ? FunctionConstructor
    : T extends symbol
    ? SymbolConstructor
    : T extends Promise<any>
    ? PromiseConstructor
    : T extends any[]
    ? ArrayConstructor
    : T extends object
    ? ObjectConstructor
    : any;

/**
 * Types that can be reflected as attributes
 */
type TypesForReflect =
    | typeof String
    | typeof Number
    | typeof Boolean
    | typeof Array
    | typeof Object;

/**
 * Types supported by Atomico.
 */
type Types =
    | null
    | typeof Number
    | typeof String
    | typeof Boolean
    | typeof Promise
    | typeof Object
    | typeof Array
    | typeof Symbol
    | typeof Function;

type ContructorType<T> = T extends typeof Number
    ? number
    : T extends typeof String
    ? string
    : T extends typeof Boolean
    ? boolean
    : T extends typeof Function
    ? (...args: any[]) => any
    : T extends typeof Symbol
    ? symbol
    : T extends typeof Promise
    ? Promise<any>
    : T extends typeof Array
    ? any[]
    : T extends typeof Object
    ? ObjectFill
    : any;

/**
 * Used to force the correct definition of the Shema.value
 */
type FunctionSchemaValue<T> = (value: T) => T;

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

export interface SchemaValue<Type = Types> {
    type: Type;
    /**
     * customize the attribute name, escaping the Camelcase
     */
    attr?: string;
    /**
     * reflects the value of the property as an attribute of the customElement
     */
    reflect?: Type extends TypesForReflect ? boolean : never;
    /**
     * Event to be dispatched at each change in property value
     */
    event?: EventInit;
    /**
     * default value when declaring the customElement
     */
    value?: Type extends FunctionConstructor
        ? (...args: any[]) => any
        : Type extends ArrayConstructor | ObjectConstructor
        ? FunctionSchemaValue<ContructorType<Type>>
        : FunctionSchemaValue<ContructorType<Type>> | ContructorType<Type>;
}
/**
 * Schema with required value
 */
export type SchemaRequiredValue = RequiredField<SchemaValue<any>, "value">;
/**
 * Type to autofill the props object
 * ```ts
 * Component.props:Props = {
 *  myProp : Number
 *  myProp2 : { type : String, reflect: true }
 * }
 * ```
 */
export type SchemaProps = {
    [prop: string]:
        | Types
        | SchemaValue<null>
        | SchemaValue<typeof String>
        | SchemaValue<typeof Number>
        | SchemaValue<typeof Boolean>
        | SchemaValue<typeof Array>
        | SchemaValue<typeof Object>
        | SchemaValue<typeof Function>
        | SchemaValue<typeof Symbol>
        | SchemaValue<typeof Promise>;
};

export type SchemaOption<Type> = Type | SchemaValue<Type>;

export type SchemaType<value> = value extends number
    ? SchemaOption<typeof Number>
    : value extends string
    ? SchemaOption<typeof String>
    : value extends boolean
    ? SchemaOption<typeof Boolean>
    : value extends any[]
    ? SchemaOption<typeof Array>
    : value extends object
    ? SchemaOption<typeof Object>
    : value extends Promise<any>
    ? SchemaOption<typeof Promise>
    : value extends (...args: any[]) => any
    ? SchemaOption<typeof Function>
    : value extends Symbol
    ? SchemaOption<typeof Symbol>
    : SchemaOption<null>;

export type SchemaInfer<props> = {
    [prop in keyof props]: SchemaType<props[prop]>;
};

export type SchemaExtract<value> = Extract<value, Types>;
