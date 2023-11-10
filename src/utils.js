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
        if (before[i] !== after[i]) return false;
    }
    return true;
}
/**
 * Determine if the value is considered a function
 * @type {import("internal/utils").IsFunction}
 */
export const isFunction = (value) => typeof value == "function";

/**
 * Determines if the value is considered an object
 * @param {any} value
 */
export const isObject = (value) => typeof value == "object";

export const { isArray } = Array;

/**
 * @param {any} value
 * @returns {value is number}
 */
export const isNumber = (value) => typeof value == "number";

/**
 *
 * @param {Element & {dataset?:object}} node
 * @returns
 */
export const isHydrate = (node) => "hydrate" in (node?.dataset || {});

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
            if (value && isArray(value)) {
                reduce(value);
            } else {
                if (
                    value == null ||
                    isFunction(value) ||
                    typeof value === "boolean"
                ) {
                    continue;
                } else if (typeof value === "string" || isNumber(value)) {
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
 *
 * @param {Element} target
 * @param {string} type
 * @param {(event:Event)=>void} handler
 */
export const addListener = (target, type, handler) => {
    target.addEventListener(type, handler);
    return () => target.removeEventListener(type, handler);
};
