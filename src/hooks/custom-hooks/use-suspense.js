import { useHost, IdSuspense } from "../create-hooks.js";
import { useEvent } from "./use-event.js";
import { usePromise } from "./use-promise.js";
import { useInsertionEffect, useLayoutEffect, useState } from "../hooks.js";
import { addListener } from "../../utils.js";

/**
 * @type {EventInit}
 */
const Config = { bubbles: true, composed: true };

const Type = {
    pending: "PendingSuspense",
    fulfilled: "FulfilledSuspense",
    rejected: "RejectedSuspense",
    aborted: "AbortedSuspense",
};

/**
 * @type {import("core").UseAsync}
 */
export const useAsync = (callback, args) => {
    const dispatchPending = useEvent(Type.pending, Config);
    const dispatchFulfilled = useEvent(Type.fulfilled, Config);
    const dispatchRejected = useEvent(Type.rejected, Config);
    const dispatchAborted = useEvent(Type.aborted, Config);

    const status = usePromise(callback, args);

    useLayoutEffect(() => {
        if (status.pending) {
            dispatchPending();
        } else if (status.fulfilled) {
            dispatchFulfilled();
        } else if (status.aborted) {
            dispatchAborted();
        } else {
            dispatchRejected();
        }
    }, [status]);

    if (status.pending) {
        throw IdSuspense;
    }
    // @ts-ignore
    return status.result;
};

/**
 * @type {import("core").UseSuspense}
 */
export const useSuspense = (fps = 8) => {
    const host = useHost();

    /**
     * @type {import("internal/hooks").ReturnSetStateUseSuspense}
     */
    const [status, setStatus] = useState({ pending: true });

    /**
     * @param {()=>any} callback
     * @param {number} deep
     */
    const delay = (callback, deep) =>
        requestAnimationFrame(() =>
            deep ? delay(callback, --deep) : callback(),
        );

    useInsertionEffect(() => {
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
                            : { fulfilled: true },
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
            if (type === Type.pending) {
                size++;
                rejected = false;
                aborted = false;
            } else if (type === Type.fulfilled) {
                size--;
            } else if (type === Type.aborted) {
                size--;
                aborted = true;
            } else {
                size--;
                rejected = true;
            }
            check();
        };

        const unlisteners = [
            addListener(current, Type.pending, handler),
            addListener(current, Type.fulfilled, handler),
            addListener(current, Type.rejected, handler),
            addListener(current, Type.aborted, handler),
        ];

        return () => unlisteners.forEach((unlistener) => unlistener());
    }, []);

    return status;
};
