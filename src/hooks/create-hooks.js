/**
 * @type {{i:number,hooks:Object<number,Hook>,host:any, update:any}}
 */
let SCOPE;

/**
 * @type {import("core").UseHook}
 */
export let useHook = (render, layoutEffect, effect) => {
    let { i, hooks } = SCOPE;

    let hook = (hooks[i] = hooks[i] || {});

    hook[0] = render(hook[0]);
    hook[1] = layoutEffect;
    hook[2] = effect;

    SCOPE.i++;
    return hooks[i][0];
};

/**
 * @type {import("core").UseRef}
 */
export let useRef = (current) => useHook((ref = { current }) => ref);

/**
 * return the global host of the scope
 * @type {import("core").UseHost}
 */
export let useHost = () => useHook((ref = { current: SCOPE.host }) => ref);

/**
 * hook that retrieves the render to restart the loop
 * @type {import("core").UseUpdate}
 */
export let useUpdate = () => SCOPE.update;

/**
 * Create a hook store
 * @param {()=>void} [update] - Send the update request
 * @param {any} [host] - Host context to share by the useHost hook
 */
export function createHooks(update, host) {
    /**
     * map of states associated with an increasing position
     * @type {Object<string,Hook>}
     **/
    let hooks = {};

    /**
     * announces that the updates have finished allowing the
     * execution of the collectors
     * @param {1|2} type - 0 = useLayoutEffect 1 = useEffect
     * @param {boolean} [unmounted]
     */
    function cleanEffectsType(type, unmounted) {
        for (let index in hooks) {
            let hook = hooks[index];
            if (hook[type]) hook[0] = hook[type](hook[0], unmounted);
        }
    }
    /**
     * Create a global context to share with
     * the hooks synchronously and temporarily with the callback execution
     * @param {()=>any} callback - callback that consumes the global context through hooks
     * @returns {any}
     */
    function load(callback) {
        SCOPE = { host, hooks, update, i: 0 };
        let value;
        try {
            value = callback();
        } finally {
            SCOPE = null;
        }
        return value;
    }
    /**
     * Create a 2-step effect cleaning cycle,
     * first useLayoutEffect and then useEffect,
     * the latter is cleared after the callback is
     * executed as a return
     * @param {boolean} [unmounted]
     * @returns {()=>void}
     */
    function cleanEffects(unmounted) {
        cleanEffectsType(1, unmounted);
        return () => {
            cleanEffectsType(2, unmounted);
            if (unmounted) hooks = {};
        };
    }

    return { load, cleanEffects };
}

/**
 * @typedef {{0?:any,1?:CleanEffect,2?:CleanEffect}} Hook - Hook instance
 */

/**
 * @callback CleanEffect - Function that runs after rendering
 * @param {any} state
 * @param {boolean} [unmounted]
 * @returns {any}
 */
