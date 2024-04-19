import { IdSuspense } from "../create-hooks.js";
import { usePromise } from "../custom-hooks/use-promise.js";
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
