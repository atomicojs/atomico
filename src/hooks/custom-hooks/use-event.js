import { useHost } from "../create-hooks.js";
import { dispatchEvent } from "../../element/set-prototype.js";
/**
 *
 * @param {string} type
 * @param {Event} eventInit
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

/**
 * Interface used by dispatchEvent to automate event firing
 * @typedef {Object} Event
 * @property {boolean} [bubbles] - indicating whether the event bubbles. The default is false.
 * @property {boolean} [cancelable] - indicating whether the event will trigger listeners outside of a shadow root.
 * @property {boolean} [composed] - indicating whether the event will trigger listeners outside of a shadow root.
 * @property {any} [detail] - indicating whether the event will trigger listeners outside of a shadow root.
 */
