import { useHook } from "./component";
import { isEqualArray } from "./utils";
import { COMPONENT_CREATE, COMPONENT_UPDATE } from "./constants";

export function useRef(current) {
    let [state] = useHook((state = {}, action) =>
        action.type === COMPONENT_CREATE ? { current } : state
    );
    return state;
}

export function useMemo(callback, args) {
    let [state] = useHook((state, action) => {
        switch (action.type) {
            case COMPONENT_CREATE:
            case COMPONENT_UPDATE:
                return {
                    args,
                    value:
                        action.type === COMPONENT_CREATE
                            ? callback()
                            : isEqualArray(args, state.args)
                            ? state.value
                            : callback()
                };
        }
        return state;
    });
    return state.value;
}
