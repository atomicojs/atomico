import { useEffect, useState } from "../hooks.js";

/**
 * @type {import("core").UsePromise}
 */
export const usePromise = (callback, args, autorun = true) => {
    const [state, setState] = useState({});

    useEffect(() => {
        if (autorun) {
            let cancel;

            setState({ pending: true });

            callback(...args).then(
                (result) => !cancel && setState({ result, fulfilled: true }),
                (result) => !cancel && setState({ result, rejected: true })
            );

            return () => (cancel = true);
        } else {
            setState({});
        }
    }, [autorun, ...args]);

    //@ts-ignore
    return state;
};
