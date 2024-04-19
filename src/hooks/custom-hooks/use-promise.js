import { useContext } from "../../context.js";
import { useId } from "../create-hooks.js";
import { useEffect, useLayoutEffect, useState } from "../hooks.js";
import { SuspenseContext, SuspenseEvent } from "./use-suspense.js";
/**
 * @type {import("core").UsePromise}
 */
export const usePromise = (callback, args, autorun = true) => {
    const id = useId();
    const { dispatch } = useContext(SuspenseContext);
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
        if (state.pending) {
            dispatch(SuspenseEvent.pending, id);
        } else if (state.rejected) {
            dispatch(SuspenseEvent.rejected, id);
        } else if (state.aborted) {
            dispatch(SuspenseEvent.aborted, id);
        } else {
            dispatch(SuspenseEvent.fulfilled, id);
        }
    }, [dispatch, state]);

    useEffect(
        () => () => {
            dispatch(SuspenseEvent.fulfilled, id);
        },
        [dispatch]
    );

    return state;
};
