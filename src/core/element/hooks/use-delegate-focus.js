import { useHost, useMemo } from "../../hooks";

export function useDelegateFocus(ref) {
    let { current } = useHost();
    return useMemo(() => (current.focus = () => ref.current.focus), [ref]);
}
