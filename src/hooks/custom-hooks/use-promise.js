import { useEffect, useState } from "../hooks.js";

/**
 * @type {import("core").UsePromise}
 */
export const usePromise = (callback, args, autorun = true) => {
    /**
     * @type {import("core").ReturnUseState<import("core").ReturnPromise<any>>}
     */
    const [state, setState] = useState(autorun ? { pending: autorun } : {});

    useEffect(() => {
        if (autorun) {
            let cancel;

            setState(state.pending ? state : { pending: true });

            callback(...args).then(
                (result) => !cancel && setState({ result, fulfilled: true }),
                (result) => !cancel && setState({ result, rejected: true })
            );

            return () => (cancel = true);
        } else {
            setState((state) => (Object.keys(state).length ? {} : state));
        }
    }, [autorun, ...args]);

    return state;
};
