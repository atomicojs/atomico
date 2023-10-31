import { VNodeKeyTypes, VNode } from "./vnode.js";
import { JSXElements } from "./dom.js";

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
    Children = null,
>(
    type: Type,
    props?: Props,
    ...children: Children[]
): VNode<Type, Props, Children>;

export namespace JSX {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface IntrinsicElements extends JSXElements {
        [tagName: string]: any;
    }
}
