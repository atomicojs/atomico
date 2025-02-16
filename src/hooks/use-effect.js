import { isEqualArray, SymbolFor } from "../utils.js";
import { UNMOUNT, useRef, useWhen } from "./create-hooks.js";

/**
 * tag to identify the useEffect
 */
export const EFFECT = SymbolFor("hook/effect");

/**
 * tag to identify the useLayoutEffect
 */
export const LAYOUT_EFFECT = SymbolFor("hook/layoutEffect");

/**
 * tag to identify the useInsertionEffect
 */
export const INSERTION_EFFECT = SymbolFor("hook/insertionEffect");

/**
 * useLayoutEffect and useEffect have a similar algorithm
 * in that the position of the callback varies.
 * @param { LAYOUT_EFFECT | EFFECT | INSERTION_EFFECT } type
 * @return {import("internal/hooks.js").UseAnyEffect}
 */
const createEffect = (type) => (effect, currentArgs) => {
    /**
     * @type {import("hooks").Ref<{args?:any[], clean?:()=>void}>}
     */
    const ref = useRef({});

    useWhen(type, () => {
        const { current } = ref;
        if (
            !current.args ||
            (current.args && !isEqualArray(current.args, currentArgs))
        ) {
            current.args = currentArgs;
            current.clean?.();

            //⚠️ The return of an effect must always be void or a function
            const clean = effect();
            if (clean) current.clean = clean;
        }
    });

    useWhen(UNMOUNT, () => {
        if (ref.current.clean) {
            ref.current.clean();
            ref.current = {};
        }
    });
};

export const useInsertionEffect = createEffect(INSERTION_EFFECT);

export const useLayoutEffect = createEffect(LAYOUT_EFFECT);

export const useEffect = createEffect(EFFECT);
