export type Sheet = CSSStyleSheet | HTMLStyleElement;

export function css(strings: TemplateStringsArray, ...values: any[]): Sheet;

export function useStyleSheet(...sheet: Sheet[]): void;
