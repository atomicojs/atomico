import { useHost } from "../../hooks";

export function useProp(name) {
    let ref = useHost();
    if (name in ref.current) {
        if (!ref[name]) {
            ref[name] = [null, nextValue => (ref.current[name] = nextValue)];
        }
        ref[name][0] = ref.current[name];
        return ref[name];
    }
}
