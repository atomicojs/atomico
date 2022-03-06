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

/**
 * @param {any[]} list
 * @param {(value:any)=>void} callback
 */
export function flat(list, callback) {
    let { length } = list;
    for (let i = 0; i < length; i++) {
        if (list[i] && Array.isArray(list[i])) {
            flat(list[i], callback);
        } else {
            callback(list[i]);
        }
    }
}
