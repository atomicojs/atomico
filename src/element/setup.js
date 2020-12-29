import { createHooks } from "../hooks/create-hooks.js";
import { render } from "../render.js";

/**
 * This function isolates the context used to dispatch updates to the DOM and associate update
 * @param {import("./custom-element").BaseContext} context
 * @param {(props:object)=>object} component
 */
export async function setup(context, component) {
    let symbolId = Symbol();
    let hooks = createHooks(() => context.update(), context);
    let prevent;

    // symbolId allows to obtain the symbol id that stores the state of the virtual-dom
    context.symbolId = symbolId;

    context.mounted = new Promise((resolve) => (context.mount = resolve));

    context.unmounted = new Promise((resolve) => (context.unmount = resolve));

    const loadComponent = () => component({ ...context._props });

    context.update = async () => {
        if (!prevent) {
            prevent = true;
            /**@type {(value:any)=>void} */
            let resolveUpdate;

            context.updated = new Promise(
                (resolve) => (resolveUpdate = resolve)
            ).then(
                // asynchronously clean the effects of useEffect
                (cleanEffect) => cleanEffect()
            );

            await context.mounted;

            render(hooks.load(loadComponent), context, symbolId);

            prevent = false;

            // Runs the useLayoutEffect cleanup synchronously

            resolveUpdate(hooks.cleanEffects());
        }
    };

    await context.unmounted;

    hooks.cleanEffects(true)();
}
