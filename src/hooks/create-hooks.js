import { createRef, SymbolFor } from "../utils.js";

const ID = SymbolFor("hooks");

// previene la perdida de hook concurrente al duplicar el modulo
// This usually happens on Deno and Webpack
globalThis[ID] = globalThis[ID] || {};
/**
 * @type {{c:import("internal/hooks.js").SCOPE}}
 */
let SCOPE = globalThis[ID];

/**
 * Error id to escape execution of hooks.render
 */
export const UNMOUNT = "unmount";
/**
 * Error id to escape execution of hooks.render
 */
export const SUSPENSE = SymbolFor("hook/suspense");

/**
 * @type {import("core").UseHook}
 */
export const useHook = (render) => {
    const { i, hooks } = SCOPE.c;

    const hook = (hooks[i] = hooks[i] || {});

    hook.value = render(hook.value);

    SCOPE.c.i++;

    return hooks[i].value;
};

/**
 * @type {import("core").UseWhen}
 */
export const useWhen = (type, callback) => {
    const { i, hooks } = SCOPE.c;
    hooks[type] = hooks[type] || {};
    hooks[type][i] = callback;
    SCOPE.c.i++;
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
     * @type {import("internal/hooks.js").RenderHook}
     */
    const render = (callback) => {
        SCOPE.c = { host, hooks, update, i: 0, id };
        let value;
        try {
            suspense = false;
            value = callback();
        } catch (e) {
            if (e !== SUSPENSE) throw e;
            suspense = true;
        } finally {
            SCOPE.c = null;
        }
        return value;
    };

    /**
     * @type {import("internal/hooks.js").Dispatch}
     */
    const dispatch = (type, payload) => {
        const group = hooks[type];
        for (const index in group) group[index](payload);
    };

    return { render, dispatch, isSuspense };
};
