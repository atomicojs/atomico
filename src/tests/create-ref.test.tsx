import { expect, describe, it } from "vitest";
import { createRef, Ref } from "../ref.js";

describe("src/element/create-ref", () => {
    it("createRef", async () => {
        const ref = createRef();
        expect(ref).toBeInstanceOf(Ref);
    });
    it("createRef - value", async () => {
        const ref = createRef(10);
        expect(ref.current).toEqual(10);
    });
    it("createRef - on", async () => {
        const ref = createRef(10);

        const off = ref.on(() => {
            expect(ref.current).toEqual(11);
        });

        ref.current++;

        ref.current = 11;

        off();

        ref.current++;
    });
});
