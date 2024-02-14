import { useInsertionEffect } from "../hooks.js";
import { useHost } from "../create-hooks.js";

/**
 * @type {import("internal/hooks.js").UseAnyEffect< import("../create-hooks.js").Ref >}
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

        args.forEach((ref) => {
            ref.add(dispatch);
        });

        if (!host.once) {
            host.once = true;
            dispatch();
        }

        return () => {
            args.forEach((ref) => ref.delete(dispatch));
            callCollector();
        };
    }, args);
};
