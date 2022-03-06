import { SVGProperties } from "./dom-svg";
import { DOMFormElements, DOMFormElement } from "./dom-html";
import { Sheets } from "./css";
import { VNodeKeyTypes } from "./vnode";
import { FillObject } from "./schema";

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
    shadowDom?: boolean;
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
    (event: E): any;
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
    : DOMTarget<Target, CurrentEvent>;

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

type Nullable<Data> = {
    [I in keyof Data]?: NonNullable<Data[I]> | undefined | null;
};

export type DOMTag<Element, Props = null> = Props extends null
    ? Nullable<
          Omit<DOMEvents<Element>, DOMCleanKeys> &
              DOMGenericProperties &
              DOMRef<Element>
      > &
          DOMUnknown
    : Nullable<
          Props &
              Omit<DOMEvents<Element & Props>, keyof Props | DOMCleanKeys> &
              DOMGenericProperties &
              DOMRef<Element & Props>
      > &
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
    };
    form: DOMFormElement & {
        onsubmit: (
            event: SubmitEvent & DOMCustomTarget<DOMFormElements>
        ) => any;
        onchange: (event: Event & DOMCustomTarget<DOMFormElements>) => any;
        oninput: (event: Event & DOMCustomTarget<DOMFormElements>) => any;
    };
}

export type JSXElements = DOMTags<AtomicoElements> &
    DOMTags<HTMLTags, null, DOMCustomTags> &
    DOMTags<SVGTags, SVGProperties>;

export type JSXProxy<Props, This> = {
    [I in keyof Props]?: NonNullable<Props[I]> extends DOMEventHandlerValue<
        infer CurrentEvent
    >
        ?
              | ((
                    ev: DOMEventTarget<CurrentEvent, This, Element | Node>
                ) => any)
              | null
              | undefined
        : I extends "ref"
        ? DOMRefValue<This>
        : Props[I];
};

export type JSXProps<T extends VNodeKeyTypes> = T extends Atomico<any, any>
    ? T extends { new (props: infer Props): any }
        ? Props
        : DOMTag<T>
    : T extends keyof JSXElements
    ? JSXElements[T]
    : T extends string
    ? DOMTag<HTMLElement>
    : DOMTag<DOMThis<T>>;

export type DOMProps<props> = Partial<Omit<props, DOMEventHandlerKeys<props>>>;

export type AtomicoThis<Props = {}, Base = HTMLElement> = Nullable<Props> &
    DOMThis<Base> & {
        update(props?: Props): Promise<void>;
        updated: Promise<void>;
        mounted: Promise<void>;
        unmounted: Promise<void>;
        readonly symbolId: unique symbol;
    };

export interface AtomicoStatic<Props> extends HTMLElement {
    styles: Sheets;
    /**
     * Meta property, allows associating the component's
     * props in typescript to external environments.
     */
    readonly "##props": Props;
}

export interface Atomico<Props, Base> extends AtomicoStatic<Props> {
    new (
        props?: JSXProxy<DOMTag<DOMThis<Base>, Props>, AtomicoThis<Props, Base>>
    ): AtomicoThis<Props, Base>;
}
