import { c } from "./element/custom-element.js";
import { useHost, useRef, useUpdate } from "./hooks/create-hooks.js";
import { useEvent } from "./hooks/custom-hooks/use-event.js";
import { useEffect, useInsertionEffect, useState } from "./hooks/hooks.js";
import { options } from "./options.js";
import { h } from "./render.js";
import { addListener } from "./utils.js";
import { DOMLoaded } from "./loaded.js";

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
                    if (
                        event.currentTarget !== event.target &&
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
 * @type {import("context").UseConsumer}
 */
export const useConsumer = (id) => {
    /**
     * @type {import("context").DispatchConnectContext}
     */
    const dispatch = useEvent("ConnectContext", {
        bubbles: true,
        composed: true
    });

    const detectValueFromProvider = () => {
        if (options.ssr) return;

        let valueFromProvider;

        dispatch({
            id,
            connect(value) {
                valueFromProvider = value;
            }
        });

        return valueFromProvider;
    };

    const [valueFromProvider, setValueFromProvider] = useState(
        detectValueFromProvider
    );

    useEffect(() => {
        if (valueFromProvider) return;
        DOMLoaded.then(() => setValueFromProvider(detectValueFromProvider));
    }, [id]);

    return valueFromProvider;
};

/**
 *
 * @type {import("context").UseContext}
 */
export const useContext = (context) => {
    /**
     * @type {import("core").Ref}
     */
    const valueFromProvider = useConsumer(context);

    const update = useUpdate();

    useEffect(() => {
        if (valueFromProvider) {
            return valueFromProvider.on(update);
        }
    }, [valueFromProvider]);

    return valueFromProvider?.current || context[CONTEXT_VALUE];
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
