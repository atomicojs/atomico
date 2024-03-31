import { addListener } from "../../utils.js";
import { IdSuspense, useHost } from "../create-hooks.js";
import { usePromise } from "../custom-hooks/use-promise.js";
import { useInsertionEffect, useState } from "../hooks.js";
import { SuspenseEvent } from "./use-suspence-events.js";

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
        let size = 0;
        let prevent = false;
        let rejected = false;
        let aborted = false;

        const check = () => {
            if (!prevent) {
                prevent = true;
                delay(() => {
                    prevent = false;
                    setStatus((state) =>
                        size
                            ? state.pending
                                ? state
                                : { pending: true }
                            : aborted
                              ? { aborted }
                              : rejected
                                ? { rejected }
                                : { fulfilled: true }
                    );
                }, fps);
            }
        };
        /**
         * @param {Event} event
         */
        const handler = (event) => {
            event.stopImmediatePropagation();
            const { type } = event;
            if (type === SuspenseEvent.pending) {
                size++;
                rejected = false;
                aborted = false;
            } else if (type === SuspenseEvent.fulfilled) {
                size--;
            } else if (type === SuspenseEvent.aborted) {
                size--;
                aborted = true;
            } else {
                size--;
                rejected = true;
            }
            check();
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
