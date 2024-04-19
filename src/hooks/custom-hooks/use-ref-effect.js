import { useInsertionEffect } from "../hooks.js";
import { useHost } from "../create-hooks.js";

/**
 * @type {import("hooks").UseRefEffect}
 */
export const useRefEffect = (callback, args) => {
    const host = useHost();

    useInsertionEffect(() => {
        let prevent = false;
        let collector;
        let callCollector = () => {
            if (collector) collector();
            collector = null;
        };

        const dispatch = async () => {
            if (!prevent) {
                prevent = true;
                await host.current.updated;
                callCollector();
                prevent = false;
                collector = callback();
            }
        };

        const unlisteners = args.map((ref) => ref?.on(dispatch));

        if (!host.once) {
            host.once = true;

            dispatch();
        }

        return () => {
            unlisteners.map((fn) => fn && fn());
            callCollector();
        };
    }, args);
};
