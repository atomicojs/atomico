import { CreateHooks } from "./internal/hooks.js";
import { Sheet } from "./css.js";
import { DOMFormElement, DOMFormElements } from "./dom-html.js";
import { SVGProperties } from "./dom-svg.js";
import {
    InferAttrsFromProps,
    InferProps,
    InferPropsWithEvents,
    SchemaComponentConfig,
    SchemaRecord
} from "./schema.js";
import { VNodeKeyTypes } from "./vnode.js";

export type Nullable<T> = NonNullable<T> | undefined | null;

export type PropsNullable<Data> = {
    [I in keyof Data]?: Nullable<Data[I]>;
};

export interface DOMInternalProperties {
    shadowDom?: boolean | Partial<ShadowRootInit>;
    staticNode?: boolean;
    cloneNode?: boolean;
    key?: any;
    children?: any;
}

type DOMCustomTag<Base, Props> = Omit<Base, keyof Props> & Props;

type DOMRefValue<Target> = SchemaRecord | ((target: Target) => any);

type DOMRef<Target> = {
    ref?: DOMRefValue<Target>;
};
interface DOMGenericProperties extends DOMInternalProperties {
    style?: string | Partial<CSSStyleDeclaration> | object;
    class?: string;
    id?: string;
    slot?: string;
    part?: string;
    is?: string;
    tabindex?: string | number;
    role?: string;
    width?: string | number;
    height?: string | number;
}

type DOMCleanKeys = Exclude<
    keyof HTMLElement | keyof Element | keyof Node | keyof ChildNode | keyof DOMGenericProperties,
    | `on${string}`
    | "title"
    | "lang"
    | "translate"
    | "dir"
    | "accessKey"
    | "draggable"
    | "hidden"
    | "inert"
    | "spellcheck"
    | "autofocus"
    | "contentEditable"
    | "inputMode"
    | "enterKeyHint"
>;

type HTMLTags = HTMLElementTagNameMap;

type SVGTags = Omit<SVGElementTagNameMap, "a">;

type CheckEvent<CurrentEvent, True> = CurrentEvent extends Event ? True : never;

export interface DOMListener<E = Event> extends AddEventListenerOptions {
    (event: E extends Element ? DOMEvent<E> : E): any;
}

/**
 * @todo Rename Handler to Listener
 */

export type DOMEventHandlerKeys<P> = {
    [I in keyof P]-?: NonNullable<P[I]> extends DOMEventHandlerValue<infer E>
        ? CheckEvent<E, I>
        : P[I] extends { value: DOMEventHandlerValue<infer E> }
        ? CheckEvent<E, I>
        : never;
}[keyof P];

export interface DOMEventHandlerType extends FunctionConstructor {}

export interface DOMEventHandlerValue<CurrentEvent> {
    (event: CurrentEvent): any;
}

type DOMEventType<Type extends string, CurrentEvent> = {
    [I in keyof "0" as `on${Type}`]: {
        type: DOMEventHandlerType;
        value: DOMEventHandlerValue<CurrentEvent>;
    };
};

interface DOM$Attrs {
    [prop: `\$${string}`]: Nullable<string>;
}

interface DOMUnknown {
    [prop: string]: any;
}

type DOMEventTarget<CurrentEvent, CurrentTarget, Target> = {
    [I in keyof CurrentEvent]: I extends "currentTarget"
        ? CurrentTarget
        : I extends "target"
        ? Target
        : CurrentEvent[I];
};

type DOMTarget<
    Target,
    CurrentEvent,
    Targets = Element | Node
> = CurrentEvent extends {
    customTarget: infer EventTarget;
}
    ? DOMTarget<Target, Omit<CurrentEvent, "customTarget">, EventTarget>
    : DOMEventTarget<CurrentEvent, Target, Targets>;

type DOMGetEventBefore<Value, Target> = Value extends DOMEventHandlerValue<
    infer Event
>
    ? DOMEvent<HTMLElement, Event & DOMCustomTarget<Target>>
    : null;

type DOMEvent<Target = HTMLElement, CurrentEvent = Event> = DOMTarget<
    DOMThis<Target>,
    CurrentEvent
>;

type DOMEventHandler<Target, Handler> = Handler extends (
    ev: infer CurrentEvent
) => any
    ? CurrentEvent extends Event
        ? (ev: DOMEvent<Target, CurrentEvent>) => any
        : Handler
    : Handler;

type DOMEvents<Target> = {
    [Prop in keyof Target]?: Prop extends `on${string}`
        ? DOMEventHandler<Target, Target[Prop]>
        : Target[Prop];
};

