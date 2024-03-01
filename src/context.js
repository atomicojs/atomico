import { c } from "./element/custom-element.js";
import { SymbolFor, addListener } from "./utils.js";
import { useHost, useUpdate } from "./hooks/create-hooks.js";
import { useEvent } from "./hooks/custom-hooks/use-event.js";
import { useInsertionEffect, useEffect, useState } from "./hooks/hooks.js";
import { h } from "./render.js";

const CONTEXT_TEMPLATE = h("host", { style: "display: contents" });

const CONTEXT_PROMISE = SymbolFor("atomico/context");

/**
 * @type {import("context").UseProvider}
 */
export const useProvider = (id, value) => {
    const host = useHost();

    useInsertionEffect(
        () =>
            addListener(
                host.current,
                "ConnectContext",
                /**
                 * @param {CustomEvent<import("context").DetailConnectContext>} event
                 */
                (event) => {
                    if (id === event.detail.id) {
                        event.stopPropagation();
                        event.detail.connect(value);
                    }
                }
            ),
        [id]
    );
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
        // Create a promise to wait for the definition to
        // trigger the resynchronization of contexts.
        if (!id[CONTEXT_PROMISE]) {
            id[CONTEXT_PROMISE] = customElements.whenDefined(
                new id().localName
            );
        }
        id[CONTEXT_PROMISE].then(() =>
            setValueFromProvider(detectValueFromProvider)
        );
    }, [id]);

    return valueFromProvider;
};

/**
 *
 * @type {import("context").UseContext}
 */
export const useContext = (context) => {
    /**
     * @type {InstanceType<import("core").JSX<{value:any}>>}
     */
    const valueFromProvider = useConsumer(context);

    const update = useUpdate();

    useEffect(() => {
        if (valueFromProvider) {
            return addListener(valueFromProvider, "UpdatedValue", update);
        }
    }, [valueFromProvider]);

    return (valueFromProvider || context).value;
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
        () => {
            useProvider(Context, useHost().current);
            return CONTEXT_TEMPLATE;
        },
        {
            props: {
                value: {
                    type: Object,
                    event: { type: "UpdatedValue" },
                    value: () => value
                }
            }
        }
    );

    Context.value = value;

    return Context;
};
