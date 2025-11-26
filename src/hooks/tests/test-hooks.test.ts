import { describe, expect, it } from "vitest";
import * as testHooks from "../test-hooks.js";

describe("src/hooks/test-hooks", () => {
    it("core export", () => {
        expect(testHooks).toHaveProperty("EFFECT");
        expect(testHooks).toHaveProperty("LAYOUT_EFFECT");
        expect(testHooks).toHaveProperty("INSERTION_EFFECT");
        expect(testHooks).toHaveProperty("UNMOUNT");
        expect(testHooks).toHaveProperty("createHooks");
    });
});
