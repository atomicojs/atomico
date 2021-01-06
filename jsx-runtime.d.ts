import { VDomType, VDom } from "./core";
import { TagMaps } from "./types/dom";

export function jsx<Type extends VDomType, Props = null, Children = null>(
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
    interface IntrinsicElements extends TagMaps {
        [tagName: string]: any;
    }
}
