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
            "createRef",
            "useLayoutEffect",
            "useEffect",
            "useRefEffect",
            "useProp",
            "useHost",
            "useEvent",
            "usePromise",
            "useProvider",
            "useMemo",
            "useCallback",
            "useRef",
            "useReducer",
            "useUpdate",
            "useHook",
            "Mark",
            "Ref",
            "Error",
            "PropError",
            "ParseError",
            "Any",
            "options",
            "template",
            "useContext",
            "useAsync",
            "useSuspense",
            "useAbortController",
            "createContext",
            "createElement",
            "createType",
            "useId",
            "useInsertionEffect",
            "Fragment"
        );
    });
});
