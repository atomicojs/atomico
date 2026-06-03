import { useHost } from "../create-hooks.js";
import { dispatchEvent, SYMBOL_EVENT } from "../../element/set-prototype.js";
import { isFunction } from "../../utils.js";

/**
 * @type {import("core").UseEvent}
 */
export const useEvent = (type, eventInit = {}) => {
    const ref = useHost();
    if (!ref[type]) {
        ref[type] = (detail = eventInit.detail) => {
            const target = ref.current[type];
            if (isFunction(target) && (target[SYMBOL_EVENT] || type === "click")) {
                target(detail);
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
