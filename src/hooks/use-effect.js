import {
    useHook,
    IdLayoutEffect,
    IdEffect,
    IdInsertionEffect
} from "./create-hooks.js";
import { isEqualArray, isFunction } from "../utils.js";

/**
 * useLayoutEffect and useEffect have a similar algorithm
 * in that the position of the callback varies.
 * @param {IdLayoutEffect|IdEffect|IdInsertionEffect} type
 * @return {import("internal/hooks.js").UseAnyEffect}
 */
const createEffect = (type) => (currentEffect, currentArgs) => {
    useHook(
        /**
         * Clean the effect hook
         * @type {import("internal/hooks.js").CollectorEffect}
         */

        ([collector, args] = []) => {
            if (args || !args) {
                if (args && isEqualArray(args, currentArgs)) {
                    collector = collector || true;
                } else {
                    // TS does not infer the following conditional
                    // @ts-ignore
                    isFunction(collector) && collector();
                    collector = null;
                }
            }
            return [collector, currentArgs];
        },
        /**
         * @returns {any}
         */
        ([collector, args], unmounted) => {
            if (unmounted) {
                // ts does not infer the following conditional
                isFunction(collector) && collector();
                return [];
            } else {
                return [collector ? collector : currentEffect(), args];
            }
        },
        type
    );
};

export const useLayoutEffect = createEffect(IdLayoutEffect);

export const useEffect = createEffect(IdEffect);

export const useInsertionEffect = createEffect(IdInsertionEffect);
