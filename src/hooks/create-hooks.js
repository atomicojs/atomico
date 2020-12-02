/**
 * @type {Ref}
 * HOOK_CURRENT_REF is defined in synchronous execution time at the moment
 * of rendering a hook, this variable allows sharing
 * its context only when executed by load.
 */
let HOOK_CURRENT_REF;
/**
 * @type {number}
 * allows to increase the hook position index to recover the state
 */
let HOOK_CURRENT_KEY;

/**
 * hook that retrieves the last shared host to create Hooks
 * @returns {{[index:string]:any}}
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
 * @template T
 * @param {RenderHook} render
 * @param {CollectorHook} [collector] - callback that subscribes to updated changes
 * @returns {T}
 */
export function useHook(render, collector) {
    return HOOK_CURRENT_REF.use(render, collector);
}
/**
 * hook that retrieves the render to restart the loop
 * @returns {()=>void}
 */
export function useRender() {
    return HOOK_CURRENT_REF.render;
}
/**
 *
 * @param {()=>void} render
 * @param {any} host
 */
export function createHooks(render, host) {
    /**
     * @type {Object<string,Hook>}
     * map of states associated with an increasing position
     **/
    let hooks = {};

    let ref = { use, host, render };
    /**
     * @template T,R
     * @param {(param:T)=>R} callback
     * @param {T} param
     * @returns {R}
     */
    function load(callback, param) {
        HOOK_CURRENT_KEY = 0;
        HOOK_CURRENT_REF = ref;
        let resolve = callback(param);
        HOOK_CURRENT_REF = null;
        return resolve;
    }
    /**
     * internal hook that allows the hook to retrieve the state at runtime
     * @param {RenderHook} render
     * @param {CollectorHook} [collector]
     */
    function use(render, collector) {
        let index = HOOK_CURRENT_KEY++;
        hooks[index] = [
            render(hooks[index] ? hooks[index][0] : void 0),
            collector,
        ];
        return hooks[index][0];
    }

    /**
     * announces that the updates have finished allowing the
     * execution of the collectors
     * @param {boolean} [unmounted]
     */
    function updated(unmounted) {
        for (let index in hooks) {
            let hook = hooks[index];
            if (hook[1]) hook[0] = hook[1](hook[0], unmounted);
        }
        // if unmounted is defined, the stored states will be destroyed
        if (unmounted) hooks = {};
    }

    return {
        load,
        updated,
    };
}

/**
 * @typedef {[any,CollectorHook]} Hook
 */

/**
 * @callback RenderHook
 * @param {any} state
 * @returns {any}
 */

/**
 * @callback CollectorHook
 * @param {any} state
 * @param {boolean} [unmounted]
 * @returns {any}
 */

/**
 * @typedef {Object} Ref
 * @property {()=>void} render
 * @property {any} host
 * @property {(hook:RenderHook,collector:CollectorHook)=>any} use
 */
