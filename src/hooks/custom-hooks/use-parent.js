import { useHost, useRef } from "../create-hooks.js";
import { useMemo, useInsertionEffect } from "../hooks.js";

/**
 *
 * @type {import("hooks").UseParent}
 */
export const useParent = (element, composed) => {
    const host = useHost();

    const ref = useRef();

    useInsertionEffect(
        () => () => {
            ref.current = null;
        },
        []
    );

    //@ts-ignore
    useMemo(() => {
        let { current } = host;
        const isString = typeof element === "string";
        //@ts-ignore
        while (
            (current = composed
                ? // @ts-ignore
                  current.assignedSlot || current.parentNode || current.host
                : current.parentNode)
        ) {
            const matches = isString
                ? current.matches?.(element)
                : //@ts-ignore
                  current instanceof element;
            if (matches) return (ref.current = current);
        }
    }, [ref.current]);

    return ref;
};
