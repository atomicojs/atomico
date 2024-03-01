import { PropError } from "../../core.js";
import { isFunction } from "../../utils.js";
import { useHost, useHook } from "../create-hooks.js";
import { State } from "../state.js";
/**
 *
 * @type {import("core").UseProp}
 */
export const useProp = (name) => {
    const { current } = useHost();
    if (!(name in current))
        throw new PropError(
            current,
            `For useProp("${name}"), the prop does not exist on the host.`,
            name
        );

    return useHook(
        (
            state = new State(current[name], (nextState, state) => {
                nextState = isFunction(nextState)
                    ? nextState(current[name])
                    : nextState;

                current[name] = nextState;
            })
        ) => {
            state[0] = current[name];
            return state;
        }
    );
};
