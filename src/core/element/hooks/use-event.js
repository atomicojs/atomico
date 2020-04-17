import { useHost } from "../../hooks";
import { dispatchEvent } from "../base-element";

export function useEvent(type, customEventInit) {
    let ref = useHost();
    if (!ref[type]) {
        ref[type] = (detail) =>
            dispatchEvent(
                ref.current,
                type,
                detail ? { ...customEventInit, detail } : customEventInit
            );
    }
    return ref[type];
}
