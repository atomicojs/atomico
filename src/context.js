import { c } from "./element/custom-element.js";
import { addListener } from "./utils.js";
import { useHost, useUpdate } from "./hooks/create-hooks.js";
import { useEvent } from "./hooks/custom-hooks/use-event.js";
import { useInsertionEffect, useEffect, useState } from "./hooks/hooks.js";

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
        composed: true,
    });

    const detectValueFromProvider = () => {
        let valueFromProvider;
        dispatch({
            id,
            connect(value) {
                valueFromProvider = value;
            },
        });

        return valueFromProvider;
    };

    const [valueFromProvider, setValueFromProvider] = useState(
        detectValueFromProvider
    );

    useEffect(() => {
        setValueFromProvider(detectValueFromProvider);
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
     * @type {import("context").ComponentContext<any>}
     */
    const context = () => void useProvider(Context, useHost().current);

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
