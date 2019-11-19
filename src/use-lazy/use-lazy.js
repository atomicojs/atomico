import { useState, useEffect } from "../core/core";
import { isFunction } from "../core/utils";

let def = "default";

let CaseLoading = () => ({ loading, ...props }) =>
    isFunction(loading) ? loading(props) : loading;

let CaseError = () => ({ error = "", ...props }) =>
    isFunction(error) ? error(props) : error;

let CaseEmpty = () => () => "";

/**
 * It allows to load a component asynchronously.
 * @param {Function} callback
 * @param {object} [props]
 *
 * @todo add promise error detection behavior
 */
export function useLazy(callback, args = [], msLoading = 100) {
    let [Case, setCase] = useState(CaseEmpty);
    useEffect(() => {
        let cancel;
        let ready;

        callback()
            .then(data => {
                ready = true;
                if (!cancel) {
                    let value = def in data ? data[def] : data;
                    setCase(() => props =>
                        isFunction(value) ? value(props) : value
                    );
                }
            })
            .catch(() => {
                ready = true;
                if (!cancel) setCase(CaseError);
            });

        setTimeout(
            () => (!cancel && !ready ? setCase(CaseLoading) : 0),
            msLoading
        );
        return () => {
            cancel = true;
            if (ready) setCase(() => CaseEmpty);
        };
    }, args);

    return Case;
}
