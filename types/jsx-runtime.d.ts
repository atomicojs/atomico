import { JSXElements } from "./dom.js";
import { VNode, VNodeKeyTypes } from "./vnode.js";

export function jsx<Type extends VNodeKeyTypes, Props = null, Children = null>(
    type: Type,
    props?: Props,
    ...children: Children[]
): VNode<Type, Props, Children>;

export function jsxs<Type extends VNodeKeyTypes, Props = null, Children = null>(
    type: Type,
    props?: Props,
    ...children: Children[]
): VNode<Type, Props, Children>;

export function jsxDEV<
    Type extends VNodeKeyTypes,
    Props = null,
    Children = null
>(
    type: Type,
    props?: Props,
    ...children: Children[]
): VNode<Type, Props, Children>;

export namespace JSX {
    interface IntrinsicElements extends JSXElements {
        [tagName: string]: any;
    }
}
