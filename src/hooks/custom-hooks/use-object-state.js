import { useHook, useUpdate } from "../create-hooks.js";
import { createState } from "../state.js";
/**
 * Create a persistent local state
 * @type {import("core").UseState}
 */
export const useObjectState = (initialState) => {
    // retrieve the render to request an update
    const update = useUpdate();
    return useHook(
        (
            state = createState(initialState, update, (state, newState) => {
                let changed = false;
                for (const key in newState) {
                    if (state[key] !== newState[key]) {
                        changed = true;
                        break;
                    }
                }
                return changed ? { ...state, ...newState } : state;
            })
        ) => state
    );
};
