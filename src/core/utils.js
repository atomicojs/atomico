/**
 * Return if value is array
 * @param {*}
 * @return {boolean}
 */
export function isArray(value) {
    return Array.isArray(value);
}
/**
 * compare 2 array
 * @param {array} before
 * @param {array} after
 * @example
 * isEqualArray([1,2,3,4],[1,2,3,4]) // true
 * isEqualArray([1,2,3,4],[1,2,3])   // false
 * isEqualArray([5,1,2,3],[1,2,3,5]) // false
 * isEqualArray([],[]) // true
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

export function assign(master, commit) {
    for (let key in commit) {
        master[key] = commit[key];
    }
    for (let i = 2; i < arguments.length; i++) assign(master, arguments[i]);
    return master;
}

export function isFunction(value) {
    return typeof value == "function";
}

export function fps(callback, count = 3) {
    count-- ? requestAnimationFrame(() => fps(callback, count)) : callback();
}

export function promise(callback) {
    return new Promise(callback);
}
