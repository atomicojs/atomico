import { Vdom } from "./core";

export function html(
    strings: TemplateStringsArray,
    ...values: any[]
): Vdom<any, any>;

export default html;
