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

    const detectContext = () => {
        /**
         * @type {import("context").Context<any>}
         */
        let elementContext;

        dispatch({
            context,
            /**
             *
             * @param {import("context").Context<any>} element
             */
            connect(element) {
                elementContext = element;
            },
        });

        return elementContext;
    };

    const [elementContext, setElementContext] = useState(detectContext);

    useEffect(() => {
        // regenerate the connection to retrieve a context at non-parallel mount time
        setElementContext(detectContext);

        if (!elementContext) return;

        elementContext.addEventListener("UpdatedValue", update);
        return () => elementContext.removeEventListener("UpdatedValue", update);
    }, [elementContext]);

    return elementContext ? elementContext.value : context.value;
};

/**
 * @type {import("context").CreateContext}
 */
export let createContext = (value) => {
    /**
     *
     * @type {import("component").Component<{value:{}}>}
     */
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
            event: { type: "UpdatedValue" },
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
