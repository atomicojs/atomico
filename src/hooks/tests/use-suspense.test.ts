import { describe, it } from "vitest";
import { SuspenseContext } from "../custom-hooks/use-suspense.js";

describe("useSuspense", () => {
    it("default context execution", () => {
        SuspenseContext.value.dispatch();
    });
});
