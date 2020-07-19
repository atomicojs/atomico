import { useHost } from "../hooks";
import { dispatchEvent } from "../../element/set-prototype";

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
