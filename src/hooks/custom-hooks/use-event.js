import { useHost } from "../create-hooks.js";
import { dispatchEvent } from "../../element/set-prototype.js";

/**
 * @type {import("core").UseEvent}
 */
export const useEvent = (type, eventInit = {}) => {
    const ref = useHost();
    if (!ref[type]) {
        ref[type] = (detail = eventInit.detail) => {
            if (type in ref.current) {
                ref.current[type](detail);
            } else {
                dispatchEvent(ref.current, {
                    type,
                    ...eventInit,
                    detail
                });
            }
        };
    }
    return ref[type];
};
