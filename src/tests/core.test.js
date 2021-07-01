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
            "useMemo",
            "useCallback",
            "useRef",
            "useReducer",
            "useUpdate",
            "Mark",
            "PropError",
            "Any",
            "options"
        );
    });
});
