export type Sheet = CSSStyleSheet | HTMLStyleElement;

/**
 * 
 * @param strings 
 * @param values 
 */
export function css(strings: TemplateStringsArray, ...values: any[]): Sheet;

export function useStyleSheet(...sheet: Sheet[]): void;
