import { options } from "./options.js";
import { c } from "./element/custom-element.js";
import { useHost, useRef, useUpdate } from "./hooks/create-hooks.js";
import { useEvent } from "./hooks/custom-hooks/use-event.js";
import { useEffect, useInsertionEffect, useState } from "./hooks/hooks.js";
import { DOMLoaded } from "./loaded.js";
import { h } from "./render.js";
import { addListener } from "./utils.js";

const CONTEXT_TEMPLATE = h("host", { style: "display: contents" });

const CONTEXT_VALUE = "value";

/**
 * @type {import("context").UseProvider}
 */
export const useProvider = (id, value) => {
    const host = useHost();

    const ref = useRef();

    useInsertionEffect(
        () =>
            addListener(
                host.current,
                "ConnectContext",
                /**
                 * @param {CustomEvent<import("context").DetailConnectContext>} event
                 */
                (event) => {
                    const target = event.composedPath().at(0);
                    if (
                        target !== event.currentTarget &&
                        id === event.detail.id
                    ) {
                        event.stopPropagation();
                        event.detail.connect(ref);
                    }
                }
            ),
        [id]
    );

    ref.current = value;
};

/**
 *
 * @type {import("context").UseContext}
 */
export const useContext = (id) => {
    const dispatch = useEvent("ConnectContext", {
        bubbles: true,
        composed: true
    });

    const [parentContext, setParentContext] = useState(() => {
        if (options.ssr) return;
        /**
         * @type {import("core").Ref}
         */
        let currentParentContext;
        dispatch({
            id,
            /**
             * @param {import("core").Ref} parentContext
             */
            connect(parentContext) {
                currentParentContext = parentContext;
            }
        });
        return currentParentContext;
    });

    const update = useUpdate();

    useEffect(() => {
        DOMLoaded.then(() =>
            dispatch({
                id,
                connect: setParentContext
            })
        );
    }, [id]);

    useEffect(() => {
        if (!parentContext) return;
        return parentContext.on(update);
    }, [parentContext]);

    return parentContext?.current || id[CONTEXT_VALUE];
};

/**
 * @type {import("context").CreateContext}
 */
export const createContext = (value) => {
    /**
     * @todo Discover a more aesthetic solution at the type level
     * TS tries to set local class rules, these should be ignored
     * @type {any}
     */
    const Context = c(
        ({ value }) => {
            useProvider(Context, value);
            return CONTEXT_TEMPLATE;
        },
        {
            props: {
                value: {
                    type: Object,
                    value: () => value
                }
            }
        }
    );

    Context[CONTEXT_VALUE] = value;

    return Context;
};