type DOMCustomTarget<Target> = { customTarget: Target };

export type DOMTag<Element, Props = null> = Props extends null
    ? PropsNullable<
          Omit<DOMEvents<Element>, DOMCleanKeys> &
              DOMGenericProperties &
              DOMRef<Element>
      > &
          DOM$Attrs &
          DOMUnknown
    : PropsNullable<
          Props &
              Omit<DOMEvents<Element & Props>, keyof Props | DOMCleanKeys> &
              DOMGenericProperties &
              DOMRef<Element & Props>
      > &
          DOM$Attrs &
          DOMUnknown;

type S = keyof null;

export type DOMTags<HTMLTags, CustomProps = null, HTMLMerge = null> = {
    [Tag in keyof HTMLTags]: Tag extends keyof HTMLMerge
        ? DOMTag<HTMLMerge[Tag], CustomProps>
        : DOMTag<HTMLTags[Tag], CustomProps>;
};

export type DOMThis<Element> = Element extends new (
    ...args: any[]
) => infer This
    ? This
    : Element;

export interface AtomicoElements {
    host: HTMLElement;
}

export interface DOMCustomTags {
    slot: HTMLSlotElement & {
        onslotchange: (event: Event & DOMCustomTarget<HTMLSlotElement>) => void;
        assignNode: ChildNode;
    };
    form: DOMFormElement & {
        onsubmit: (
            event: SubmitEvent & DOMCustomTarget<DOMFormElements>
        ) => any;
        onchange: (event: Event & DOMCustomTarget<DOMFormElements>) => any;
        oninput: (event: Event & DOMCustomTarget<DOMFormElements>) => any;
    };
    input: DOMCustomTag<
        HTMLInputElement,
        {
            min: string | number;
            max: string | number;
            step: string | number;
            value: string | number;
        }
    >;
}

export type JSXElements = DOMTags<AtomicoElements> &
    DOMTags<HTMLTags, null, DOMCustomTags> &
    DOMTags<SVGTags, SVGProperties>;

export type JSXProxy<Props, This> = {
    [I in keyof Props]?: I extends `on${string}`
        ? NonNullable<Props[I]> extends DOMEventHandlerValue<infer CurrentEvent>
            ? Nullable<
                  (
                      ev: DOMEventTarget<CurrentEvent, This, Element | Node>
                  ) => any
              >
            : Props[I]
        : I extends "ref"
        ? DOMRefValue<This>
        : Props[I];
};

export type JSXProps<T extends VNodeKeyTypes> =
    T extends Atomico<SchemaComponentConfig>
        ? T extends { new (props: infer Props): any }
            ? Props
            : DOMTag<T>
        : T extends keyof JSXElements
        ? JSXElements[T]
        : T extends string
        ? DOMTag<HTMLElement>
        : DOMTag<DOMThis<T>>;

export type DOMProps<props> = Partial<Omit<props, DOMEventHandlerKeys<props>>>;

export type AtomicoThisInternal = AtomicoThis & {
    _props: { [prop: string]: any };
    _hooks: ReturnType<CreateHooks>;
    _ignoreAttr?: string | null;
    _umount?: () => void;
    shadowRoot?: {
        adoptedStyleSheets: CSSStyleSheet[];
    };
    constructor: {
        styles: Sheet[];
        form: boolean;
    };
};

export type AtomicoThis<Props = {}, Base = HTMLElement> = Props &
    DOMThis<Base> & {
        update(): Promise<void>;
        updated: Promise<void>;
        mounted: Promise<void>;
        unmounted: Promise<void>;
        readonly symbolId: unique symbol;
    };

/**
 * Type to create a wrapper to instantiate an element with type validation in JSX
 * @example
 * ```tsx
 * const [ Template ] = useSlot< JSX<{value: number} >>(ref);
 *
 * <Template value={10}/>
 * ```
 */
export interface JSX<Props = {}, Base = HTMLElement> extends Element {
    new (
        props?: JSXProxy<DOMTag<DOMThis<Base>, Props>, Base>
    ): PropsNullable<Props> & DOMThis<Base>;
}

export interface Atomico<Config extends SchemaComponentConfig>
    extends HTMLElement {
    new (
        props?: JSXProxy<
            DOMTag<
                DOMThis<HTMLElement>,
                InferPropsWithEvents<Config["props"]> &
                    InferAttrsFromProps<Config["props"]>
            >,
            AtomicoThis<InferProps<Config["props"]>, HTMLElement>
        >
    ): AtomicoThis<InferProps<Config["props"]>, HTMLElement>;
}
