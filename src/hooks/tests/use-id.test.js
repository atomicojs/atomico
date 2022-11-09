import { expect } from "@esm-bundle/chai";
import { createHooks, useId } from "../create-hooks.js";

describe("useId", () => {
    it("default", () => {
        const hooks = createHooks();

        const result = hooks.load(() => [useId(), useId(), useId()]);

        expect(result).to.deep.equal(["0-0", "0-1", "0-2"]);
    });
    it("custom", () => {
        const hooks = createHooks(undefined, undefined, "s0");

        const result = hooks.load(() => [useId(), useId(), useId()]);

        expect(result).to.deep.equal(["s0-0", "s0-1", "s0-2"]);
    });
});
