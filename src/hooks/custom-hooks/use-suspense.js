import { useHost, IdSuspense } from "../create-hooks.js";
import { useEvent } from "../custom-hooks/use-event.js";
import { usePromise } from "../custom-hooks/use-promise.js";
import { useLayoutEffect, useState } from "../hooks.js";
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

export function useAsync(callback, args) {
    const host = useHost();
    const dispatchPending = useEvent(Type.pending, Config);
    const dispatchFulfilled = useEvent(Type.fulfilled, Config);
    const dispatchRejected = useEvent(Type.rejected, Config);

    const status = usePromise(callback, args);

    useLayoutEffect(() => {
        const { current } = host;

        console.log(status);

        if (status.pending) {
            dispatchPending(current);
        } else if (status.fulfilled) {
            dispatchFulfilled(current);
        } else {
            dispatchRejected(current);
        }
    }, [status]);

    if (status.pending) {
        throw IdSuspense;
    }

    return status.result;
}

export function useSuspense() {
    const host = useHost();
    const [status, setStatus] = useState({ pending: true });

    useLayoutEffect(() => {
        const { current } = host;
        const task = new Set();
        /**
         * @param {CustomEvent<HTMLElement>} event
         */
        const handler = (event) => {
            event.stopImmediatePropagation();
            const { detail, type } = event;
            if (type === Type.pending) {
                task.add(detail);
                setStatus((status) =>
                    status.pending ? status : { pending: true }
                );
            } else if (type === Type.fulfilled) {
                task.delete(detail);
                setStatus((status) =>
                    task.size
                        ? status
                        : status.pending
                        ? { fulfilled: true }
                        : status
                );
            } else if (type === Type.rejected) {
                task.delete(detail);
                setStatus({ rejected: true });
            }
        };

        const unlisteners = [
            addListener(current, Type.pending, handler),
            addListener(current, Type.fulfilled, handler),
            addListener(current, Type.rejected, handler),
        ];

        return () => unlisteners.forEach((unlistener) => unlistener());
    }, []);

    return status;
}
