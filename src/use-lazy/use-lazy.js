import { useState, useEffect } from '../core/core';
import { fps, isFunction } from '../core/utils';

let Loading = ({ loading, ...props }) => loading;

let def = 'default';

/**
 * It allows to load a component asynchronously.
 * @param {Function} callback
 * @param {object} [props]
 */
export function useLazy(callback, args = []) {
    let [view, setView] = useState(() => Loading);
    useEffect(() => {
        let cancel;
        let ready;

        callback().then(data => {
            ready = true;
            if (!cancel) {
                setView(() => (def in data ? data[def] : data));
            }
        });
        fps(() => !ready && !cancel);
        return () => {
            cancel = true;
            if (ready) setView(() => Loading);
        };
    }, args);
    return view;
}
