import { useEvent } from "./use-event.js";

export const SuspenseEventConfig = { bubbles: true, composed: true };

export const SuspenseEvent = {
    pending: "PendingSuspense",
    fulfilled: "FulfilledSuspense",
    rejected: "RejectedSuspense",
    aborted: "AbortedSuspense"
};

export const useSuspenceEvents = () => ({
    pending: useEvent(SuspenseEvent.pending, SuspenseEventConfig),
    fulfilled: useEvent(SuspenseEvent.fulfilled, SuspenseEventConfig),
    rejected: useEvent(SuspenseEvent.rejected, SuspenseEventConfig),
    aborted: useEvent(SuspenseEvent.aborted, SuspenseEventConfig)
});
