import { addListener } from "../../utils.js";
import { IdSuspense, useHost } from "../create-hooks.js";
import { usePromise } from "../custom-hooks/use-promise.js";
import { useInsertionEffect, useState } from "../hooks.js";
import { SuspenseEvent } from "./use-suspense-events.js";

/**
 * @type {import("core").UseAsync}
 */
export const useAsync = (callback, args) => {
    const status = usePromise(callback, args);

    if (status.pending) {
        throw IdSuspense;
    }
    //@ts-ignore
    return status.result;
};

/**
 *
 * @type {import("core").UseSuspense}
 */

export const useSuspense = (fps = 8) => {
    const host = useHost();
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

    useInsertionEffect((r) => {
        const { current } = host;
        const values = new Set();
        let prevent = false;
        let rejected = false;
        let aborted = false;
        /**
         * Check if tasks are pending at the DOM tree level.
         */
        const check = () => {
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
         * @param {CustomEvent<string>} event
         */
        const handler = (event) => {
            event.stopImmediatePropagation();
            const { type, detail } = event;
            /**
             * Generates a bookmark based on the hook's ID.
             * This bookmark is observed only if the ID is
             * initialized from the SuspenseEvent.pending
             * event type.
             */
            if (type === SuspenseEvent.pending) {
                values.add(detail);
                check();
            } else if (values.has(detail)) {
                values.delete(detail);
                if (type === SuspenseEvent.fulfilled) {
                } else if (type === SuspenseEvent.aborted) {
                    aborted = true;
                } else {
                    rejected = true;
                }
                check();
            }
        };

        const unlisteners = [
            addListener(current, SuspenseEvent.pending, handler),
            addListener(current, SuspenseEvent.fulfilled, handler),
            addListener(current, SuspenseEvent.rejected, handler),
            addListener(current, SuspenseEvent.aborted, handler)
        ];

        return () => unlisteners.forEach((unlistener) => unlistener());
    }, []);

    return status;
};
