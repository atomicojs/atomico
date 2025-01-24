import { Mark } from "../../render.js";
import { isEqualArray } from "../../utils.js";
import { useId } from "../create-hooks.js";
import { useLayoutEffect, useState } from "../hooks.js";
import { useListener } from "./use-listener.js";

/**
 * @type {import("hooks").UseSlot}
 */
export const useSlot = (ref, filter) => {
    const [slots, setSlots] = useState([]);

    const id = useId();

    const update = () => {
        const nextNodes = ref.current.assignedNodes();
        const prevSlots = ref[id] || [];

        if (isEqualArray(prevSlots, nextNodes)) return;

        ref[id] = nextNodes;

        setSlots(
            ref.current
                .assignedNodes()
                .filter((node) =>
                    node instanceof Mark ? false : filter ? filter(node) : true
                )
        );
    };

    useListener(ref, "slotchange", update);

    useLayoutEffect(update, []);

    return slots;
};
