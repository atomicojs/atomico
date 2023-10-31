import { useEffect, useState } from "../hooks.js";

/**
 * @type {import("core").UsePromise}
 */
export const usePromise = (callback, args, autorun = true) => {
    /**
     * @type {import("core").ReturnUseState<import("core").ReturnPromise<any>>}
     */
    const [state, setState] = useState(autorun ? { pending: autorun } : {});

    /**
     * @type {any[]}
     */
    const currentArgs = args || [];

    useEffect(() => {
        if (autorun) {
            let cancel;

            setState(state.pending ? state : { pending: true });

            callback(...currentArgs).then(
                (result) => !cancel && setState({ result, fulfilled: true }),
                (result) =>
                    !cancel &&
                    setState(
                        result?.name === "AbortError"
                            ? { result, aborted: true }
                            : { result, rejected: true },
                    ),
            );

            return () => (cancel = true);
        }
        setState((state) => (Object.keys(state).length ? {} : state));
    }, [autorun, ...currentArgs]);

    return state;
};
