import { useHost } from "../create-hooks.js";
import { dispatchEvent } from "../../element/set-prototype.js";

/**
 * @type {import("core").UseEvent}
 */
export const useEvent = (type, eventInit = {}) => {
    const ref = useHost();
    if (!ref[type]) {
        ref[type] = (detail = eventInit.detail) =>
            dispatchEvent(ref.current, {
                type,
                ...eventInit,
                detail
            });
    }
    return ref[type];
};
