import { c } from "./element/custom-element.js";
import { useHost, useUpdate } from "./hooks/create-hooks.js";
import { useEvent } from "./hooks/custom-hooks/use-event.js";
import { useEffect, useInsertionEffect, useState } from "./hooks/hooks.js";
import { DOMLoaded } from "./loaded.js";
import { createElement } from "./render.js";
import { addListener } from "./utils.js";

const CONTEXT_TEMPLATE = createElement("host", { style: "display: contents" });

const CONTEXT_VALUE = "value";

const CONTEXT_CHANGE_EVENT = "ChangedValue";

const CONTEXT_CONNECT_EVENT = "ConnectContext";

/**
 * @type {import("context").UseProvider}
 */
export const useProvider = (id, value) => {
    const host = useHost();
    const dispatch = useEvent(CONTEXT_CHANGE_EVENT);

    useInsertionEffect(() => {
        dispatch();
    }, [value]);

    useInsertionEffect(
        () =>
            addListener(
                host.current,
                CONTEXT_CONNECT_EVENT,
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
                        event.detail.connect(host.current);
                    }
                }
            ),
        [id]
    );

    host.current[CONTEXT_VALUE] = value;
};

/**
 *
 * @type {import("context").UseContext}
 */
export const useContext = (id) => {
    const dispatch = useEvent(CONTEXT_CONNECT_EVENT, {
        bubbles: true,
        composed: true
    });

    const [parentContext, setParentContext] = useState(() => {
        /**
         * @type {EventTarget}
         */
        let currentParentContext;
        dispatch({
            id,
            /**
             * @param {EventTarget} parentContext
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
        return addListener(parentContext, CONTEXT_CHANGE_EVENT, () => {
            update();
        });
    }, [parentContext]);

    return parentContext?.[CONTEXT_VALUE] || id[CONTEXT_VALUE];
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
