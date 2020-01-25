import { useState, useEffect } from "../core/core";
import { isEqualArray } from "../core/utils";

export const LAZY_STATE_LOADING = "loading";

export const LAZY_STATE_ERROR = "error";

export const LAZY_STATE_DONE = "done";

export function useLazy(callback, run, initWithLoading) {
    let initialState = initWithLoading ? [LAZY_STATE_LOADING] : [];
    let [state, setState] = useState(initialState);

    useEffect(() => {
        if (run) {
            if (!initWithLoading) {
                setTimeout(() => {
                    if (run) setState([LAZY_STATE_LOADING]);
                }, 50);
            }
            callback()
                .then(md => {
                    if (run) setState([LAZY_STATE_DONE, md.default || md]);
                    run = false;
                })
                .catch(e => {
                    if (run) setState([LAZY_STATE_ERROR]);
                    run = false;
                });
            return () => {
                run = false;
                setState(state =>
                    isEqualArray(state, initialState)
                        ? state
                        : [LAZY_STATE_LOADING]
                );
            };
        }
    }, [run]);

    return state;
}
