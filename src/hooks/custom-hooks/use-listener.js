import { addListener } from "../../utils.js";
import { useRef } from "../create-hooks.js";
import { useLayoutEffect } from "../hooks.js";

/**
 * @type {import("hooks").UseListener}
 */
export const useListener = (ref, type, listener, options) => {
    const refListener = useRef();
    refListener.current = listener;
    useLayoutEffect(
        () =>
            ref.current &&
            addListener(
                ref.current,
                type,
                (event) => refListener.current(event),
                options
            ),
        [ref.current]
    );
};
