export type Sheet = CSSStyleSheet | HTMLStyleElement;

export type Sheets = Sheet | Sheet[] | Sheets[];
/**
 * Create a CSSStyleSheet if the browser supports it and
 * otherwise an HTMLStyleElement to be used as a polyfill
 * @example
 * ```jsx
 * function component(){
 *   return <host shadowDom/>
 * }
 * // can be an array
 * component.styles = css`
 *  :host{font-size: 200px;}
 * `
 * ```
 * @param strings
 * @param values
 */
export function css(strings: TemplateStringsArray, ...values: any[]): Sheet;
