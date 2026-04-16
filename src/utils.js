export const SymbolFor = (id) => Symbol.for(`atomico/${id}`);

/**
 * @template T
 * @param { T } current
 * @returns {{current?:T}}
 */
export const createRef = (current) => ({ current });

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
 * @type {import("internal/utils.js").IsFunction}
 */
export const isFunction = (value) => typeof value == "function";

/**
 * Determines if the value is considered an object
 * @param {any} value
 * @returns {value is Record<string, any>}
 */
export const isObject = (value) => value !== null && typeof value == "object" 

export const { isArray } = Array;

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
        for (let i = 0; i < list.length; i++) {
            const value = list[i];
            if (value && isArray(value)) {
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
                    last = (last == null ? "" : last) + value;
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
 * Allows you to listen to an event
 * @type {import("internal/utils.js").AddListener}
 */
export const addListener = (target, type, listener, options) => {
    target.addEventListener(type, listener, options);
    return () => target.removeEventListener(type, listener);
};

export const timeStamp = Date.now;