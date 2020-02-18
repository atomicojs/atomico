export const HOOK_MOUNT = Symbol("mount");
export const HOOK_MOUNTED = Symbol("mounted");
export const HOOK_UPDATE = Symbol("update");
export const HOOK_UPDATED = Symbol("updated");
export const HOOK_UNMOUNT = Symbol("unmount");
export const HOOK_CURRENT = {};

function update(hook, type) {
    hook[0] && (hook[1] = hook[0](hook[1], type));
}

function updateAll(hooks, type) {
    for (let i in hooks) update(hooks[i], type);
}

export function useHook(reducer, initialState) {
    if (HOOK_CURRENT.ref.hook) {
        return HOOK_CURRENT.ref.hook.use(reducer, initialState)[1];
    }
}

export function useRender() {
    return HOOK_CURRENT.ref.render;
}

export function createHooks(render, host) {
    let hooks = {};
    let mounted;
    let hook = {
        use,
        load,
        updated,
        unmount
    };

    let ref = { hook, host, render };

    function load(callback, param) {
        HOOK_CURRENT.index = 0;
        HOOK_CURRENT.ref = ref;
        let resolve = callback(param);
        HOOK_CURRENT.ref = 0;
        return resolve;
    }
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
