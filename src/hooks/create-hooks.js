export const HOOK_MOUNT = 1;

export const HOOK_MOUNTED = 2;

export const HOOK_UPDATE = 3;

export const HOOK_UPDATED = 4;

export const HOOK_UNMOUNT = 5;

/**
 * @type {{index?:number,ref?:any}}
 */
export const HOOK_CURRENT = {};

/**
 * @template T
 * @callback reducer
 * @param {T} state
 * @param {number} type
 * @returns {T}
 */

/**
 * @template T
 * @typedef {[(state:T,type:number )=>T,T]} hook
 */

/**
 * @template T
 * @param {hook<T>} hook
 * @param {number} type
 */
function update(hook, type) {
    hook[0] && (hook[1] = hook[0](hook[1], type));
}

/**
 * @template T
 * @param {Object.<number,hook<any>>} hooks
 * @param {number} type
 */
function updateAll(hooks, type) {
    for (let i in hooks) update(hooks[i], type);
}
/**
 * @template T
 * @param {reducer<any>|0} reducer
 * @param {T} [initialState]
 * @returns {T}
 */
export function useHook(reducer, initialState) {
    if (HOOK_CURRENT.ref.hook) {
        return HOOK_CURRENT.ref.hook.use(reducer, initialState)[1];
    }
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
     * @type {Object.<number,hook<any>>}
     **/
    let hooks = {};

    let mounted;

    let hook = {
        use,
        load,
        updated,
        unmount,
    };

    let ref = { hook, host, render };
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
     * @param {reducer<T>} reducer
     * @param {T} state
     */
    function use(reducer, state) {
        let index = HOOK_CURRENT.index++;
        let mount;
        // record the hook and the initial state of this
        if (!hooks[index]) {
            hooks[index] = [null, state];
            mount = 1;
        }
        // The hook always receives the last reduce.
        hooks[index][0] = reducer;

        update(hooks[index], mount ? HOOK_MOUNT : HOOK_UPDATE);

        return hooks[index];
    }
    function updated() {
        let type = mounted ? HOOK_UPDATED : HOOK_MOUNTED;
        mounted = 1;
        updateAll(hooks, type);
    }
    function unmount() {
        updateAll(hooks, HOOK_UNMOUNT);
    }
    return hook;
}
