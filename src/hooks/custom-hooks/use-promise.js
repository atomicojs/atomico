import { isObject, timeStamp } from "../../utils.js";
import { useContext } from "../../context.js";
import { useId } from "../create-hooks.js";
import { useEffect, useLayoutEffect, useState } from "../hooks.js";
import { SuspenseContext, SuspenseEvent } from "./use-suspense.js";
/**
 * @type {import("core").UsePromise}
 */
export const usePromise = (callback, args, options = true) => {
    const id = useId();
    const { dispatch } = useContext(SuspenseContext);
    const { autorun, memo } = isObject(options)
        ? options
        : { autorun: options };
    /**
     * @type {import("core").ReturnUseState<import("core").ReturnPromise<any>>}
     */
    const [state, setState] = useState(() =>
        autorun ? { pending: true, startTime: timeStamp() } : {}
    );
    /**
     * @type {any[]}
     */
    const currentArgs = args || [];

    useEffect(() => {
        if (autorun) {
            let cancel;

            setState((state) =>
                state.pending
                    ? state
                    : {
                          pending: true,
                          startTime: timeStamp(),
                          result: memo ? state.result : undefined,
                          error: memo ? state.error : undefined
                      }
            );

            callback(...currentArgs).then(
                (result) => {
                    !cancel &&
                        setState(({ startTime }) => ({
                            result,
                            fulfilled: true,
                            startTime,
                            endTime: timeStamp()
                        }));
                },
                (error) => {
                    !cancel &&
                        setState(({ startTime, result }) =>
                            error?.name === "AbortError"
                                ? {
                                      error,
                                      result,
                                      aborted: true,
                                      startTime,
                                      endTime: timeStamp()
                                  }
                                : {
                                      error,
                                      result,
                                      rejected: true,
                                      startTime,
                                      endTime: timeStamp()
                                  }
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
