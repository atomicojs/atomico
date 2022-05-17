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
    let length = before.length;
    if (length !== after.length) return false;
    for (let i = 0; i < length; i++) {
        if (before[i] !== after[i]) return false;
    }
    return true;
}
/**
 * Determine if the value is considered a function
 * @param {any} value
 */
export let isFunction = (value) => typeof value == "function";

/**
 * Determines if the value is considered an object
 * @param {any} value
 */
export let isObject = (value) => typeof value == "object";

export let { isArray } = Array;

/**
 * @param {any[]} list
 * @param {(value:any)=>void} callback
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
