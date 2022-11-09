import { useHost, IdSuspense } from "../create-hooks.js";
import { useEvent } from "../custom-hooks/use-event.js";
import { usePromise } from "../custom-hooks/use-promise.js";
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
};

/**
 * @type {import("core").UseAsync}
 */
export const useAsync = (callback, args) => {
    const dispatchPending = useEvent(Type.pending, Config);
    const dispatchFulfilled = useEvent(Type.fulfilled, Config);
    const dispatchRejected = useEvent(Type.rejected, Config);

    const status = usePromise(callback, args);

    useLayoutEffect(() => {
        if (status.pending) {
            dispatchPending();
        } else if (status.fulfilled) {
            dispatchFulfilled();
        } else {
            dispatchRejected();
        }
    }, [status]);

    if (status.pending) {
        throw IdSuspense;
    }

    return status.result;
};

/**
 *
 * @type {import("core").UseSuspense}
 */

export const useSuspense = (fps = 8) => {
    const host = useHost();
    /**
     * @type {import("internal/hooks").ReturnSetStateUseSuspense}
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
            if (type === Type.pending) {
                size++;
                rejected = false;
            } else if (type === Type.fulfilled) {
                size--;
            } else if (type === Type.rejected) {
                size--;
                rejected = true;
            }
            check();
        };

        const unlisteners = [
            addListener(current, Type.pending, handler),
            addListener(current, Type.fulfilled, handler),
            addListener(current, Type.rejected, handler),
        ];

        return () => unlisteners.forEach((unlistener) => unlistener());
    }, []);

    return status;
};
