/**
 * @type {{index?:number,ref?:any}}
 */
export const HOOK_CURRENT = {};

/**
 * @returns {{[index:string]:any}}
 */
export function useHost() {
    return useHook(
        (
            state = {
                current: HOOK_CURRENT.ref.host,
            }
        ) => state
    );
}
/**
 * @template T
 * @param {RenderHook} render
 * @param {CollectorHook} [collector]
 * @returns {T}
 */
export function useHook(render, collector) {
    return HOOK_CURRENT.ref.use(render, collector);
}
/**
 * @returns {()=>void}
 */
export function useRender() {
    return HOOK_CURRENT.ref.render;
}
/**
 *
 * @param {()=>void} render
 * @param {any} host
 */
export function createHooks(render, host) {
    /**
     * @type {Object.<string,Hook<any>>}
     **/
    let hooks = {};

    let hook = {
        use,
        load,
        updated,
    };

    let ref = { use, host, render };
    /**
     * @template T,R
     * @param {(param:T)=>R} callback
     * @param {T} param
     * @returns {R}
     */
    function load(callback, param) {
        HOOK_CURRENT.index = 0;
        HOOK_CURRENT.ref = ref;
        let resolve = callback(param);
        HOOK_CURRENT.ref = 0;
        return resolve;
    }
    /**
     * @template T
     * @param {RenderHook} render
     * @param {CollectorHook} [collector]
     */
    function use(render, collector) {
        let index = HOOK_CURRENT.index++;
        hooks[index] = [
            render(hooks[index] ? hooks[index][0] : void 0),
            collector,
        ];
        return hooks[index][0];
    }

    /**
     * @param {boolean} [unmounted]
     */
    function updated(unmounted) {
        for (let index in hooks) {
            let hook = hooks[index];
            if (hook[1]) hook[0] = hook[1](hook[0], unmounted);
        }
    }
    return hook;
}

/**
 * @template T
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
