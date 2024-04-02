import { Sheet, Sheets } from "./css.js";
import { DOMFormElement, DOMFormElements } from "./dom-html.js";
import { SVGProperties } from "./dom-svg.js";
import { FillConstructor, FillObject, SchemaInfer } from "./schema.js";
import { VNodeKeyTypes } from "./vnode.js";

export type Nullable<T> = NonNullable<T> | undefined | null;

export type PropsNullable<Data> = {
    [I in keyof Data]?: Nullable<Data[I]>;
};

type DOMCustomTag<Base, Props> = Omit<Base, keyof Props> & Props;

type DOMRefValue<Target> = FillObject | ((target: Target) => any);

type DOMRef<Target> = {
    ref?: DOMRefValue<Target>;
};

interface DOMGenericProperties {
    style?: string | Partial<CSSStyleDeclaration> | object;
    class?: string;
    id?: string;
    slot?: string;
    part?: string;
    is?: string;
    tabindex?: string | number;
    role?: string;
    shadowDom?: boolean | Partial<ShadowRootInit>;
    staticNode?: boolean;
    cloneNode?: boolean;
    width?: string | number;
    height?: string | number;
    key?: any;
    children?: any;
}

type DOMCleanKeys =
    | keyof DOMGenericProperties
    | `add${string}`
    | `get${string}`
    | `set${string}`
    | `has${string}`
    | `matches${string}`
    | `remove${string}`
    | `replace${string}`
    | `querySelector${string}`
    | `offset${string}`
    | `append${string}`
    | `request${string}`
    | `scroll${string}`
    | `is${string}`
    | `toggle${string}`
    | `webkit${string}`
    | `insert${string}`
    | `client${string}`
    | `child${string}`
    | `${string}_${string}`
    | `${string}HTML`
    | `${string}Child`
    | `${string}Validity`
    | `${string}Capture`
    | `${string}ElementSibling`
    | "classList"
    | "attributes"
    | "normalize"
    | "closest"
    | "localName"
    | "contains"
    | "animate"
    | "attachShadow"
    | "outerText"
    | "attachInternals"
    | "click"
    | "tagName"
    | "focus"
    | "submit"
    | "accessKeyLabel"
    | "elements"
    | "isContentEditable"
    | "innerText"
    | "prepend"
    | "namespaceURI"
    | "blur"
    | "dataset"
    | "shadowRoot"
    | keyof Omit<ChildNode, "textContent">;

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

type DOMGetEvent<
    Type extends string,
    Element extends AtomicoStatic<any>
> = Element extends {
    "##props": infer Props;
}
    ? `on${Type}` extends keyof Props
        ? DOMGetEventBefore<NonNullable<Props[`on${Type}`]>, DOMThis<Element>>
        : Event
    : Event;

type DOMEvent<
    Target = HTMLElement,
    CurrentEvent = Event
> = Target extends string
    ? CurrentEvent extends AtomicoStatic<any>
        ? DOMGetEvent<Target, CurrentEvent>
        : DOMEventType<Target, CurrentEvent>
    : DOMTarget<DOMThis<Target>, CurrentEvent>;

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

export type JSXProps<T extends VNodeKeyTypes> = T extends Atomico<any, any, any>
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
    _ignoreAttr?: string | null;
    mount?: () => void;
    umount?: () => void;
    shadowRoot?: {
        adoptedStyleSheets: CSSStyleSheet[];
    };
    constructor: {
        styles: Sheet[];
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

export interface AtomicoStatic<Props> extends HTMLElement {
    styles: Sheets[];
    props: SchemaInfer<Props>;
    /**
     * Meta property, allows associating the component's
     * props in typescript to external environments.
     */
    readonly "##props": Props;
    /**
     * Allows to identify a constructor created with Atomico
     */
    readonly "##atomico": true;
}

export interface Atomico<Props, PropsForInstance, Base>
    extends AtomicoStatic<Props> {
    new (
        props?: JSXProxy<
            DOMTag<DOMThis<Base>, Props>,
            AtomicoThis<PropsForInstance, Base>
        >
    ): AtomicoThis<PropsForInstance, Base>;
}

/**
 * This type allows retrieving the parameters of a customElement
 * to be reflected in the JSX by third party APIs, eg: `@atomico/react`.
 */
export type JSXElement<Base extends FillConstructor> =
    Base extends AtomicoStatic<any>
        ? Base extends { new (props?: infer Props): any }
            ? Props
            : DOMThis<Base>
        : DOMThis<Base>;

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

export interface AtomicoElement extends CustomElementConstructor {
    readonly "##atomico": true;
}
