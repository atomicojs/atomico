import { SVGProperties } from "./dom-svg";
import { DOMFormElements, DOMFormElement } from "./dom-html";
import { Sheets } from "./css";

interface DOMGenericProperties {
    style?: string | Partial<CSSStyleDeclaration> | object;
    class?: string;
    id?: string;
    slot?: string;
    part?: string;
    is?: string;
    tabindex?: string | number;
    role?: string;
    ref?: any;
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

export type DOMEventHandlerKeys<P> = {
    [I in keyof P]-?: P[I] extends DOMEventHandlerValue<Event> ? I : never;
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

type DOMTarget<
    Target,
    CurrentEvent,
    Targets = Element | Node
> = CurrentEvent extends {
    customTarget: infer EventTarget;
}
    ? DOMTarget<Target, Omit<CurrentEvent, "customTarget">, EventTarget>
    : Omit<CurrentEvent, "currentTarget" | "target"> & {
          currentTarget: Target;
          target: Targets;
      };

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
        ? DOMGetEventBefore<
              NonNullable<Props[`on${Type}`]>,
              Element extends {
                  new (...args: any[]): infer This;
              }
                  ? This
                  : Element
          >
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

export type DOMTag<Element, Props = {}> = Props &
    Omit<DOMEvents<Element & Props>, DOMCleanKeys> &
    DOMGenericProperties &
    DOMUnknown;

export type DOMTags<HTMLTags, CustomProps = {}, HTMLMerge = {}> = {
    [Tag in keyof HTMLTags]: Tag extends keyof HTMLMerge
        ? DOMTag<HTMLMerge[Tag]> & CustomProps
        : DOMTag<Omit<HTMLTags[Tag], keyof CustomProps> & CustomProps>;
};

export type DOMThis<Element> = Element extends new (
    ...args: any[]
) => infer This
    ? This
    : {};

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

export type JSXElements = DOMTags<AtomicoElements, {}> &
    DOMTags<HTMLTags, {}, DOMCustomTags> &
    DOMTags<SVGTags, SVGProperties>;

export type JSXProxy<P> = {
    [I in keyof P]?: P[I] extends DOMEventHandlerValue<Event>
        ? P[I] extends (ev: infer CurrentEvent) => any
            ? (event: CurrentEvent) => any
            : P[I]
        : P[I];
};

export type DOMProps<props> = Partial<Omit<props, DOMEventHandlerKeys<props>>>;

export type AtomicoThis<Props = {}, Base = HTMLElement> = Props &
    Omit<DOMThis<Base>, keyof Props> & {
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
    new (props?: JSXProxy<DOMTag<DOMThis<Base>, Props>>): AtomicoThis<
        Props,
        Base
    >;
}
