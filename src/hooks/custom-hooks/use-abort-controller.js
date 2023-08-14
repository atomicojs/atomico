import { useMemo, useEffect } from "../hooks.js";

/**
 * @type {import("core").UseAbortController}
 */
export const useAbortController = (args) => {
    const abortController = useMemo(() => new AbortController(), args);

    useEffect(() => () => abortController.abort(), [abortController]);

    return abortController;
};
