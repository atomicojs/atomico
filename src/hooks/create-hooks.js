import { createRef } from "../ref.js";

const ID = Symbol.for("atomico.hooks");

// previene la perdida de hook concurrente al duplicar el modulo
// This usually happens on Deno and Webpack
globalThis[ID] = globalThis[ID] || {};
/**
 * @type {{c:import("internal/hooks.js").SCOPE}}
 */
let SCOPE = globalThis[ID];

/**
 * Error id to escape execution of hooks.load
 */
export const IdSuspense = Symbol.for("Atomico.suspense");

/**
 * tag to identify the useEffect
 */
export const IdEffect = Symbol.for("Atomico.effect");

/**
 * tag to identify the useLayoutEffect
 */
export const IdLayoutEffect = Symbol.for("Atomico.layoutEffect");

/**
 * tag to identify the useInsertionEffect
 */
export const IdInsertionEffect = Symbol.for("Atomico.insertionEffect");

/**
 * @type {import("core").UseHook}
 */
export const useHook = (render, effect, tag) => {
    const { i, hooks } = SCOPE.c;

    const hook = (hooks[i] = hooks[i] || {});

    hook.value = render(hook.value);
    hook.effect = effect;
    hook.tag = tag;

    SCOPE.c.i++;

    return hooks[i].value;
};

/**
 * @type {import("core").UseRef}
 */
export const useRef = (current) => useHook((ref = createRef(current)) => ref);

/**
 * return the global host of the scope
 * @type {import("core").UseHost}
 */
export const useHost = () => useHook((ref = createRef(SCOPE.c.host)) => ref);

/**
 * hook that retrieves the render to restart the loop
 * @type {import("core").UseUpdate}
 */
export const useUpdate = () => SCOPE.c.update;

/**
 * @type {import("core").UseId}
 */
export const useId = () => useHook(() => SCOPE.c.id + "-" + SCOPE.c.i);

/**
 * @type {import("internal/hooks.js").CreateHooks}
 */
export const createHooks = (update, host, id = 0) => {
    /**
     * @type {import("internal/hooks.js").Hooks}
     **/
    let hooks = {};
    let suspense = false;

    const isSuspense = () => suspense;
    /**
     * announces that the updates have finished allowing the
     * execution of the collectors
     * @param {import("internal/hooks.js").Hook["tag"]} tag
     * @param {boolean} [unmounted]
     */
    const cleanEffectsByType = (tag, unmounted) => {
        for (const index in hooks) {
            const hook = hooks[index];
            if (hook.effect && hook.tag === tag) {
                hook.value = hook.effect(hook.value, unmounted);
            }
        }
    };
    /**
     * @type {import("internal/hooks.js").Load}
     */
    const load = (callback) => {
        SCOPE.c = { host, hooks, update, i: 0, id };
        let value;
        try {
            suspense = false;
            value = callback();
        } catch (e) {
            if (e !== IdSuspense) throw e;
            suspense = true;
        } finally {
            SCOPE.c = null;
        }
        return value;
    };
    /**
     * @type {import("internal/hooks.js").CleanEffects}
     */
    const cleanEffects = (unmounted) => {
        cleanEffectsByType(IdInsertionEffect, unmounted);
        return () => {
            cleanEffectsByType(IdLayoutEffect, unmounted);
            return () => {
                cleanEffectsByType(IdEffect, unmounted);
                /**
                 * currently the state of the props is preserved
                 * at the node level, if the node is deleted the
                 * state of the props persists so the state of
                 *  the DOM must also persist
                 */
                // if (unmounted) hooks = {};
            };
        };
    };

    return { load, cleanEffects, isSuspense };
};
