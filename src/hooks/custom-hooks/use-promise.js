import { useEffect, useLayoutEffect, useState } from "../hooks.js";
import { useSuspenceEvents } from "./use-suspence-events.js";
import { DOMLoaded } from "../../loaded.js";
/**
 * @type {import("core").UsePromise}
 */
export const usePromise = (callback, args, autorun = true) => {
    const dispatch = useSuspenceEvents();
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
                (result) => {
                    !cancel && setState({ result, fulfilled: true });
                },
                (result) => {
                    !cancel &&
                        setState(
                            result?.name === "AbortError"
                                ? { result, aborted: true }
                                : { result, rejected: true }
                        );
                }
            );

            return () => (cancel = true);
        } else {
            setState((state) => (Object.keys(state).length ? {} : state));
        }
    }, [autorun, ...currentArgs]);

    useLayoutEffect(() => {
        DOMLoaded.then(() => {
            if (state.pending) {
                dispatch.pending();
            } else if (state.fulfilled) {
                dispatch.fulfilled();
            } else if (state.aborted) {
                dispatch.aborted();
            } else {
                dispatch.rejected();
            }
        });
    }, [state]);

    return state;
};
