import { ReturnValidityState } from "./internal/hooks.js";

/**
 * Filter the parameters and join in a string only those that are considered different from
 * `"" | false | 0 | null | undefined`.
 * @example
 * ```js
 * <div class={serialize(checked && "checked", focus && "focus")}/>
 * ```
 */
export type ClassName = (...args: any[]) => string;

export type DelegateValidity = (
    target: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
) => ReturnValidityState;

export const className: ClassName;

export const delegateValidity: DelegateValidity;
