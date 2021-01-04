import { DOMAriaAttributes } from "./dom-aria-attributes";
/**
 * Generic properties not registered by TS for the DOM
 * @example
 * ```jsx
 * <host shadowDom/>
 * <h1 is="my-componentn"/>
 * <button part="button"/>
 * <img width="100px"/>
 * ```
 */
interface DOMGenericProperties extends DOMAriaAttributes {
    style: string | Partial<CSSStyleDeclaration> | object;
    class: string;
    id: string;
    slot: string;
    part: string;
    is: string;
    tabindex: string | number;
    role: string;
    shadowDom: boolean;
    width: string | number;
    height: string | number;
    children: any;
}

/**
 * Interface for generic event
 * @example
 * ```jsx
 * <button onclick={({target,currentTarget})=>console.log(target,currentTarget)}/>
 * ```
 */
interface DOMEventCustomTarget<T extends Element> extends CustomEvent {
    target: T;
    currentTarget: T;
}
/**
 * Interface for the construction of a generic event as a property
 */
type DOMEventProperty<Base extends Element> =
    | ((this: GlobalEventHandlers, event: DOMEventCustomTarget<Base>) => any)
    | null;
/**
 * Interface that unifies generics as Element
 */
type DOMGenericElement = Partial<GlobalEventHandlers & DOMGenericProperties>;
/**
 * Fill in the unknown properties
 */
interface DOMUnknownProperties {
    [property: string]: any;
}
/**
 * Generic properties not registered by TS for SVG
 */
interface SVGGenericProperties {
    d: string | number; //path
    x: string | number;
    y: string | number;
    r: string | number;
    cx: string | number;
    cy: string | number;
    x1: string | number;
    x2: string | number;
    y1: string | number;
    y2: string | number;
    transform: string;
    systemLanguage: string; // switch
    fill: string;
    gradientTransform: string; // linearGradient
    offset: string; // linearGradient
    points: string | number[];
    viewBox: string;
}
/**
 * Avoid the association of SVG types to tag A, in favor of the HTML api
 */
type SVGMapElements = Omit<SVGElementTagNameMap, "a">;
/**
 * Maps SVG tags already registered by TS and completes them with the generics
 * @todo associate to specific constructor
 */
type SVGElementsTagMap = {
    [K in keyof SVGMapElements]: Tag<SVGMapElements[K], SVGGenericProperties>;
};
/**
 * Maps the HTML tags already registered by TS and completes them with the generics
 * @todo omit generic properties according to constructor
 */
type HTMLElementTagMap = {
    [K in keyof HTMLElementTagNameMap]: Tag<
        HTMLElementTagNameMap[K],
        DOMGenericProperties
    >;
};
/**
 * Add special behaviors by Tag
 */
interface HTMLElementTagAtomico {
    host: Tag<HTMLElement, { shadowDom: boolean }>;
    slot: Tag<
        HTMLSlotElement,
        { onslotchange: DOMEventProperty<HTMLSlotElement> }
    >;
}
/**
 * Tag context for TS
 */
export type TagMaps = SVGElementsTagMap &
    HTMLElementTagMap &
    HTMLElementTagAtomico;
/**
 * Omit the predefined properties by TS in favor of the generic ones
 */
export type Tag<BaseElement, Properties> = Partial<
    Omit<Omit<BaseElement, keyof Properties>, keyof DOMGenericProperties>
> &
    Partial<Properties> &
    DOMGenericElement &
    DOMUnknownProperties;
