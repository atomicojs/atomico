import { useHost, useMemo } from "../../hooks";

const WITH_DELEGATE_FOCUS = Symbol("delegateFocus");

export function useDelegateFocus(ref) {
    let { current } = useHost();
    if (!current[WITH_DELEGATE_FOCUS]) {
        current.tabIndex = 0;
        current.addEventListener("focus", () => {
            current[WITH_DELEGATE_FOCUS].current.focus();
        });
    }
    current[WITH_DELEGATE_FOCUS] = ref;
}
