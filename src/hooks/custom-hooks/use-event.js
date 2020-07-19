import { useHost } from "../hooks.js";
import { dispatchEvent } from "../../element/set-prototype.js";

export function useEvent(type, eventInit = {}) {
    let ref = useHost();
    if (!ref[type]) {
        ref[type] = (detail) =>
            dispatchEvent(ref.current, {
                type,
                ...eventInit,
                detail: detail || eventInit.detail,
            });
    }
    return ref[type];
}
