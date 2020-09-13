import { createHooks } from "../hooks/create-hooks.js";
import { render } from "../render.js";

/**
 * This function isolates the context used to dispatch updates to the DOM and associate update
 * @param {import("./custom-element").BaseContext} context
 * @param {(props:object)=>object} component
 */
export async function setup(context, component) {
    let id = Symbol();
    let hooks = createHooks(() => context.update(), context);
    let prevent;

    context.update = async () => {
        if (!prevent) {
            prevent = true;
            /**@type {()=>void} */
            let resolveUpdate;
            context.updated = new Promise(
                (resolve) => (resolveUpdate = resolve)
            ).then(hooks.updated);

            await context.mounted;

            render(hooks.load(component, { ...context._props }), context, id);

            prevent = false;

            resolveUpdate();
        }
    };

    await context.unmounted;

    hooks.updated(true);
}
