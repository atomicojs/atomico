/**
 * HOOK_CURRENT_REF is defined in synchronous execution time at the moment
 * of rendering a hook, this variable allows sharing
 * its context only when executed by load.
 * @type {Ref}
 */
let HOOK_CURRENT_REF;
/**
 * allows to increase the hook position index to recover the state
 * @type {number}
 */
let HOOK_CURRENT_KEY;

/**
 * hook that retrieves the last shared host to create Hooks
 * @returns {{current:HTMLElement}}
 */
export function useHost() {
    return useHook(
        (
            state = {
                current: HOOK_CURRENT_REF.host,
            }
        ) => state
    );
}
/**
 * Retrieves the courses associated with the hook
 * @param {Render} render - Function that runs in rendering
 * @param {CleanEffect} [rendered] - Synchronous execution function to call after rendering
 * @param {CleanEffect} [collector] - Asynchronous execution function to call after rendering
 */
export function useHook(render, rendered, collector) {
    return HOOK_CURRENT_REF.use(render, rendered, collector);
}
/**
 * hook that retrieves the render to restart the loop
 * @returns {()=>void}
 */
export function useRender() {
    return HOOK_CURRENT_REF.render;
}
/**
 * Create a hook store
 * @param {()=>void} render - Communicate a rendering request from the hooks
 * @param {any} host - Host context to share by the useHost hook
 */
export function createHooks(render, host) {
    /**
     * map of states associated with an increasing position
     * @type {Object<string,Hook>}
     **/
    let hooks = {};

    let ref = { use, host, render };

    /**
     * internal hook that allows the hook to retrieve the state at runtime
     * @type {Use}
     */
    function use(render, cleanLayoutEffect, cleanEffect) {
        let index = HOOK_CURRENT_KEY++;
        hooks[index] = [
            render(hooks[index] ? hooks[index][0] : void 0),
            cleanLayoutEffect,
            cleanEffect,
        ];
        return hooks[index][0];
    }

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
        HOOK_CURRENT_KEY = 0;
        HOOK_CURRENT_REF = ref;
        let value;
        try {
            value = callback();
        } finally {
            HOOK_CURRENT_REF = null;
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
 * @typedef {[Render,CleanEffect,CleanEffect]} Hook - Hook instance
 */

/**
 * @callback Render - Function that runs in rendering
 * @param {any} state
 * @returns {any}
 */

/**
 * @callback CleanEffect - Function that runs after rendering
 * @param {any} state
 * @param {boolean} [unmounted]
 * @returns {any}
 */

/**
 * @callback Use - Create or retrieve the cursor from a hook
 * @param {Render} render
 * @param {CleanEffect} [cleanLayoutEffect]
 * @param {CleanEffect} [cleanEffect]
 */

/**
 *
 * @typedef {Object} Ref - Global reference to the hook execution context
 * @property {()=>void} render
 * @property {any} host
 * @property {Use} use
 */
