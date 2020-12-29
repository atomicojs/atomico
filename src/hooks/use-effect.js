import { useHook } from "./create-hooks.js";
import { isEqualArray, isFunction } from "../utils.js";
/**
 * useLayoutEffect and useEffect have a similar algorithm
 * in that the position of the callback varies.
 * @param {1|2} type - 1 = useLayouteffect, 2 = useEffect
 */
let createEffect = (type) => (currentEffect, currentArgs) => {
    /**
     * clear or initialize the effect hook
     * @param {[Collector|boolean,any]} state
     * @param {*} unmounted
     */
    let effect = ([collector, args], unmounted) => {
        if (unmounted) {
            if (isFunction(collector)) collector();
        } else {
            return [collector ? collector : currentEffect(args), args];
        }
    };
    useHook(
        /**
         * Clean the effect hook
         * @param {[Collector|boolean,any[]]} state
         * @param {*} unmounted
         */
        ([collector, args] = []) => {
            if (args || !args) {
                if (args && isEqualArray(args, currentArgs)) {
                    collector = collector || true;
                } else {
                    if (isFunction(collector)) collector();
                    collector = null;
                }
            }
            return [collector, currentArgs];
        },
        type == 1 && effect,
        type == 2 && effect
    );
};

export let useLayoutEffect = createEffect(1);

export let useEffect = createEffect(2);

/**
 * @callback Collector
 */
