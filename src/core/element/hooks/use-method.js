import { useHost } from "../../hooks";

export function useMethod(name, callback) {
    let { current } = useHost();
    if (!current[name]) {
        let method = (...args) => method._(...args);
    }
    current._ = callback;
    return current[name];
}
