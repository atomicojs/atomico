import { addListener } from "../../utils.js";
import { useLayoutEffect } from "../hooks.js";

/**
 * @type {import("hooks").UseListener}
 */
export const useListener = (ref, type, listener, options) => {
    useLayoutEffect(
        () => ref.current && addListener(ref.current, type, listener, options),
        [ref.current]
    );
};
