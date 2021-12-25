/**
 * Filter the parameters and join in a string only those that are considered different from
 * `"" | false | 0 | null | undefined`.
 * @example
 * ```js
 * <div class={serialize(checked && "checked", focus && "focus")}/>
 * ```
 */
export function serialize(...args: any): string;

/**
 * check Atomico's leveraged compatibility with the current browser
 */
export function checkIncompatibility(): string[];
