import { useHost } from "../create-hooks.js";
import { dispatchEvent } from "../../element/set-prototype.js";

/**
 * @type {import("core").UseEvent}
 */
export let useEvent = (type, eventInit = {}) => {
    let ref = useHost();
    if (!ref[type]) {
        ref[type] = (detail = eventInit.detail) =>
            dispatchEvent(ref.current, {
                type,
                ...eventInit,
                detail,
            });
    }
    return ref[type];
};
