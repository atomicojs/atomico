import { c, useEvent, useState, h, useEffect, useUpdate } from "./core.js";

export function useContext(context) {
    const dispatch = useEvent("ConnectContext", {
        bubbles: true,
        composed: true,
    });

    const update = useUpdate();

    const [elementContext] = useState(() => {
        /**
         * @type {Element}
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
}

/**
 * @template {{[index:string]:any}} T
 * @param {T} value
 * @returns {import("./element/custom-element").Atom}
 */
export const createContext = (value) => {
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
            value,
        },
    };

    const Context = c(context);

    //@ts-ignore
    Context.value = value;

    return Context;
};
