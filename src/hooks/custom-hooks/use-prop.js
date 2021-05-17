import { useHost } from "../create-hooks.js";

/**
 *
 * @param {string} name
 * @returns {UsePropReturn}
 */
export function useProp(name) {
    let ref = useHost();
    if (name in ref.current) {
        if (!ref[name]) {
            /**@type {UsePropReturn} */
            let updater = [
                null,
                (nextValue) => (ref.current[name] = nextValue),
            ];
            ref[name] = updater;
        }
        ref[name][0] = ref.current[name];
        return ref[name];
    }
}

/**
 * @typedef {[any,(nextValue:any)=>any]} UsePropReturn
 */
