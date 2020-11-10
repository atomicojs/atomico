import { useHost } from "../create-hooks.js";
import { dispatchEvent } from "../../element/set-prototype.js";
/**
 *
 * @param {string} type
 * @param {import("../../element/set-prototype").InternalEventInit} [eventInit]
 */
export function useEvent(type, eventInit = {}) {
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
}
