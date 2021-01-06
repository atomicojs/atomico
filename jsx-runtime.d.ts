import { VDomType, VDom } from "./core";
import { TagMaps } from "./types/dom";

export function jsx<Type extends VDomType, Props = null, Children = any[]>(
    type: Type,
    props?: Props,
    ...children: Children
): VDom<Type, Props>;

export function jsxDEV<Type extends VDomType, Props = null, Children = any[]>(
    type: Type,
    props?: Props,
    ...children: Children
): VDom<Type, Props>;

export namespace JSX {
    interface IntrinsicElements extends TagMaps {
        [tagName: string]: any;
    }
}
