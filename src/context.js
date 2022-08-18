import { c, useEvent, useState, h, useEffect, useUpdate } from "./core.js";

/**
 *
 * @type {import("context").UseContext}
 */
export let useContext = (context) => {
    const dispatch = useEvent("ConnectContext", {
        bubbles: true,
        composed: true,
    });

    const update = useUpdate();

    const [elementContext] = useState(() => {
        /**
         * @type {import("context").Context<any>}
         */
        let elementContext;

        dispatch({
            context,
            connect(element) {
                elementContext = element;
            },
        });

        return elementContext;
    });

    useEffect(() => {
        elementContext.addEventListener("UpdatedContext", update);
        return () =>
            elementContext.removeEventListener("UpdatedContext", update);
    }, [elementContext]);

    return elementContext ? elementContext.value : context.value;
};

/**
 * @type {import("context").CreateContext}
 */
export let createContext = (value) => {
    const context = () =>
        h("host", {
            onConnectContext(event) {
                if (event?.detail?.context === Context) {
                    event.stopPropagation();
                    event?.detail.connect(event.currentTarget);
                }
            },
        });

    context.props = {
        value: {
            type: Object,
            event: { type: "UpdatedContext" },
            value: () => value,
        },
    };
    /**
     * @todo Discover a more aesthetic solution at the type level
     * TS tries to set local class rules, these should be ignored
     * @type {any}
     */
    const Context = c(context);

    Context.value = value;

    return Context;
};
