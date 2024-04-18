export const SymbolFor = Symbol.for;

/**
 * compare 2 array
 * ```js
 * isEqualArray([1,2,3,4],[1,2,3,4]) // true
 * isEqualArray([1,2,3,4],[1,2,3])   // false
 * isEqualArray([5,1,2,3],[1,2,3,5]) // false
 * isEqualArray([],[]) // true
 * ```
 * @param {any[]} before
 * @param {any[]} after
 * @returns {boolean}
 */
export function isEqualArray(before, after) {
    const length = before.length;
    if (length !== after.length) return false;
    for (let i = 0; i < length; i++) {
        let beforeValue = before[i];
        let afterValue = after[i];
        if (beforeValue !== afterValue) return false;
    }
    return true;
}
/**
 * Determine if the value is considered a function
 * @type {import("internal/utils.js").IsFunction}
 */
export const isFunction = (value) => typeof value == "function";

/**
 * Determines if the value is considered an object
 * @param {any} value
 */
export const isObject = (value) => typeof value == "object";

export const { isArray } = Array;

/**
 *
 * @param {Element & {dataset?:object}} node
 * @param {boolean} [styleOnly] - limits the hydration of the lists only to the tagStyle
 * @returns
 */
export const isHydrate = (node, styleOnly) =>
    (styleOnly ? node instanceof HTMLStyleElement : true) &&
    "hydrate" in (node?.dataset || {});

/**
 * @template {any[]} T
 * @param {T} list
 * @param {(value:T[0])=>void} callback
 */
export function flat(list, callback) {
    let last;
    /**
     * @param {any[]} list
     */
    const reduce = (list) => {
        let { length } = list;
        for (let i = 0; i < length; i++) {
            const value = list[i];
            if (value && Array.isArray(value)) {
                reduce(value);
            } else {
                const type = typeof value;
                if (
                    value == null ||
                    type === "function" ||
                    type === "boolean"
                ) {
                    continue;
                } else if (type === "string" || type === "number") {
                    if (last == null) last = "";
                    last += value;
                } else {
                    if (last != null) {
                        callback(last);
                        last = null;
                    }
                    callback(value);
                }
            }
        }
    };

    reduce(list);

    if (last != null) callback(last);
}

/**
 * @param {any} target
 * @param {string} type
 * @param {(event:Event)=>void} handler
 */
export const addListener = (target, type, handler) => {
    target.addEventListener(type, handler);
    return () => target.removeEventListener(type, handler);
};
