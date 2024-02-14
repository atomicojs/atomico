import { SymbolFor, TYPE } from "./constants.js";

export const TYPE_REF = SymbolFor("Atomico.REF");

/**
 * @template {any} Value
 * @param {Value} value
 * @returns {import("hooks").Ref}
 */
export const createRef = (value) => {
    /**
     * @type {Map<string|number|symbol|Node, (value:any)=>any>}
     */
    const listeners = new Map();

    return {
        [TYPE]: TYPE_REF,
        set current(nextValue) {
            if (nextValue != value) {
                value = nextValue;
                listeners.forEach((fn, id) => {
                    if (id instanceof Node && !id.isConnected) {
                        listeners.delete(id);
                        return;
                    }
                    return fn(value);
                });
            }
        },
        get current() {
            return value;
        },
        on(fn, id = Symbol()) {
            listeners.set(id, fn);
            return () => listeners.delete(id);
        },
        valueOf() {
            return value;
        }
    };
};
