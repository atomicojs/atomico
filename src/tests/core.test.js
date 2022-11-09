import { expect } from "@esm-bundle/chai";
import * as core from "../core.js";

describe("src/core", () => {
    it("core export", () => {
        expect(core).to.have.keys(
            "c",
            "h",
            "css",
            "render",
            "useState",
            "useLayoutEffect",
            "useEffect",
            "useProp",
            "useHost",
            "useEvent",
            "usePromise",
            "useMemo",
            "useCallback",
            "useRef",
            "useReducer",
            "useUpdate",
            "useHook",
            "Mark",
            "PropError",
            "Any",
            "options",
            "template",
            "useContext",
            "useAsync",
            "useSuspense",
            "createContext",
            "useInsertionEffect",
            "Fragment"
        );
    });
});
