/**
 * @type {import("internal/hooks").SCOPE}
 */
let SCOPE;

/**
 * Error id to escape execution of hooks.load
 */
export const IdSuspense = Symbol();

/**
 * tag to identify the useEffect
 */
export const IdEffect = Symbol("Effect");

/**
 * tag to identify the useLayoutEffect
 */
export const IdLayoutEffect = Symbol("LayoutEffect");

/**
 * tag to identify the useInsertionEffect
 */
export const IdInsertionEffect = Symbol("InsertionEffect");

/**
 * @type {import("core").UseHook}
 */
export const useHook = (render, effect, tag) => {
    let { i, hooks } = SCOPE;

    let hook = (hooks[i] = hooks[i] || {});

    hook.value = render(hook.value);
    hook.effect = effect;
    hook.tag = tag;

    SCOPE.i++;

    return hooks[i].value;
};

/**
 * @type {import("core").UseRef}
 */
export const useRef = (current) => useHook((ref = { current }) => ref);

/**
 * return the global host of the scope
 * @type {import("core").UseHost}
 */
export const useHost = () => useHook((ref = { current: SCOPE.host }) => ref);

/**
 * hook that retrieves the render to restart the loop
 * @type {import("core").UseUpdate}
 */
export const useUpdate = () => SCOPE.update;

/**
 * @type {import("internal/hooks").CreateHooks}
 */
export const createHooks = (update, host) => {
    /**
     * @type {import("internal/hooks").Hooks}
     **/
    let hooks = {};

    /**
     * announces that the updates have finished allowing the
     * execution of the collectors
     * @param {import("internal/hooks").Hook["tag"]} tag
     * @param {boolean} [unmounted]
     */
    function cleanEffectsByType(tag, unmounted) {
        for (let index in hooks) {
            let hook = hooks[index];
            if (hook.effect && hook.tag === tag) {
                hook.value = hook.effect(hook.value, unmounted);
            }
        }
    }
    /**
     * @type {import("internal/hooks").Load}
     */
    function load(callback) {
        SCOPE = { host, hooks, update, i: 0 };
        let value;
        try {
            value = callback();
        } catch (e) {
            if (e !== IdSuspense) throw e;
        } finally {
            SCOPE = null;
        }
        return value;
    }

    /**
     * @type {import("internal/hooks").CleanEffects}
     */
    const cleanEffects = (unmounted) => {
        cleanEffectsByType(IdInsertionEffect, unmounted);
        return () => {
            cleanEffectsByType(IdLayoutEffect, unmounted);
            return () => {
                cleanEffectsByType(IdEffect, unmounted);
                if (unmounted) hooks = {};
            };
        };
    };

    return { load, cleanEffects };
};
