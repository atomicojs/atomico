import { useState, useEffect, useCallback } from "../core/core";
import { redirect, getPathname, subscribe } from "./location";
import { match, join } from "./parse";

export function useHistory() {
    let pathname = getPathname();
    let [state, setState] = useState({ pathname });

    useEffect(() => {
        function handler() {
            let pathname = getPathname();
            setState(state =>
                state.pathname != pathname ? { pathname } : state
            );
        }
        return subscribe(handler);
    }, []);
    return [pathname, redirect];
}

export function useMatchRoute(path) {
    return match(path, getPathname());
}

export function useRoute(path, parentPath) {
    useHistory();
    return useMatchRoute(join(parentPath, path));
}

export function useRedirect(parentPath) {
    return useCallback(
        subPath =>
            redirect(
                join(parentPath, typeof subPath == "string" ? subPath : "")
            ),
        [parentPath]
    );
}

export function useRouter(cases, parentPath) {
    let def = "default";
    let [pathname] = useHistory();
    for (let key in cases) {
        if (key != def) {
            let [status, params] = match(join(parentPath, key), pathname);
            if (status) return cases[key](params);
        }
    }
    return cases[def]();
}
