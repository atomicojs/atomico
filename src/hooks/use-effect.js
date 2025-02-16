import { isEqualArray, isFunction, SymbolFor } from "../utils.js";
import { IDUnmount, useRef, useWhen } from "./create-hooks.js";

/**
 * tag to identify the useEffect
 */
export const IdEffect = SymbolFor("hook/effect");

/**
 * tag to identify the useLayoutEffect
 */
export const IdLayoutEffect = SymbolFor("hook/layoutEffect");

/**
 * tag to identify the useInsertionEffect
 */
export const IdInsertionEffect = SymbolFor("hook/insertionEffect");
/**
 * useLayoutEffect and useEffect have a similar algorithm
 * in that the position of the callback varies.
 * @param {IdLayoutEffect|IdEffect|IdInsertionEffect} type
 * @return {import("internal/hooks.js").UseAnyEffect}
 */
const createEffect = (type) => (effect, currentArgs) => {
    /**
     * @type {import("hooks").Ref<{args?:any[], clean?:()=>void}>}
     */
    const { current } = useRef({});

    useWhen(type, () => {
        if (
            !current.args ||
            (current.args && !isEqualArray(current.args, currentArgs))
        ) {
            current.args = currentArgs;
            current.clean?.();
            const clean = effect();
            if (isFunction(clean)) {
                current.clean = () => {
                    clean();
                    delete current.args;
                    delete current.clean;
                };
            }
        }
    });

    useWhen(IDUnmount, () => current.clean?.());
};

export const useLayoutEffect = createEffect(IdLayoutEffect);

export const useEffect = createEffect(IdEffect);

export const useInsertionEffect = createEffect(IdInsertionEffect);
