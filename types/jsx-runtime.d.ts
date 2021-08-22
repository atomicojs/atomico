import { VDomType, VDom } from "./core";
import { JSXElements } from "./dom";

export function jsx<Type extends VDomType, Props = null, Children = null>(
    type: Type,
    props?: Props,
    ...children: Children[]
): VDom<Type, Props, Children>;

export function jsxs<Type extends VDomType, Props = null, Children = null>(
    type: Type,
    props?: Props,
    ...children: Children[]
): VDom<Type, Props, Children>;

export function jsxDEV<Type extends VDomType, Props = null, Children = null>(
    type: Type,
    props?: Props,
    ...children: Children[]
): VDom<Type, Props, Children>;

export namespace JSX {
    interface IntrinsicElements extends JSXElements {
        [tagName: string]: any;
    }
}
