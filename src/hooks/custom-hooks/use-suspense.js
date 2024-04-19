import { useMemo, useState } from "../hooks.js";
import { createContext, useProvider } from "../../context.js";

export const SuspenseEvent = {
    pending: "PendingSuspense",
    fulfilled: "FulfilledSuspense",
    rejected: "RejectedSuspense",
    aborted: "AbortedSuspense"
};

export const SuspenseContext = createContext({
    /**
     *
     * @param {string} type
     * @param {string} id
     */
    dispatch(type, id) {}
});

/**
 *
 * @type {import("core").UseSuspense}
 */

export const useSuspense = (fps = 8) => {
    /**
     * @type {import("internal/hooks.js").ReturnSetStateUseSuspense}
     */
    const [status, setStatus] = useState({ pending: true });

    /**
     *
     * @param {()=>any} callback
     * @param {number} deep
     */
    const delay = (callback, deep) =>
        requestAnimationFrame(() =>
            deep ? delay(callback, --deep) : callback()
        );

    const context = useMemo(() => {
        const values = new Set();
        let prevent = false;
        let rejected = false;
        let aborted = false;

        /**
         * Check if tasks are pending at the DOM tree level.
         */
        const progress = () => {
            if (!prevent) {
                prevent = true;
                delay(() => {
                    prevent = false;
                    setStatus((state) =>
                        values.size
                            ? state.pending
                                ? state
                                : { pending: true }
                            : aborted
                              ? state.aborted
                                  ? state
                                  : { aborted }
                              : rejected
                                ? state.rejected
                                    ? state
                                    : { rejected }
                                : state.fulfilled
                                  ? state
                                  : { fulfilled: true }
                    );
                }, fps);
            }
        };
        /**
         *
         * @param {string} type
         * @param {string} id
         */
        const dispatch = (type, id) => {
            if (type === SuspenseEvent.pending) {
                values.add(id);
                progress();
            } else if (values.has(id)) {
                values.delete(id);
                if (type === SuspenseEvent.fulfilled) {
                } else if (type === SuspenseEvent.aborted) {
                    aborted = true;
                } else {
                    rejected = true;
                }
                progress();
            }
        };

        return { dispatch };
    }, []);

    useProvider(SuspenseContext, context);

    return status;
};
