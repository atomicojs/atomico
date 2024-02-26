/**
 * @template {any} T
 */
export class Ref {
    /**
     * @type {T}
     */
    #current;
    #listeners = new Set();
    /**
     * @param {T} current
     */
    constructor(current) {
        this.#current = current;
    }
    /**
     * @return {T}
     */
    get current() {
        return this.#current;
    }
    /**
     * @param {T} value
     */
    set current(value) {
        if (this.#current != value) {
            this.#current = value;
            this.#listeners.forEach((fn) => fn(value));
        }
    }
    /**
     * @type {import("hooks").Ref["on"]}
     */
    on(fn) {
        this.#listeners.add(fn);
        return () => this.#listeners.delete(fn);
    }
}

/**
 * @template {any} Value
 * @param {Value} [value]
 * @returns {import("hooks").Ref}
 */
export const createRef = (value) => new Ref(value);
