import { useState, useEffect } from "../core/core";
import { isFunction } from "../core/utils";

let def = "default";

let typeLoading = "loading";

let typeResolve = "resolve";

let typeReject = "reject";

let defMsLoading = 100;

let WhenLoading = () => ({ loading, ...props }) =>
    isFunction(loading) ? loading(props) : loading;

let WhenError = () => ({ error = "", ...props }) =>
    isFunction(error) ? error(props) : error;

let WhenEmpty = () => () => "";

/**
 * It allows to load a component asynchronously.
 * @param {Function} callback
 * @param {object} [props]
 *
 * @todo add promise error detection behavior
 */
export function useLazy(callback, args = [], msLoading = defMsLoading) {
    let [Component, setComponent] = useState(WhenEmpty);
    useEffect(() => {
        let cancel;
        let ready;

        callback()
            .then(data => {
                ready = true;
                if (!cancel) {
                    let value = def in data ? data[def] : data;
                    setComponent(() => props =>
                        isFunction(value) ? value(props) : value
                    );
                }
            })
            .catch(() => {
                ready = true;
                if (!cancel) setComponent(WhenError);
            });

        setTimeout(
            () => !cancel && !ready && setComponent(WhenLoading),
            msLoading
        );
        return () => {
            cancel = true;
            if (ready) setComponent(() => WhenEmpty);
        };
    }, args);

    return Component;
}

export function useLazyNode(callback, msLoading = defMsLoading) {
    let [prevent, setPrevent] = useState(true);
    let [status, setStatus] = useState();
    let [Component, setComponent] = useState(WhenEmpty);

    function CaseProxy(props) {
        if (prevent) setPrevent(prevent => (prevent ? false : prevent));
        return status == typeLoading
            ? WhenLoading()(props)
            : status == typeResolve
            ? Component(props)
            : status == typeReject
            ? WhenError()(props)
            : WhenEmpty()();
    }

    useEffect(() => {
        if (!prevent) {
            callback()
                .then(md => {
                    setStatus(typeResolve);
                    setComponent(() => (def in md ? md[def] : md));
                })
                .catch(e => setStatus(typeReject));
            setTimeout(
                () =>
                    setStatus(status =>
                        [typeLoading, typeReject, typeResolve].includes(status)
                            ? status
                            : typeLoading
                    ),
                msLoading
            );
        }
    }, [prevent]);

    return CaseProxy;
}
