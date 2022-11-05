import { useEffect, useState } from "../hooks.js";

/**
 * @template {(...args:any[])=>Promise<any>} T
 * @param {T} callback
 * @param {any[]} args
 * @param {boolean|undefined} [autorun]
 */
export function usePromise(callback, args = [], autorun = true) {
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

    return state;
}
