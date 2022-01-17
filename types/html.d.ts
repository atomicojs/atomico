import { VNode } from "./vnode";

export function html(
    strings: TemplateStringsArray,
    ...values: any[]
): VNode<any, any>;

export default html;
